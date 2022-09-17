import React from 'react';
import './side-menu.css';
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";

export class SideMenu extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div class="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" id="side-menu">
                <Link to="/"
                   class="d-flex align-items-center me-md-auto text-white text-decoration-none">
                    <span class="fs-4">Project Management Helper</span>
                </Link>
                <hr />
                <ul class="nav nav-pills flex-column mb-auto">
                    <li class="nav-item">
                        <Link to="/home" class="nav-link active" aria-current="page">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/redmine-project" class="nav-link text-white">
                            Project
                        </Link>
                    </li>
                    <li>
                        <Link to="/management" class="nav-link text-white">
                            Management
                        </Link>
                    </li>
                    <li>
                        <Link to="/reports" class="nav-link text-white">
                            Reports
                        </Link>
                    </li>
                    <li>
                        <Link to="/config" class="nav-link text-white">
                            Config
                        </Link>
                    </li>
                </ul>
            </div>
        );
    }
}