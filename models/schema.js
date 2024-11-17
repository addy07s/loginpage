const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: false  },
    email: { type: String, required: true, unique: true },
    userid: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role:{type:String,
        enum:['guest','admin'],
        default: 'admin' ,
    }
})

const model = mongoose.model("details", schema, "details");

module.exports =model; 