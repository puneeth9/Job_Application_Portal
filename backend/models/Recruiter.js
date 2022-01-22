const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecruiterSchema = new Schema({
    name:{type : String,required:true}, 
    email: {type: String,unique:true,required:true},
    contact: {type: String,default:""}, 
    bio: {type : String,default:""},
    password: {type: String,required:true}
});

let Recruiter = mongoose.model('Recruiter', RecruiterSchema);

module.exports = Recruiter;