const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const PORT = 5000;
let Routes = express.Router();
const DB_NAME = "job_application";

let Applicant = require("./models/Applicant.js");
let {Job,Application} = require("./models/Job.js");
let Recruiter = require("./models/Recruiter.js");
var ObjectId = require('mongoose').Types.ObjectId;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Connection to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/' + DB_NAME, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully !");
})
//Login API
Routes.route("/login").post(async function(req,res){
    
    var response ={
        value: "",
        type: "",
        email:"",
        name:"",
        msg:""
    };
    
    if (!req.body.email || !req.body.password) 
    {
        response.value = 0;
        response.msg="Username and Password are required fields";
        res.json(response);
    }
    else
    {
        var type;
        if(req.body.type===0)
            type = Applicant;
        else if(req.body.type===1) {
            type = Recruiter;
        }
            
        await type.findOne({email: req.body.email},function(err,user){
            if(err)
                console.log(err);
            else
            {
                if(!user)
                {
                    console.log("User doesn't exist");
                    response.value=1;
                    response.msg="Invalid Credentials";
                    res.json(response);
                }
                else
                {
                    if(user.password!=req.body.password)
                    {
                        console.log("Incorrect password");
                        response.value=1;
                        response.msg="Invalid Credentials";
                        res.json(response);
                    }
                    else
                    {
                        console.log("Correct password");
                        response.value=2;
                        response.msg="Login Successful";
                        response.type=req.body.type;
                        response.email=req.body.email;
                        response.name=user.name;
                        console.log(response);
                        res.json(response);
                    }
                }
            }
        })
    }

});


//Registration API
Routes.route("/register").post(async function(req,res){
    let input=Object.assign({}, req.body);
    delete input.type;
    var table;
    if(req.body.type==0)
        table = Applicant;
    else
        table = Recruiter;
    await table.findOne({email: input.email},async function(err,users){
        if(err)
        {
            console.log("Error");
            console.log(err);
        }
        else
        {
            if(!users)
            {
                await table.insertMany(input,function(err,users){
                    if(err)
                        res.status(400).json({message:err,value:0});
                    else
                        res.status(200).json({message:'New user added',value:1});
                });
            }
            else
                res.json({message:'User already exists',value:2});
        } 
    })
});

Routes.route("/profile").get(async function(req,res){
    var table;
    var projection;
    if(Number(req.query.type)===0)
    {
        table=Applicant;
        projection = 'name email education skills openapplications rating';
    }
    else
    {
        table=Recruiter;
        projection = 'name email contact bio';
    }
    await table.findOne({email:req.query.email},projection,function(err,users){
        if(err)
        {
            console.log(err);
            res.status(400);
        }
        else    
            res.status(200).json(users);
    });
});
// Edit profile API
Routes.route("/profile").put(async function(req,res){
    var table;
    if(req.body.type==0)
        table=Applicant;
    else
        table=Recruiter;
    let input=Object.assign({}, req.body);
    delete input.type;
    await table.findOneAndUpdate({email:req.body.email},input,function(err,z){
        if(err)
        {
            console.log(err);
            res.status(400).json({msg:err,status:0});
        }
        else   
        {
            console.log(z);
            res.status(200).json({status:1});
        }
    })
});
//Job listings 
function isEmpty(str) {
    return (!str || 0 === str.length);
}
Routes.route("/listings").get(async function(req,res){

    var mysort = {};
    if(!req.query.sortField)
        mysort['title'] = 1;
    else
       mysort[ req.query.sortField ] = req.query.sortOrder;
    var cond={deadline: { $gt: Date.now()}};
    if(!isEmpty(req.query.typeOfJob))
        cond = {$and:[{typeOfJob : req.query.typeOfJob},cond]};
    if(req.query.maxsalary)
        cond = {$and:[{$and: [{ salary: { $gte: Number(req.query.minsalary) } },{ salary: { $lte: Number(req.query.maxsalary)} }]},cond]};
    if(req.query.duration)
        cond = {$and:[{duration: {$lt : Number(req.query.duration)}},cond]};
    if(!isEmpty(req.query.searchTitle))
        cond = {$and:[{title:{$regex:req.query.searchTitle}},cond]};

    await Job.find(cond).sort(mysort).exec(function(err,jobs){
        if(err)
        {
            console.log("Error");
            console.log(err);
            res.status(400);
        }
        else
        {
            console.log("Successful");
            console.log(jobs);
            res.status(200).json(jobs);
        }
    });
});

