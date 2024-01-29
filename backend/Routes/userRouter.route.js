import * as zod from 'zod';
import { User } from '../db.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import { authMiddleware } from './middlewares.js';
import { Accounts } from '../db.js';

import express from "express";
const router = express.Router()
const signupBody = zod.object({
    username: zod.string(),
	firstName: zod.string(),
	lastName: zod.string(),
	password: zod.string()
})

router.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body)
    
    if (!success) {
        console.log(success)
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken"
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })
    const userId = user._id;

    const token = jwt.sign({
        userId
    }, JWT_SECRET);
    const randomBalance = Math.floor(Math.random()*10000)
    await Accounts.create({
        userId:userId,
        balance:randomBalance
    })
    res.json({
        message: "User created successfully",
        token: token
    })
})
const signinBody = zod.object({
    username:zod.string(),
    password:zod.string()
})

router.post('/signin',async(req,res)=>{
    const {success}=signinBody.safeParse(req.body);
    if(!success){
        return res.status(401).json({
            message:"incorrect input type"
        })
    }
    
    const existinguser = await User.findOne({
        username: req.body.username,
        password:req.body.password
    })

    if(existinguser){
        const token = jwt.sign({
            user_id:existinguser._id,

        },JWT_SECRET)
        res.status(200).json({
            message:"user logged in successfully",
            token:token
        })
        return 
    }
    res.status(401).json({
        message:"user does not exist please signup"
    })
})
const updatingUser = zod.object({
    username:zod.string().min(3).max(30).optional(true),
    password:zod.string(),
    lastName:zod.string().toLowerCase().optional(true),
    firstname:zod.string().toLowerCase().optional(true),
})
router.put('/update',authMiddleware,async(req,res)=>{
    const {success}=updatingUser.safeParse(req.body);
    if(!success){
        res.status(404).json({
            message:"incorrect input type"
        })
        return
    }
    try {
        const updatingUser = await User.updateOne(req.body,{
            _id:req.userId
        })
        res.status(200).json({message:"user updated successfully"})
    } catch (error) {
        res.status(404).json({message:"failed to update user"})
    }

})
router.get('/bulk',authMiddleware,async(req,res)=>{
    const filter = req.query.filter||'';
    const users = await User.find(
        {
            $or:[{
                lastName:{
                    "$regex":filter,
                }
            },{
            firstName:{
                "$regex":filter
            }}
        ]
        }
    )
    res.json({
        user:users.map(user=>({
            username:user.username,
            firstName:user.firstName,
            lastName:user.lastName,
            _id:user._id
        }))
    })
})
export default router;