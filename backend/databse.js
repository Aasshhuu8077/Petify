import mongoose from "mongoose";

    export const connectdb=()=>{
        mongoose.connect("mongodb://127.0.0.1:27017/petify").then(()=>{
            console.log("Db is connected");
        }).catch((err)=>console.log(err))
    }