Routes.route("/createjob").post(function(req,res){
    var new_job = new Job(req.body);
    new_job.remainingPositions=new_job.maxPositions;
    console.log(new_job);
    new_job.save(function(err,saved){
        if(err)
        {
            console.log(err);
            res.status(400).json({msg:err,status:0});
        }
        else
        {
            console.log(saved);
            res.status(200).json({msg:"Job creation successful",status:1});
        }
    });
});
Routes.route("/reclistings").get(async function(req,res){
   await Job.find({$and:[{recruiterEmail:req.query.email}]},function(err,jobs){
        if(err)
        {
            console.log(err);
            res.status(400).json({msg:err,status:0});
        }
        else
        {
            console.log(jobs);
            res.status(200).json({jobs,status:1});
        }
    });
});

Routes.route("/job").delete(async function(req,res){
    await Job.findByIdAndDelete(req.query.id,function(err,jobs){
        if(err)
        {
            console.log(err);
            res.status(400).json({msg:err,status:0});
        }
        else
        {
            res.status(200).json({msg:'Delete Successful',status:1});
        }
    });
});

Routes.route("/job").put(async function(req,res){
    var max_init,rem_init,numberofappl;
    await Job.findOne({_id:req.body.id},function(err,job){
        if(err)
        {
            console.log(err);
        }
        else
        {
            max_init=job.maxPositions;
            rem_init=job.remainingPositions;
            numberofappl=job.numberOfApplications;
            //console.log(job);
            //console.log(max_init,rem_init);
        }
    });
    var max_final=req.body.maxPositions;
    var rem_final=rem_init+max_final-max_init;
    //console.log("rem_final");
    var filter={_id:req.body.id};
    var query;
    if(rem_final>0 && numberofappl<req.body.maxApplicants)
        query={maxApplicants:req.body.maxApplicants,maxPositions:max_final,deadline:req.body.deadline,remainingPositions:rem_final,status:'Open'};
    else
        query={maxApplicants:req.body.maxApplicants,maxPositions:max_final,deadline:req.body.deadline,remainingPositions:rem_final,status:'Full'};

    await Job.updateOne(filter,query,function(err,job){
        if(err)
        {
            //console.log(err);
            res.status(400).json({msg:err,status:0});
        }
        else
        {
            console.log(job)
            res.status(200).json({msg:'Update Successful',status:1});
        }
    });
});

Routes.route("/job").get(async function(req,res){
    await Job.findById(req.query.id,function(err,job){
        if(err)
        {
            console.log(err);
            res.status(400).json({msg:err,status:0});
        }
        else
            res.status(200).json(job);
    });
});

Routes.route("/canapply").get(async function(req,res){
    var first,second;
    await Applicant.findOne({email:req.query.email},'openapplications',function(err,applicant){
        if(err)
            console.log(err);
        else
        {
            console.log(applicant);
            if(Number(applicant.openapplications)<10)
                first=1;
            else
                first=0;
        }
    })
    await Job.findOne({_id:req.query.jobid},'status',function(err,job){
        if(err)
            console.log(err);
        else
        {
            if(job.status==='Full')
                second=0;
            else
                second=1;
        }
    });
    
    if(first && second)
        res.json({value:1});
    if(!first && second)
        res.json({msg:'10 open Applications reached',value:0});
    if(first && !second)
        res.json({msg:'Maximum no. of Applicants reached',value:0});
    if(!first && !second)
        res.json({msg:'10 open Applications and maximum no.of Applications reached',value:0});
});

