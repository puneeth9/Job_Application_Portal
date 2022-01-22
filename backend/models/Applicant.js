const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const edu = new Schema({
    instituteName : {
        type: String
    },
    startYear : {
        type : Number,
        required : true
    },
    endYear : {
        type: Number
    }
});
const ApplicantSchema = new Schema({
    name: {type: String,required:true},
    email: {type: String,unique:true,required:true},
    education: {type : [edu],default: []},
    skills: {type: [String],default:[]},
    openapplications: {type: Number , default:0},
    rating: {type: mongoose.Types.Decimal128,default:0,min:0,max:5},
    password: {type: String,required:true},
    status:{type:String,enum:['Working','Not Working'],default:'Not Working'}
});
let Applicant = mongoose.model('Applicant', ApplicantSchema);

module.exports = Applicant;