import React from "react";
import {Link} from 'react-router-dom';

export class Header extends React.Component {
    render() {
        if(Number(localStorage.getItem("type")) === 0) {
            return (
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="collapse navbar-collapse">
                            <ul className="navbar-nav mr-auto">
                                <li className="navbar-item">
                                    <Link to={"/applicant"} className="nav-link">Home</Link>
                                </li>
                                <li className="navbar-item">
                                    <Link to="/my_applications" className="nav-link">My Applications</Link>
                                </li>
                                <li className="navbar-item">
                                    <Link to="/profile" className="nav-link">My Profile</Link>
                                </li>
                                <li className="navbar-item">
                                    <Link to="/login" className="nav-link">Logout</Link>
                                </li>                            
                            </ul>
                        </div>
                    </nav>
            );
        } else if (Number(localStorage.getItem("type")) === 1) {
            return (             
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav mr-auto">
                            <li className="navbar-item">
                                <Link to="/recruiter" className="nav-link">Home</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/create_job" className="nav-link">Create Job</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/view_employees" className="nav-link">My Employees</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/profile" className="nav-link">My Profile</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/login" className="nav-link">Logout</Link>
                            </li>                            
                        </ul>
                    </div>
                </nav>
            );
        }
    }
}