Routes.route("/apply").post(async function(req,res){
    const application={};
    application.sop=req.body.sop;
    application.applemail=req.body.applicantEmail;
    application._jobid=req.body.jobid;
    application.status='Applied';
    application.date=new Date();
    console.log("Ok");
    var check=1;
    var jobstatus;
    await Job.findOne({_id:req.body.jobid},'recruiterEmail status',function(err,job){
        if(err)
            check=0;
        else
        {
            application.recremail = job.recruiterEmail;
            jobstatus=job.status;
        }
    });
    if(jobstatus=='Open')
    {
        var newapplication=new Application(application);
        newapplication.save(function(err,result){
        if(err)
            check=0;
        else
            console.log(result);
        });
    }
    else
    {
        res.json({msg:'Job filled',value:2});
    }
    var final_open,final_applications;
    await Applicant.findOne({email:req.body.applicantEmail},'openapplications',function(err,user){
        if(err)
            check=0;
        else
            final_open=(user.openapplications) + 1;
    });
    await Job.findOne({_id:req.body.jobid},function(err,job){
        if(err)
            check=0;
        else 
        {
            final_applications=(job.numberOfApplications) +1;
            if(final_applications==job.maxApplicants)
            {
                jobstatus='Full';
            }
        }
    });
    await Applicant.updateOne({email:req.body.applicantEmail},{openapplications: final_open },function(err,user){
        if(err)
            check=0;
        else
            console.log(user);

    });
    await Job.updateOne({_id:req.body.jobid},{ numberOfApplications : final_applications,status:jobstatus},function(err,job){
        if(err)
            check=0;
        else
            console.log(job);

    });
    //console.log(job.status);
    if(check==0)
        res.status(400).json({msg:'Failed',value:0});
    else
        res.status(200).json({msg:'Successful',value:1});
});

Routes.route("/myapplications").get(async function(req,res){
    var empty=[];
    await Application.find({applemail:req.query.applemail},async function(err,forms){
        if(err)
            res.status(400);
        else if(forms)
        {
            var key;
            var response = [];
            var jobids = forms.map(function(form) {
                return form._jobid;
            });
            var jobs = await Job.find({_id: {$in: jobids}},'_id title deadline salary recruiterName');
            
            for(key in forms)
            {
                let temp = jobs.filter(function(job){return String(job._id)===String(forms[key]._jobid)});
                console.log(temp[0]);
                temp[0].status=forms[key].status;
                temp[0].jobId=forms[key]._jobid;
                response.splice(key,0,temp[0]);
            }
            //console.log("Final response" , response);
            res.status(200).json(response);
        }
            
        else
            res.status(200).json({empty,msg:"User not found"});
    });
});

Routes.route("/jobapplications").get(async function(req,res){
    let response=[];
    sort_field='name';
    sort_type=1;
    if(req.query.sortfield)
        sort_field=req.query.sortfield;
    if(req.query.sorttype)
        sort_type=req.query.sorttype;
    await Application.find({_jobid:ObjectId(req.query.id),status:{$ne:'Rejected'}},'_id applemail date sop status',async function(err,forms){
        if(err)
            console.log(err);
        else if(!forms)
            res.json([]);
        else
        {
            var emails = forms.map(function(form) {
                return form.applemail;
            });
            var applicants = await Applicant.find({email: {$in: emails}});
            var key;
            for(key in forms)
            {
                response[key] = {};
                response[key].dateofappl=forms[key].date;
                response[key].sop=forms[key].sop;
                response[key].status=forms[key].status;
                response[key]._id=forms[key]._id;
                var temp = applicants.filter(function(user){return user.email===forms[key].applemail});
                response[key].name=temp[0].name;
                response[key].skills=temp[0].skills;
                response[key].education=temp[0].education;
                response[key].rating=temp[0].rating;
                /*await Applicant.findOne({email:forms[key].applemail},function(err,user){
                    if(err)
                        console.log(err);
                    else
                    {
                        response[key].name=user.name;
                        response[key].skills=user.skills;
                        response[key].education=user.education;
                        response[key].rating=user.rating;
                    }
                });*/
            }
            await new Promise(r => setTimeout(r, 100));
            if(sort_type === 1) {
                response.sort((a,b) => a[sort_field] < b[sort_field])
            } else if(sort_type === -1) {
                response.sort((a,b) => b[sort_field] < a[sort_field])
            }
            console.log(response);
            res.status(200).json(response);
        }
    });
});

