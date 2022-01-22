import React from 'react';
import '../css/login.css';
import { Header } from './header';
import PropTypes from "prop-types";

class Profile extends React.Component {

    static propTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.history = this.props.history;
        this.state = {
            loaded: false,
            education: [],
            skills: []
        };
        this.handleEducationNameChange = this.handleEducationNameChange.bind(this);
        this.handleStartYearChange = this.handleStartYearChange.bind(this);
        this.handleEndYearChange = this.handleEndYearChange.bind(this);
        this.onAddEducation = this.onAddEducation.bind(this);
        this.onRemoveEducation = this.onRemoveEducation.bind(this);

        this.handleContactChange = this.handleContactChange.bind(this);
        this.handleBioChange = this.handleBioChange.bind(this);
        this.isWholeNumeric = this.isWholeNumeric.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    handleEducationNameChange(i, event) {
        let education = [...this.state.education];
        education[i].instituteName = event.target.value;
       this.setState({ education });
    };
    handleStartYearChange(i, event) {
      let education = [...this.state.education];
      education[i].startYear = event.target.value;
     this.setState({ education });
    };
    handleEndYearChange(i, event) {
      let education = [...this.state.education];
      education[i].endYear = event.target.value;
     this.setState({ education });
    };
    onAddEducation() {
        this.setState(prevState => ({
          education: [...prevState.education, {  }]
        }));
    };
    onRemoveEducation(i) {
        let education = [...this.state.education];
        education.splice(i, 1);
        this.setState({ education });
    };

    handleSkillChange(i, event) {
        let skills = [...this.state.skills];
        skills[i] = event.target.value;
       this.setState({ skills });
    };
    onAddSkill() {
        this.setState(prevState => ({
            skills: [...prevState.skills, ""]
        }));
    };
    onRemoveSkill(i) {
        let skills = [...this.state.skills];
        skills.splice(i, 1);
        this.setState({ skills });
    };

    handleContactChange(event) {
        this.setState({contact: event.target.value});
    };

    handleBioChange(event) {
        this.setState({bio: event.target.value});
    };

    isWholeNumeric(value) {
        return /^\d+$/.test(value);
    };

    isFormInvalid() {
        let isFormInvalid = false;
        if(Number(localStorage.getItem("type")) === 0) {
            this.state.education.forEach(function(item) {
                if(!item.instituteName || item.instituteName.length === 0) {
                    isFormInvalid = true;
                    return;
                } else if (!item.startYear || !(/^\d+$/.test(item.startYear))) {
                    isFormInvalid = true;
                    return;
                } else if (item.endYear && !(/^\d+$/.test(item.endYear))) {
                    isFormInvalid = true;
                    return;
                }
            })
            this.state.skills.forEach(function(skill) {
                if(!skill || skill.length === 0) {
                    isFormInvalid = true;
                    return;
                }
            });
        }
        return isFormInvalid;
    }

    async componentDidMount() {
        // if(!localStorage.getItem("email") || !Number(localStorage.getItem("type"))) {
        //     this.history.push("/login");
        //     return;
        // }
        const fetchConfig = {
            method: 'GET'
        }
        await fetch(global.api_url + "/profile?" + "email=" + localStorage.getItem("email") + "&" + "type=" + Number(localStorage.getItem("type")), fetchConfig)
        .then(response => response.json())
        .then(data => {
            this.setState(data);
            this.setState({loaded: true});
        });
    }

    onSubmit(event) {
        event.stopPropagation();
        event.preventDefault();
        const fetchConfig = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
          };
        if(Number(localStorage.getItem("type")) === 0) {
            fetchConfig.body = JSON.stringify({
                email: localStorage.getItem("email"),
                type: Number(localStorage.getItem("type")),
                education: this.state.education,
                skills: this.state.skills
            });
        } else {
            fetchConfig.body = JSON.stringify({
                email: localStorage.getItem("email"),
                type: Number(localStorage.getItem("type")),
                contact: this.state.contact,
                bio: this.state.bio,
                
            });
        }
        
