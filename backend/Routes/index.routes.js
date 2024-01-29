import express from 'express'
const app = express()
import accountRouter from './account.routes.js'
import userRouter from './userRouter.route.js'
const router = express.Router()
router.get('/',(req,res)=>{
    res.send("hello from router")
})
router.use('/user',userRouter)
router.use("/account",accountRouter)
export default router
