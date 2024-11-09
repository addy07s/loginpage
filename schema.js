const mongoose = require('mongoose');



const schema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: false  },
    userid: { type: String, required: true, unique: true },
    password: { type: String, required: true },
})

const model = mongoose.model("details", schema, "details");

module.exports =model; 