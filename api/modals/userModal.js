const mongoose = require("../config/db");

const userSchema = new mongoose.Schema({
    name:String,
    email:{
        type:String,
        unique:true
    },
    password:String,
    mobile:Number,
    createAt:{
        type: Date,
        default: new Date(),
    }
});

module.exports = mongoose.model("user",userSchema);