import React from 'react';
import logo from '../logo.svg';
import '../css/login.css';
import {Link} from 'react-router-dom';
import PropTypes from "prop-types";

class LoginForm extends React.Component {

    static propTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        localStorage.clear();
        this.state = {
            email: "",
            password: "",
            type: 0
        };
        this.history = this.props.history;
    
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

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
        return !isEmailValid || this.state.password.length === 0;
    }

    onSubmit(event) {
        event.stopPropagation();
        event.preventDefault();
        const fetchConfig = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                type: Number(this.state.type)
            })
          };
        fetch(global.api_url + "/login", fetchConfig)
        .then(response => response.json())
        .then(data => {
            if(data.value === 2) {
                localStorage.setItem("email", data.email);
                localStorage.setItem("type", data.type);
                localStorage.setItem("name", data.name);                
                if(Number(localStorage.getItem("type")) === 0) {
                    this.history.push('/applicant');
                } else if (Number(localStorage.getItem("type")) === 1) {
                    this.history.push('/recruiter');
                }
            } else if (data.value === 1) {
                alert("Invalid credentials");
            } else if (data.value === 0) {

            } 

        });
    };
   
    render() {
      return (
        <div className="wrapper">
            <form onSubmit={this.onSubmit} className="form-signin">
                <img src={logo} alt="Logo" />
                <h2 className="form-signin-heading">Login</h2>
                <input className="form-control" className={this.validateEmail(this.state.email) ? "form-control" : "form-control error"} value={this.state.email} onChange={this.handleEmailChange} type="email" name="email" placeholder="Email*"/>
                <br />
                <input className={this.state.password.length === 0 ? "form-control error" : "form-control"} value={this.state.password} onChange={this.handlePasswordChange} type="password" name="password" placeholder="Password*"/>
                <select className="form-control" value={this.state.type} onChange={this.handleTypeChange} style={{height: 42}}>
                    <option value="0">Applicant</option>
                    <option value="1">Recruiter</option>
                </select>
                <br />
                <button className="btn btn-lg btn-primary btn-block" disabled={this.isFormInvalid()} onClick={this.onSubmit} >Login</button>
                <br />
                <p><Link to={"/register"} >Not a member? Register here</Link></p>
            </form>
        </div>
      );
    }
   }

export default LoginForm;
