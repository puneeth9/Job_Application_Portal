import React from 'react';
import { Header } from '../header';
import PropTypes from "prop-types";
import { Table } from 'react-bootstrap';

export class MyApplications extends React.Component {
    
    static propTypes = {
        history: PropTypes.object.isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            applications: [],
            loaded: false
        };
        this.history = this.props.history;
    }
    

    async componentDidMount() {
        const fetchConfig = {
            method: 'GET'
        }
        await fetch(global.api_url + "/myapplications?" + "applemail=" + localStorage.getItem("email"), fetchConfig)
        .then(response => response.json())
        .then(data => {
            this.setState({applications: data});
            this.setState({loaded: true});

        });
    }

    render() {
        if(!this.state.loaded) {
            return (<div><Header /><div>Loading...</div></div>);
        }
        return (
            <div>
                <Header />
                <h2 style={{textAlign: "center", marginTop: 20, marginBottom: 20}}>My Applications</h2>
                <Table striped bordered hover className="mx-auto" style={{maxWidth: 1200}}>
                <thead>
                    <tr>
                        <th style={{width: 400}}>Title</th>
                        <th>Date Of Joining</th>
                        <th>Salary</th>
                        <th style={{width: 150}}>Recruiter Name</th>
                        <th>Application Status</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.applications.map((application, i) => (
                            <tr key={i}>
                                <td style={{width: 400}}>{application.title}</td>
                                <td>{application.deadline}</td>
                                <td>{application.salary}</td>
                                <td style={{width: 150}}>{application.recruiterName}</td>
                                <td>{application.status}</td>
                            </tr>
                        ))
                    }
                </tbody>
                </Table>
            </div>
        );
    }
}

export default MyApplications;