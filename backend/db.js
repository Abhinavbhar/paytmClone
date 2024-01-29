import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});
export const User = mongoose.model('User', userSchema);
const AcountsSchema = new mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    balance :{
        type:Number,
        required: true
    }
})
export const Accounts = mongoose.model('Accounts',AcountsSchema)

export const connection =async()=>{  
try {
    const connect = await mongoose.connect("mongodb+srv://abhinavbhar2004:bhar2004@cluster0.xex9w2e.mongodb.net/?retryWrites=true&w=majority")
    console.log("connection successfull")
} catch (error) {
    console.log(error,"connection to mongoDb server failed")
}}

