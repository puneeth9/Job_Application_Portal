import React from 'react';
import { Header } from '../header';
import PropTypes from "prop-types";
import { Button, Table } from 'react-bootstrap';
import {Modal} from 'react-bootstrap';
export class ApplicantHome extends React.Component {
    
    static propTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.history = this.props.history;
        this.state = {
            jobs: [],
            loaded: false,
            showErrorPopup: false,
            showSopPopup: false,
            currentJobId: "",
            minSalary: 0,
            sortField: "salary",
            sortOrder: "1",
            typeOfJob: "ALL",
            duration: "7",
            errorPopupMessage: ""
        };
        this.handleSearchTitleChange = this.handleSearchTitleChange.bind(this);
        this.handleSortFieldChange = this.handleSortFieldChange.bind(this);
        this.handleSortOrderChange = this.handleSortOrderChange.bind(this);
        this.handleJobTypeChange = this.handleJobTypeChange.bind(this);
        this.handleMinSalaryChange = this.handleMinSalaryChange.bind(this);
        this.handleMaxSalaryChange = this.handleMaxSalaryChange.bind(this);
        this.handleDurationChange = this.handleDurationChange.bind(this);
        this.handleSopChange = this.handleSopChange.bind(this);
        this.handleCloseSopPopup = this.handleCloseSopPopup.bind(this);
        this.handleCloseErrorPopup = this.handleCloseErrorPopup.bind(this);
        this.onSearchTriggered = this.onSearchTriggered.bind(this);
        this.getApplyButtonText = this.getApplyButtonText.bind(this);
        this.onApplyClick = this.onApplyClick.bind(this);
        this.onFinalApply = this.onFinalApply.bind(this);

    }

    handleSearchTitleChange(event) {
        this.setState({searchTitle: event.target.value});
    };

    handleSortFieldChange(event) {
        this.setState({sortField: event.target.value});
    };

    handleSortOrderChange(event) {
        this.setState({sortOrder: event.target.value});
    };

    handleJobTypeChange(event) {
        this.setState({typeOfJob: event.target.value});
    };

    handleMinSalaryChange(event) {
        this.setState({minSalary: event.target.value});
    };

    handleMaxSalaryChange(event) {
        this.setState({maxSalary: event.target.value});
    };

    handleDurationChange(event) {
        this.setState({duration: event.target.value});
    };

    mapJobType(jobType) {
        if(jobType === "FT") {
            return "Full Time";
        } else if(jobType === "PT") {
            return "Part Time";
        } else if(jobType === "WFH") {
            return "Work From Home";
        }
        return null;
    };

    mapDuration(duration) {
        return duration;
    };

    getApplyButtonText(job) {
        if(job.status === "Full") {
            return "Full";
        } else if (job.applicationStatus === "") {
            return "Apply";
        } else {
            return job.applicationStatus;
        }
    };

    async onApplyClick(job, event) {
        this.setState({currentJobId: job._id});
        let canApply = -1;
        const fetchConfig = {
            method: 'GET'
        }
        await fetch(global.api_url + "/canapply?email=" + localStorage.getItem("email") + "&jobid=" + job._id, fetchConfig)
        .then(response => response.json())
        .then(data => {
            canApply = data.value;
            if(canApply === 1) {
                this.setState({showSopPopup: true});
            } else {
                this.setState({errorPopupMessage: data.msg});
                this.setState({showErrorPopup: true});
            }
        });
        
    };

    handleSopChange(event) {
        this.setState({sop: event.target.value});
    }

    onFinalApply(event) {
        const fetchConfig = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sop: this.state.sop,
                jobid: this.state.currentJobId,
                applicantEmail: localStorage.getItem("email")
            })
        }
        fetch(global.api_url + "/apply", fetchConfig)
        .then(response => response.json())
        .then(data => {
            alert(data.msg);
            window.location.reload(false);
        });
    };

    handleCloseSopPopup(event) {
        this.setState({showSopPopup: false, sop: undefined});
    };

    handleCloseErrorPopup(event) {
        this.setState({showErrorPopup: false});
    };

    async onSearchTriggered(event) {
        event.preventDefault();
        this.setState({loaded: false});
        const fetchConfig = {
            method: 'GET'
        }
        let params = "minsalary=" + this.state.minSalary + "&sortField=" + this.state.sortField + "&sortOrder=" + Number(this.state.sortOrder) + "&duration=" + Number(this.state.duration);
        if(this.state.typeOfJob !== "ALL") {
            params = params + "&typeOfJob=" + this.state.typeOfJob;
        }
        if(this.state.searchTitle && this.state.searchTitle !== "") {
            params = params + "&searchTitle=" + this.state.searchTitle;
        }
        if(this.state.maxSalary) {
            params = params + "&maxsalary=" + this.state.maxSalary;
        }
        await fetch(global.api_url + "/listings?" + params, fetchConfig)
        .then(response => response.json())
        .then(data => {
            this.setState({jobs: data});
            this.state.jobs.forEach(function(job) {
                job.applicationStatus = "";
            });
        });
        let applicationsList = [];
        await fetch(global.api_url + "/myapplications?" + "applemail=" + localStorage.getItem("email"), fetchConfig)
        .then(response => response.json())
        .then(data => {
            applicationsList = data;
        });
        this.state.jobs.forEach(function(job) {
            let matchingApplication = applicationsList.filter(function(application) {
                return application._id === job._id;
            });
            if(matchingApplication && matchingApplication.length > 0) {
                job.applicationStatus = matchingApplication[0].status;
            } else {
                job.applicationStatus = "";
            }
        });
        this.setState({loaded: true});
    }

    async componentDidMount() {
        const fetchConfig = {
            method: 'GET'
        }
        await fetch(global.api_url + "/listings", fetchConfig)
        .then(response => response.json())
        .then(data => {
            this.setState({jobs: data});
            this.state.jobs.forEach(function(job) {
                job.applicationStatus = "";
            });
        });
        let applicationsList = [];
        await fetch(global.api_url + "/myapplications?" + "applemail=" + localStorage.getItem("email"), fetchConfig)
        .then(response => response.json())
        .then(data => {
            applicationsList = data;
        });
        this.state.jobs.forEach(function(job) {
            let matchingApplication = applicationsList.filter(function(application) {
                return application._id === job._id;
            });
            if(matchingApplication && matchingApplication.length > 0) {
                job.applicationStatus = matchingApplication[0].status;
            } else {
                job.applicationStatus = "";
            }
        });
        this.setState({loaded: true});
    }
    
    render() {
        if(!this.state.loaded) {
            return (<div><Header /><div>Loading...</div></div>);
        }
        return (
            <div>
                <Header />
                <Modal show={this.state.showSopPopup} onHide={this.handleCloseSopPopup}>
                    <Modal.Header closeButton>
                        <Modal.Title>SOP</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <label>Enter your Statement of Purpose</label>
                        <textarea className="form-control" rows="5" value={this.state.sop} onChange={this.handleSopChange} placeholder="Statement of Purpose" maxLength="250" />
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="primary" onClick={this.onFinalApply}>Submit</Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showErrorPopup} onHide={this.handleCloseErrorPopup}>
                    <Modal.Header closeButton>
                        <Modal.Title>Application Failed</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>{this.state.errorPopupMessage}</p>
                    </Modal.Body>
                </Modal>
                <h2 style={{marginLeft: 40, marginTop: 10}}>Job Listings</h2>
                <div className="wrapper mx-auto">
                <form onSubmit={this.onSubmit} className="form-inline" style={{marginLeft: 25}}>
                    <label style={{marginLeft: 10, marginRight: 10}}>Title</label>
                    <input className="form-control" value={this.state.searchTitle} onChange={this.handleSearchTitleChange}/>
                    <label style={{marginLeft: 10, marginRight: 10}}>Job Type</label>
                    <select className="form-control" value={this.state.typeOfJob} onChange={this.handleJobTypeChange} style={{height: 42}}>
                        <option value="ALL">All</option>
                        <option value="FT">Full Time</option>
                        <option value="PT">Part Time</option>
                        <option value="WFH">Work From Home</option>
                    </select>
                    <label style={{marginLeft: 10, marginRight: 10}}>Salary Range</label>
                    <input className="form-control" value={this.state.minSalary} onChange={this.handleMinSalaryChange} placeholder="Minimum"/>
                    <label style={{marginLeft: 5, marginRight: 5}}>to</label>
                    <input className="form-control" value={this.state.maxSalary} onChange={this.handleMaxSalaryChange} placeholder="Maximum"/>
                    <label style={{marginLeft: 10, marginRight: 10}}>Duration</label>
                    <select className="form-control" value={this.state.duration} onChange={this.handleDurationChange} style={{height: 42}}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                    </select>
                    <label style={{marginLeft: 10, marginRight: 10}}>Sort By</label>
                    <select className="form-control" value={this.state.sortField} onChange={this.handleSortFieldChange} style={{height: 42}}>
                        <option value="salary">Salary</option>
                        <option value="duration">Duration</option>
                        <option value="rating">Rating</option>
                    </select>
                    <br />
                    <label style={{marginLeft: 10, marginRight: 10}}>Sort Order</label>
                    <select className="form-control" value={this.state.sortOrder} onChange={this.handleSortOrderChange} style={{height: 42}}>
                        <option value="1">Ascending</option>
                        <option value="-1">Descending</option>
                    </select>
                    <br />
                    <button className="btn btn-md btn-primary" style={{width: 120, marginLeft: 10}} onClick={this.onSearchTriggered}>Search</button>
                </form>
                </div>
                <Table striped bordered hover className="mx-auto" style={{maxWidth: 1500}}>
                <thead>
                    <tr>
                        <th style={{width: 350}}>Title</th>
                        <th>Recruiter Name</th>
                        <th style={{width: 151}}>Recruiter Rating</th>
                        <th>Job Type</th>
                        <th style={{width: 120}}>Salary</th>
                        <th style={{width: 100}}>Duration</th>
                        <th style={{width: 250}}>Deadline for application</th>
                        <th style={{width: 50}}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.jobs.map((job, i) => (
                            <tr key={i}>
                                <td style={{width: 350}}>{job.title}</td>
                                <td>{job.recruiterName}</td>
                                <td style={{width: 151}}>0</td>
                                <td>{this.mapJobType(job.typeOfJob)}</td>
                                <td style={{width: 120}}>{job.salary}</td>
                                <td style={{width: 100}}>{this.mapDuration(job.duration)}</td>
                                <td style={{width: 250}}>{job.deadline}</td>
                                <td style={{width: 50}}><Button disabled={job.status === "Full" || job.applicationStatus === "Applied" || job.applicationStatus === "Rejected" || job.applicationStatus === "Shortlisted" || job.applicationStatus === "Accepted"} variant={job.status === "Full" || job.applicationStatus !== ""? "danger" : "primary"} onClick={() => this.onApplyClick(job)}>{this.getApplyButtonText(job)}</Button></td>
                            </tr>
                        ))
                    }
                </tbody>
                </Table>

            </div>
        );
    }
}

export default ApplicantHome;