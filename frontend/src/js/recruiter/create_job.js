import React from 'react';
import '../../css/login.css';
import PropTypes from "prop-types";
import { Header } from '../header';

class CreateJob extends React.Component {

    static propTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            typeOfJob: "FT",
            duration: "0",
            requiredSkills: []
        };
        this.history = this.props.history;
    
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleMaxApplicantsChange = this.handleMaxApplicantsChange.bind(this);
        this.handleMaxPositionsChange = this.handleMaxPositionsChange.bind(this);
        this.handleDeadlineChange = this.handleDeadlineChange.bind(this);
        this.handleRequiredSkillsChange = this.handleRequiredSkillsChange.bind(this);
        this.handleTypeOfJobChange = this.handleTypeOfJobChange.bind(this);
        this.handleDurationChange = this.handleDurationChange.bind(this);
        this.handleSalaryChange = this.handleSalaryChange.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    handleTitleChange(event) {
        this.setState({title: event.target.value});
    };

    handleMaxApplicantsChange(event) {
        this.setState({maxApplicants: event.target.value});
    };

    handleMaxPositionsChange(event) {
        this.setState({maxPositions: event.target.value});
    };

    handleDeadlineChange(event) {
        this.setState({deadline: event.target.value});
    };

    handleRequiredSkillsChange(i, event) {
        let requiredSkills = [...this.state.requiredSkills];
        requiredSkills[i] = event.target.value;
       this.setState({ requiredSkills });
    };
    onAddSkill() {
        this.setState(prevState => ({
            requiredSkills: [...prevState.requiredSkills, ""]
        }));
    };
    onRemoveSkill(i) {
        let requiredSkills = [...this.state.requiredSkills];
        requiredSkills.splice(i, 1);
        this.setState({ requiredSkills });
    };

    handleTypeOfJobChange(event) {
        this.setState({typeOfJob: event.target.value});
    };

    handleDurationChange(event) {
        this.setState({duration: event.target.value});
    };

    handleSalaryChange(event) {
        this.setState({salary: event.target.value});
    };

    isWholeNumeric(value) {
        return /^\d+$/.test(value);
    };

    isFormInvalid() {
        let isFormInvalid = false;
        if(!this.state.title || this.state.title === "") {
            return true;
        } else if(!this.state.maxApplicants || !(/^\d+$/.test(this.state.maxApplicants))) {
            return true;
        } else if(!this.state.maxPositions || !(/^\d+$/.test(this.state.maxPositions))) {
            return true;
        } else if(!this.state.deadline || !(/^\d{4}\/\d{2}\/\d{2}$/.test(this.state.deadline)) || (new Date()).getTime() > (new Date(this.state.deadline)).getTime()) {
            return true;
        }
        this.state.requiredSkills.forEach(function(skill) {
            if(!skill || skill.length === 0) {
                isFormInvalid = true;
                return;
            }
        });
        if(!this.state.salary || !(/^\d+$/.test(this.state.salary))) {
            return true;
        }
        return isFormInvalid;
    };

    onSubmit(event) {
        event.stopPropagation();
        event.preventDefault();
        const fetchConfig = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                recruiterEmail: localStorage.getItem("email"),
                recruiterName: localStorage.getItem("name"),
                title: this.state.title,
                maxApplicants: Number(this.state.maxApplicants),
                maxPositions: Number(this.state.maxPositions),
                deadline: this.state.deadline,
                requiredSkills: this.state.requiredSkills,
                typeOfJob: this.state.typeOfJob,
                duration: Number(this.state.duration),
                salary: this.state.salary
            })
          };
        fetch(global.api_url + "/createjob", fetchConfig)
        .then(response => response.json())
        .then(data => {
            if(data.status === 0) {
                alert(data.msg);
            } else {
                alert(data.msg);
                this.history.push("/recruiter");
            }
        });
    };
   
    render() {
        return (
            <div>
                <Header />
                <div className="wrapper">
                    <form onSubmit={this.onSubmit} className="form-create-job">
                        <h2 className="form-signin-heading">Create a new Job</h2>
                        <input className={!this.state.title || this.state.title.length === 0 ? "form-control error" : "form-control"} value={this.state.title} onChange={this.handleTitleChange} placeholder="Title*" required={true}/>
                        <br />
                        <input className={!this.state.maxApplicants || !(this.isWholeNumeric(this.state.maxApplicants)) ? "form-control error" : "form-control"} value={this.state.maxApplicants} onChange={this.handleMaxApplicantsChange} placeholder="Max applicants*" required={true}/>
                        <br />
                        <input className={!this.state.maxPositions || !(this.isWholeNumeric(this.state.maxPositions)) ? "form-control error" : "form-control"} value={this.state.maxPositions} onChange={this.handleMaxPositionsChange} placeholder="Max positions*" required={true}/>
                        <br />
                        <input className={(!this.state.deadline || !(/^\d{4}\/\d{2}\/\d{2}$/.test(this.state.deadline)) || (new Date()).getTime() > (new Date(this.state.deadline)).getTime()) ? "form-control error" : "form-control"} value={this.state.deadline} onChange={this.handleDeadlineChange} placeholder="Deadline for application. Format: YYYY/MM/DD *" required={true}/>
                        <br />
                        <div className = "form-group">
                                <label>Required Skills</label>     
                                {
                                    this.state.requiredSkills.map((skill, i) => (
                                    <div key={i} style={{marginBottom: 10}}>
                                        <input placeholder="Skill name" className={!skill || skill.length === 0 ? "form-profile-minielement error" : "form-profile-minielement"} type="text" value={skill} onChange={e => this.handleRequiredSkillsChange(i, e)} required={true} style={{width: 543}}/>
                                        <button onClick={() => this.onRemoveSkill(i)}> Remove </button>
                                    </div>
                                ))
                                }
                                <br />
                                <button onClick={() => this.onAddSkill()}> Add Skill </button>
                            </div>
                        <br />
                        <label>Type of Job</label>  
                        <select className="form-control" value={this.state.typeOfJob} onChange={this.handleTypeOfJobChange} required={true}>
                            <option value="FT">Full Time</option>
                            <option value="PT">Part Time</option>
                            <option value="WFH">Work From Home</option>
                        </select>
                        <br />
                        <label>Duration of Job</label>
                        <select className="form-control" value={this.state.duration} onChange={this.handleDurationChange} required={true}>
                            <option value="0">Indefinite</option>
                            <option value="1">1 Month</option>
                            <option value="2">2 Months</option>
                            <option value="3">3 Months</option>
                            <option value="4">4 Months</option>
                            <option value="5">5 Months</option>
                            <option value="6">6 Months</option>
                        </select>
                        <br />
                        <input className={!this.state.salary || !(this.isWholeNumeric(this.state.salary)) ? "form-control error" : "form-control"} value={this.state.salary} onChange={this.handleSalaryChange} type="salary" name="salary" placeholder="Salary*" required={true}/>
                        <br />
                        <button className="btn btn-lg btn-primary btn-block" disabled={this.isFormInvalid()} onClick={this.onSubmit} >Create</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default CreateJob;
