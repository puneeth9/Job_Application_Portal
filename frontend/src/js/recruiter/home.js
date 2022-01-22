import React from 'react';
import { Header } from '../header';
import PropTypes from "prop-types";
import { Card, Button } from 'react-bootstrap';
export class RecruiterHome extends React.Component {
    
    static propTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.history = this.props.history;
        this.state = {
            loaded: false
        };
    }

    async componentDidMount() {
        const fetchConfig = {
            method: 'GET'
        }
        await fetch(global.api_url + "/reclistings?" + "email=" + localStorage.getItem("email"), fetchConfig)
        .then(response => response.json())
        .then(data => {
            this.setState(data);
            this.setState({loaded: true});
        });
    }

    onEditClick(id, event) {
        localStorage.setItem("editJobId", id);
        this.history.push('/edit_job');
    };

    onViewApplicantsClick(job, event) {
        localStorage.setItem("viewApplicantsJobId", job._id);
        localStorage.setItem("viewApplicantsJobTitle", job.title);
        this.history.push('/view_applicants');
    };

    onDeleteClick(id, event) {
        const fetchConfig = {
            method: 'DELETE'
        };
        fetch(global.api_url + "/job?" + "id=" + id, fetchConfig)
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
                <h2 style={{marginTop: 20, marginBottom: 20 ,marginLeft: 45}}>My Open Jobs</h2>
                <div>
                {
                    this.state.jobs.map((job, i) => (
                        <Card key={i} style={{marginBottom: 10, maxWidth: 1700}} className="mx-auto">
                        <Card.Header>{job.title}</Card.Header>
                        <Card.Body>
                            <Card.Text>Posting Date: {job.postDate}</Card.Text>
                            <Card.Text>Number of Applications: {job.numberOfApplications}</Card.Text>
                            <Card.Text>Maximum Positions: {job.maxPositions}</Card.Text>
                            <Button variant="primary" onClick={() => this.onEditClick(job._id)} style={{marginRight: 10}}>Edit</Button>
                            <Button variant="primary" onClick={() => this.onViewApplicantsClick(job)} style={{marginRight: 10}}>View Applicants</Button>
                            <Button variant="danger" onClick={() => this.onDeleteClick(job._id)}>Delete</Button>
                        </Card.Body>
                        </Card>
                ))
                }
                </div>
            </div>
                   
        );
    }
}

export default RecruiterHome;
