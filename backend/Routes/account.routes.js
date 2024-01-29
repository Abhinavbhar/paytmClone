import express from 'express';
import { Accounts } from '../db.js';
import { User } from '../db.js';
import mongoose from 'mongoose';
import { authMiddleware } from './middlewares.js';
const router = express.Router();
router.get('/balance',authMiddleware,async(req,res)=>{
    const Account = await Accounts.findOne({
        userId:req.userId
    })
    res.status(200).json({
        balance:Account.balance
    })
})
router.post('/tranfer',authMiddleware,async(req,res)=>{
    const session = await mongoose.startSession();
    session.startTransaction();
    const {to , amount}= req.body;
    const account = await Accounts.findOne({
        userId:req.userId
    }).session(session)
    if(!account||account.balance<amount){
        await session.abortTransaction(); 
        res.status(404).json({
            message:"insufficient balance"
        })
    }
    const reciever = await User.findOne({username:to})
    const toAccount = await Accounts.findOne({userId:reciever._id
    }).session(session)
    if(!toAccount){
        await session.abortTransaction();
        res.status(400).json({message:"Account not found "})
    }
    await Accounts.updateOne({userId:req.userId},{$inc:{balance:-amount}}).session(session)
    await Accounts.updateOne({userId:reciever._id},{$inc:{balance:+amount}}).session(session)
    await session.commitTransaction();
    res.json({
        message:"transaction completed successfully"
    })
})
export default router 