        fetch(global.api_url + "/profile", fetchConfig)
        .then(response => response.json())
        .then(data => {
            if(data.status === 1) {
                alert("Profile updated successfully");
            } else {
                alert(data.msg);
            }
        });
    };
   
    render() {
        if(Number(localStorage.getItem("type")) === 0) {
            if(!this.state.loaded) {
                return (<div><Header /><div>Loading...</div></div>);
            }
            return (
                <div>
                    <Header />
                    <div className="wrapper">
                        <form onSubmit={this.onSubmit} className="form-profile">
                            <br />
                            <label>Name</label>
                            <input className="form-control" value={this.state.name} type="name" name="name" readOnly={true}/>
                            <br />
                            <label>Email</label>
                            <input className="form-control" value={this.state.email} type="email" name="email" readOnly={true}/>
                            <br />
                            <div className = "form-group">
                                <label>Education</label>     
                                {
                                    this.state.education.map((edu, i) => (
                                    <div key={i} style={{marginBottom: 10}}>
                                        <input placeholder="Institute name" className={!edu.instituteName || edu.instituteName.length === 0 ? "form-profile-minielement error" : "form-profile-minielement"} type="text" value={edu.instituteName} onChange={e => this.handleEducationNameChange(i, e)} required={true} style={{width: 323}}/>
                                        <input placeholder="Start Year" className={!edu.startYear || !this.isWholeNumeric(edu.startYear) ? "form-profile-minielement error" : "form-profile-minielement"} type="text" value={edu.startYear} onChange={e => this.handleStartYearChange(i, e)} required={true} style={{width: 100}}/>
                                        <input placeholder="End Year" className={edu.endYear && !this.isWholeNumeric(edu.endYear) ? "form-profile-minielement error" : "form-profile-minielement"} type="text" value={edu.endYear} onChange={e => this.handleEndYearChange(i, e)} style={{width: 100}}/>
                                        <button onClick={() => this.onRemoveEducation(i)}> Remove </button>
                                    </div>
                                ))
                                }
                                <br />
                                <button onClick={() => this.onAddEducation()} > Add Education </button>
                            </div>
                            <div className = "form-group">
                                <label>Skills</label>     
                                {
                                    this.state.skills.map((skill, i) => (
                                    <div key={i} style={{marginBottom: 10}}>
                                        <input placeholder="Skill name" className={!skill || skill.length === 0 ? "form-profile-minielement error" : "form-profile-minielement"} type="text" value={skill} onChange={e => this.handleSkillChange(i, e)} required={true} style={{width: 543}}/>
                                        <button onClick={() => this.onRemoveSkill(i)}> Remove </button>
                                    </div>
                                ))
                                }
                                <br />
                                <button onClick={() => this.onAddSkill()} > Add Skill </button>
                            </div>
                            <button className="btn btn-lg btn-primary btn-block" disabled={this.isFormInvalid()} onClick={this.onSubmit}>Update Profile</button>
                            <br />
                        </form>
                    </div>
                </div>
              );
        } else if (Number(localStorage.getItem("type")) === 1) {
            if(!this.state.loaded) {
                return (<div><Header /><div>Loading...</div></div>);
            }
            return (
                <div>
                    <Header />
                    <div className="wrapper">
                        <form onSubmit={this.onSubmit} className="form-profile">
                            <label>Name</label>
                            <input className="form-control" value={this.state.name} type="name" name="name" readOnly={true} />
                            <br />
                            <label>Email</label>
                            <input className="form-control" value={this.state.email} type="email" name="email" readOnly={true}/>
                            <br />
                            <label>Contact</label>
                            <input className="form-control" value={this.state.contact} onChange={this.handleContactChange} type="contact" name="contact" placeholder="Contact"/>
                            <br />
                            <label>Bio</label>
                            <textarea className="form-control" rows="5" value={this.state.bio} onChange={this.handleBioChange} name="bio" placeholder="Bio" maxLength="250" />
                            <br />
                            <button className="btn btn-lg btn-primary btn-block" disabled={this.isFormInvalid()} onClick={this.onSubmit}>Update Profile</button>
                            <br />
                        </form>
                    </div>
                </div>
              );
        }
      
    }
}

export default Profile;
