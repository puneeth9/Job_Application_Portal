const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectId = require('mongoose').ObjectId;

// Create Schema
var JobSchema = new Schema({
	title: {type: String},
	recruiterName: {type: String},
	recruiterEmail: {type: String},
	remainingPositions:{type:Number},
	numberOfApplications:{type:Number,default:0},
	maxPositions: {type: Number},
	maxApplicants: {type: Number},
	postDate: {type: Date,default: Date.now},
	deadline: {type: Date},
	requiredSkills: {type: [String]},
	typeOfJob: {type: String,enum:['FT','PT','WFH']},
	duration: {type: Number},
	salary: {type: Number},
	rating: {type: mongoose.Types.Decimal128,min:0,max:5},
	status:{type:String,enum:['Open','Full'],default:'Open'}
});

var ApplicationSchema = new Schema({
    applemail:{type:String},
    recremail:{type:String},
	sop:{type:String},
	date:{type:Date,default:Date.now},
    status:{type:String,enum:['Accepted','Shortlisted','Rejected','Applied'],default:'Applied'},
    _jobid:{type:Schema.Types.ObjectId,ref:'Job'},
});
let Job = mongoose.model('Job', JobSchema);
let Application = mongoose.model('Application', ApplicationSchema);

module.exports = {Job,Application};