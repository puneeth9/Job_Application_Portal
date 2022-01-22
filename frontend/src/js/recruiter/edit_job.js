import React from 'react';
import '../../css/login.css';
import PropTypes from "prop-types";
import { Header } from '../header';

class EditJob extends React.Component {

    static propTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        };
        this.history = this.props.history;
    
        this.handleMaxApplicantsChange = this.handleMaxApplicantsChange.bind(this);
        this.handleMaxPositionsChange = this.handleMaxPositionsChange.bind(this);
        this.handleDeadlineChange = this.handleDeadlineChange.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    handleMaxApplicantsChange(event) {
        this.setState({maxApplicants: event.target.value});
    };

    handleMaxPositionsChange(event) {
        this.setState({maxPositions: event.target.value});
    };

    handleDeadlineChange(event) {
        this.setState({deadline: event.target.value});
    };

    isWholeNumeric(value) {
        return /^\d+$/.test(value);
    };

    isFormInvalid() {
        if(!this.state.maxApplicants || !(/^\d+$/.test(this.state.maxApplicants))) {
            return true;
        } else if(!this.state.maxPositions || !(/^\d+$/.test(this.state.maxPositions))) {
            return true;
        } else if(!this.state.deadline || !(/^\d{4}\/\d{2}\/\d{2}$/.test(this.state.deadline)) || (new Date()).getTime() > (new Date(this.state.deadline)).getTime()) {
            return true;
        }
        return false;
    };

    async componentDidMount() {
        const fetchConfig = {
            method: 'GET'
        }
        await fetch(global.api_url + "/job?" + "id=" + localStorage.getItem("editJobId"), fetchConfig)
        .then(response => response.json())
        .then(data => {
            this.setState(data);
            this.setState({loaded: true})
        });
    }

    onSubmit(event) {
        event.stopPropagation();
        event.preventDefault();
        const fetchConfig = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: localStorage.getItem("editJobId"),
                maxApplicants: Number(this.state.maxApplicants),
                maxPositions: Number(this.state.maxPositions),
                deadline: this.state.deadline
            })
          };
        fetch(global.api_url + "/job", fetchConfig)
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
        if(!this.state.loaded) {
            return (<div><Header /><div>Loading...</div></div>);
        }
        return (
            <div>
                <Header />
                <div className="wrapper">
                    <form onSubmit={this.onSubmit} className="form-create-job">
                        <h2 className="form-signin-heading">Edit Job</h2>
                        <label>Title</label>
                        <input className="form-control" value={this.state.title} readOnly={true}/>
                        <br />
                        <label>Maximum number of applicants</label>
                        <input className={!this.state.maxApplicants || !(this.isWholeNumeric(this.state.maxApplicants)) ? "form-control error" : "form-control"} value={this.state.maxApplicants} onChange={this.handleMaxApplicantsChange} type="maxApplicants" name="maxApplicants" placeholder="Max applicants*" required={true}/>
                        <br />
                        <label>Maximum number of positions</label>
                        <input className={!this.state.maxPositions || !(this.isWholeNumeric(this.state.maxPositions)) ? "form-control error" : "form-control"} value={this.state.maxPositions} onChange={this.handleMaxPositionsChange} placeholder="Max positions*" required={true}/>
                        <br />
                        <label>Deadline for application</label>
                        <input className={(!this.state.deadline || !(/^\d{4}\/\d{2}\/\d{2}$/.test(this.state.deadline)) || (new Date()).getTime() > (new Date(this.state.deadline)).getTime()) ? "form-control error" : "form-control"} value={this.state.deadline} onChange={this.handleDeadlineChange} placeholder="Deadline for application*" required={true}/>
                        <br />

                        <button className="btn btn-lg btn-primary btn-block" disabled={this.isFormInvalid()} onClick={this.onSubmit} >Save Changes</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default EditJob;
