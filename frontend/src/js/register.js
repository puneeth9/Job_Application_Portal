import React from 'react';
import logo from '../logo.svg';
import '../css/login.css';
import {Link} from 'react-router-dom';
import PropTypes from "prop-types";
import { withRouter } from "react-router";

class RegistrationForm extends React.Component {

    static propTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            password: "",
            type: 0
        };
        this.history = this.props.history;
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    handleNameChange(event) {
        this.setState({name: event.target.value});
    };

    handleEmailChange(event) {
        this.setState({email: event.target.value});
    };

    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    };

    handleTypeChange(event) {
        this.setState({type: event.target.value});
    };

    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    isFormInvalid() {
        let isEmailValid = this.validateEmail(this.state.email);
        return this.state.name.length === 0 || !isEmailValid || this.state.password.length < 6;
    }

    onSubmit(event) {
        event.stopPropagation();
        event.preventDefault();

        const fetchConfig = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                type: this.state.type
            })
          };
        fetch(global.api_url + "/register", fetchConfig)
        .then(response => response.json())
        .then(data => {
            if(data.value === 2) {
                alert(data.message);
            } else if (data.value === 1) {
                alert(data.message);
                this.history.push("/login");

            } else if (data.value === 0) {
                alert(data.message);
            }
        });
    };
   
    render() {
      return (
        <div className="wrapper">
            <form onSubmit={this.onSubmit} className="form-signin">
                <img src={logo} alt="Logo" />
                <h2 className="form-signin-heading">Registration</h2>
                <input className={this.state.name.length > 0 ? "form-control" : "form-control error"} value={this.state.name} onChange={this.handleNameChange} type="name" name="name" placeholder="Name*" required={true}/>
                <br />
                <input className={this.validateEmail(this.state.email) ? "form-control" : "form-control error"} value={this.state.email} onChange={this.handleEmailChange} type="email" name="email" placeholder="Email*" required={true}/>
                <p hidden={this.validateEmail(this.state.email)} style={{marginTop: -16, fontSize: 14, color: 'red'}}>Invalid Email</p>
                <br />
                <input className={this.state.password.length > 5 ? "form-control" : "form-control error"} value={this.state.password} onChange={this.handlePasswordChange} type="password" name="password" placeholder="Password*" required={true}/>
                <p hidden={this.state.password.length > 5} style={{marginTop: -16, fontSize: 14, color: 'red'}}>Minimum password length is 6</p>
                <select className="form-control" value={this.state.type} onChange={this.handleTypeChange} style={{height: 42}}>
                    <option value="0">Applicant</option>
                    <option value="1">Recruiter</option>
                </select>
                <br />
                <button className="btn btn-lg btn-primary btn-block" disabled={this.isFormInvalid()} onClick={this.onSubmit}>Register</button>
                <br />
                <p><Link to={"/login"} >Back to Login</Link></p>
                <br />
            </form>
        </div>
      );
    }
   }

const RegistrationFormRouter = withRouter(RegistrationForm);
export default RegistrationFormRouter;


