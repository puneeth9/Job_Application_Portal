import React from 'react';
import { render } from 'react-dom';
import './css/index.css';
import LoginForm from './js/login';
import RegistrationForm from './js/register';
import ApplicantHome from './js/applicant/home';
import RecruiterHome from './js/recruiter/home';
import Profile from './js/profile';

import MyApplications from './js/applicant/my_applications';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import CreateJob from './js/recruiter/create_job';
import EditJob from './js/recruiter/edit_job';
import ViewApplicants from './js/recruiter/view_applicants';
import ViewEmployees from './js/recruiter/view_employees';

global.api_url = "http://localhost:5000"

class App extends React.Component {
  render() {
    return (
      <React.StrictMode>
      <Router>
        <Route path={"/login"} component={LoginForm} />
        <Route path={"/register"} component={RegistrationForm} />
        <Route path={"/applicant"} component={ApplicantHome} />
        <Route path={"/my_applications"} component={MyApplications} />
        <Route path={"/recruiter"} component={RecruiterHome} />
        <Route path={"/profile"} component={Profile} />
        <Route path={"/create_job"} component={CreateJob} />
        <Route path={"/edit_job"} component={EditJob} />
        <Route path={"/view_applicants"} component={ViewApplicants} />
        <Route path={"/view_employees"} component={ViewEmployees} />

      </Router>
      </React.StrictMode>
    );
  }
}

render(<App />, document.getElementById('root'));