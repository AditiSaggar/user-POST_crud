const mongoose = require('mongoose');

const mySchema =  new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type:String,
        enum: ['editor','admin'],
        default:'editor'
    }
   
});

const user = mongoose.model("user", mySchema);
module.exports = user;

