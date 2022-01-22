import React from 'react';
import { Header } from '../header';
import PropTypes from "prop-types";
import { Card, Button } from 'react-bootstrap';
export class ViewApplicants extends React.Component {
    
    static propTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.history = this.props.history;
        this.state = {
            applicants: [],
            loaded: false,
            sortField: 'name',
            sortOrder: '1'
        };
        this.onSortFieldChange = this.onSortFieldChange.bind(this);
        this.onSortOrderChange = this.onSortOrderChange.bind(this);
        this.onSearchTriggered = this.onSearchTriggered.bind(this);
        this.mapEducation = this.mapEducation.bind(this);
    }

    async componentDidMount() {
        const fetchConfig = {
            method: 'GET'
        }
        await fetch(global.api_url + "/jobapplications?" + "id=" + localStorage.getItem("viewApplicantsJobId"), fetchConfig)
        .then(response => response.json())
        .then(data => {
            this.setState({applicants: data});
            this.setState({loaded: true});
        });
    }

    mapEducation(education) {
        let educationString = "";
        if(!education) {
            return "";
        }
        education.forEach(function(item) {
            educationString = educationString + item.instituteName + "(" + item.startYear + "-" + item.endYear + ")" + ", ";
        });
        return educationString.replace(/(, $)/g, "");
    };

    onSortFieldChange(event) {
        this.setState({sortField: event.target.value});
    };

    onSortOrderChange(event) {
        this.setState({sortOrder: event.target.value});
    };

    onSearchTriggered() {
        const fetchConfig = {
            method: 'GET'
        }
        fetch(global.api_url + "/jobapplications?" + "id=" + localStorage.getItem("viewApplicantsJobId") + "&sortfield=" + this.state.sortField + "&sortorder=" + this.state.sortOrder, fetchConfig)
        .then(response => response.json())
        .then(data => {
            this.setState({applicants: data});
            this.setState({loaded: true});
        });
    };

    getAcceptButtonText(applicationStatus) {
        if(applicationStatus === "Applied") {
            return "Shortlist";
        } else if (applicationStatus === "Shortlisted") {
            return "Accept";
        } else if (applicationStatus === "Accepted") {
            return "Accepted";
        }
    };

    onAcceptClick(application, event) {
        const fetchConfig = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: application._id
            })
        };
        if(application.status === "Applied") {
            fetch(global.api_url + "/shortlist", fetchConfig)
            .then(response => response.json())
            .then(data => {
                alert(data.msg);
                if(data.status === 1) {
                    window.location.reload(false);
                }
            });
        } else if (application.status === "Shortlisted") {
            fetch(global.api_url + "/accept", fetchConfig)
            .then(response => response.json())
            .then(data => {
                alert(data.msg);
                if(data.status === 1) {
                    window.location.reload(false);
                }
            });
        }
    };

    onRejectClick(id, event) {
        const fetchConfig = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: id
            })
        };
        fetch(global.api_url + "/reject", fetchConfig)
        .then(response => response.json())
        .then(data => {
            alert(data.msg);
            if(data.status === 1) {
                window.location.reload(false);
            }
        });
    };

    render() {
        if(!this.state.loaded) {
            return (<div><Header /><div>Loading...</div></div>);
        }
        return (
            <div>
                <Header />
                <h2 style={{marginTop: 20, marginBottom: 20 ,marginLeft: 45}}>Applicants for "{localStorage.getItem("viewApplicantsJobTitle")}"</h2>
                <form onSubmit={this.onSubmit} className="form-inline" style={{marginLeft: 40, marginBottom: 15}}>
                    <label style={{marginLeft: 10, marginRight: 10}}>Sort By</label>
                    <select className="form-control" value={this.state.sortField} onChange={this.onSortFieldChange} style={{height: 42}}>
                        <option value="name">Name</option>
                        <option value="dateofappl">Date of Application</option>
                    </select>
                    <br />
                    <label style={{marginLeft: 10, marginRight: 10}}>Sort Order</label>
                    <select className="form-control" value={this.state.sortOrder} onChange={this.onSortOrderChange} style={{height: 42}}>
                        <option value="1">Ascending</option>
                        <option value="-1">Descending</option>
                    </select>
                    <button className="btn btn-md btn-primary" style={{width: 120, marginLeft: 10}} onClick={this.onSearchTriggered}>Search</button>
                </form>
                <div>
                {
                    this.state.applicants.map((application, i) => (
                        <Card key={i} style={{marginBottom: 10, maxWidth: 1700}} className="mx-auto">
                        <Card.Header style={{fontSize: "bold"}}>{application.name}</Card.Header>
                        <Card.Body>
                            <Card.Text>Skills: {(application.skills) ? application.skills.join() : ""}</Card.Text>
                            <Card.Text>Education: {this.mapEducation(application.education)}</Card.Text>
                            <Card.Text>SOP: {application.sop}</Card.Text>
                            <Card.Text>Date of Application: {application.dateofappl}</Card.Text>
                            <Card.Text>Status: {application.status}</Card.Text>
                            <Button variant="primary" disabled={application.status !== 'Applied' && application.status !== "Shortlisted"} onClick={() => this.onAcceptClick(application)} style={{marginRight: 10}}>{this.getAcceptButtonText(application.status)}</Button>
                            <Button variant="danger" disabled={application.status !== 'Applied' && application.status !== 'Shortlisted'} onClick={() => this.onRejectClick(application._id)} style={{marginRight: 10}}>Reject</Button>
                        </Card.Body>
                        </Card>
                ))
                }
                </div>
            </div>
                   
        );
    }
}

export default ViewApplicants;