Routes.route("/recremployees").get(async function(req,res){
    let response=[];
    sort_field='name';
    sort_type=1;
    if(req.query.sortfield)
        sort_field=req.query.sortfield;
    if(req.query.sorttype)
        sort_type=req.query.sorttype;
    Application.find({recremail:req.query.email,status:'Accepted'},async function(err,users){
        if(err)
            console.log(err);
        else if(!users)
        {
            res.status(200).json({msg:'No Employees under me',value:0});
        }
        else
        {
            jobids = users.map(function(user) {
                return user._jobid;
            });
            emails = users.map(function(user) {
                return user.applemail;
            });
            var jobs=await Job.find({_id:{$in : jobids}},function(err,jobs){});
            var applicants=await Applicant.find({email:{$in:emails}},function(err,user){});
            var key;
            console.log(users);
            for(key in users)
            {
                response[key]={};
                console.log(key);
                response[key].dateofapplication=users[key].date;
                var tempjob=jobs.filter(function(job){return String(job._id)===String(users[key]._jobid)});
                var tempuser=applicants.filter(function(user){return user.email===users[key].applemail});
                response[key].title=tempjob[0].title;
                response[key].typeOfJob=tempjob[0].typeOfJob;
                response[key].name=tempuser[0].name;
            }
            if(sort_type === 1) {
                response.sort((a,b) => a[sort_field] < b[sort_field])
            } else if(sort_type === -1) {
                response.sort((a,b) => b[sort_field] < a[sort_field])
            }
            res.status(200).json(response);

        }
    });
});
Routes.route("/shortlist").put(async function(req,res){
    await Application.findOne({_id:req.body.id},async function(err,form){
        if(err)
            console.log(err);
        else
        {
            await Job.findOne({_id:form._jobid},async function(err,job){
                if(err)
                    console.log(err);
                else
                {
                    if(Number(job.remainingPositions)===0)
                    {
                        res.json({msg:'All positions are filled',value:0});
                    }
                    else
                    {
                        await Application.updateOne({_id:req.body.id},{status:'Shortlisted'},function(err,form){});
                        res.json({msg:'Successful',value:1});
                    }
                }
            });
        }
    });
});
Routes.route("/accept").put(async function(req,res){
    var remain,r_name,check;
    await Application.findOne({_id:req.body.id},async function(err,form){
        if(err)
            console.log(err);
        else
        {
            await Job.findOne({_id:form._jobid},function(err,job){
                if(err)
                    console.log(err);
                else
                {
                    if(Number(job.remainingPositions)===0)
                    {
                        res.json({msg:'All positions are filled',value:0});
                        check=0;
                    }
                    else
                    {
                        remain=Number(job.remainingPositions) - 1;
                        console.log(remain);
                        check=1;
                    }
                }
            });
            if(check===1)
            {
                await Applicant.updateOne({email:form.applemail},{status:'Working'},function(err,user){});
                await Job.updateOne({_id:form._jobid},{remainingPositions:remain},function(err,job){});
                await Application.updateOne({_id:req.body.id},{status:'Accepted'},function(err,form){});
                var count = 0,open;
                await Application.updateMany({applemail:form.applemail,_id:{$ne:req.body.id}},{status:'Rejected'},function(err,forms){
                    if(err)
                        console.log(err);
                    else
                    {
                        count=Number(forms.nModified);
                    }
                });
                await Applicant.findOne({email:form.applemail},'openapplications',function(err,user){
                    open=user.openapplications;
                });
                open=open-count;
                await Applicant.updateOne({email:form.email},{openapplications:open},function(err,user){});
                await Recruiter.findOne({email:form.recremail},'name password',function(err,user){
                    if(err)
                        console.log(err);
                    else
                    {
                        r_name=user.name;
                    }
                });
                await new Promise(r => setTimeout(r, 100));
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                    user: 'rameshlogan59@gmail.com',
                    pass: 'loganramesh'
                    }
                });
                var mailOptions = {
                    from: "rameshlogan59@gmail.com",
                    to: form.applemail,
                    subject: 'Job Application',
                    text: r_name + ' has accepted your application'
                };
                console.log("Before sending mail");
                transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
              console.log("Mail sent");
              res.json({msg:'Successful',value:1});
            }            
        }
    });
});
Routes.route("/reject").put(async function(req,res){
    var open;
    await Application.findOne({_id:req.body.id},async function(err,form){
        if(err)
            console.log(err);
        else
        {
            await Applicant.find({email:form.applemail},'openapplications',function(err,user){
                if(err)
                    console.log(err);
                else
                {
                    open = Number(user.openapplications) - 1;
                }
            });
            await Applicant.updateOne({email:form.applemail},{openapplications:open},function(err,user){});
            await Application.updateOne({_id:req.body.id},{status:'Rejected'},function(err,form){});
            res.json({msg:'Successful',value:1});
        }
    });
});

app.use("/",Routes);
app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
