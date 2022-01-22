import React from 'react';
import { Header } from '../header';
import PropTypes from "prop-types";
import { Card } from 'react-bootstrap';
export class ViewEmployees extends React.Component {
    
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
    }

    async componentDidMount() {
        const fetchConfig = {
            method: 'GET'
        }
        await fetch(global.api_url + "/recremployees?" + "email=" + localStorage.getItem("email"), fetchConfig)
        .then(response => response.json())
        .then(data => {
            this.setState({employees: data});
            this.setState({loaded: true});
        });
    }

    onSortFieldChange(event) {
        this.setState({sortField: event.target.value});
    }

    onSortOrderChange(event) {
        this.setState({sortOrder: event.target.value});
    }

    async onSearchTriggered() {
        const fetchConfig = {
            method: 'GET'
        }
        await fetch(global.api_url + "/recremployees?" + "email=" + localStorage.getItem("email") + "&sortfield=" + this.state.sortField + "&sorttype=" + this.state.sortOrder, fetchConfig)
        .then(response => response.json())
        .then(data => {
            this.setState({employees: data});
            this.setState({loaded: true});
        });
    }

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

    render() {
        if(!this.state.loaded) {
            return (<div><Header /><div>Loading...</div></div>);
        }
        return (
            <div>
                <Header />
                <h2 style={{marginTop: 20, marginBottom: 20 ,marginLeft: 48}}>My Employees</h2>
                <form onSubmit={this.onSubmit} className="form-inline" style={{marginLeft: 40, marginBottom: 15}}>
                    <label style={{marginLeft: 10, marginRight: 10}}>Sort By</label>
                    <select className="form-control" value={this.state.sortField} onChange={this.onSortFieldChange} style={{height: 42}}>
                        <option value="name">Name</option>
                        <option value="title">Job Title</option>
                        <option value="deadline">Date of Joining</option>
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
                    this.state.employees.map((employee, i) => (
                        <Card key={i} style={{marginBottom: 10, maxWidth: 1700}} className="mx-auto">
                        <Card.Header style={{fontWeight: "bold"}}>{employee.name}</Card.Header>
                        <Card.Body>
                            <Card.Text>Date of Joining: {employee.dateofapplication}</Card.Text>
                            <Card.Text>Job Type: {this.mapJobType(employee.typeOfJob)}</Card.Text>
                            <Card.Text>Job Title: {employee.title}</Card.Text>
                        </Card.Body>
                        </Card>
                ))
                }
                </div>
            </div>
                   
        );
    }
}

export default ViewEmployees;
