import React from 'react';
import './side-menu.css';
import {Link} from "react-router-dom";

export class SideMenu extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div class="flex-shrink-0 p-3 text-white bg-dark" id="side-menu">
                <Link to="/"
                   class="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom">
                    <span class="fs-5 fw-semibold text-white">Project Management Helper</span>
                </Link>
                <ul class="nav nav-pills flex-column mb-auto">
                    <li class="nav-item">
                        <button className="btn btn-toggle align-items-center rounded collapsed text-white"
                                data-bs-toggle="collapse" data-bs-target="#project-collapse" aria-expanded="true">
                            Project
                        </button>
                        <div className="collapse" id="project-collapse">
                            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                <li>
                                    <Link to="/redmine-project" class="nav-link text-white rounded">
                                        Create Project
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <button className="btn btn-toggle align-items-center rounded collapsed text-white"
                                data-bs-toggle="collapse" data-bs-target="#management-collapse" aria-expanded="true">
                            Management
                        </button>
                        <div className="collapse" id="management-collapse">
                            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                <li>
                                    <Link to="/management" class="nav-link text-white rounded">
                                        Redmine Check
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <button className="btn btn-toggle align-items-center rounded collapsed text-white"
                                data-bs-toggle="collapse" data-bs-target="#report-collapse" aria-expanded="true">
                            Reports
                        </button>
                        <div className="collapse" id="report-collapse">
                            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                <li>
                                    <Link to="/reports" class="nav-link text-white rounded">
                                        Report Project
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <button className="btn btn-toggle align-items-center rounded collapsed text-white"
                                data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="true">
                            Config
                        </button>
                        <div className="collapse" id="home-collapse">
                            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                <li>
                                    <Link to="/config" class="nav-link text-white rounded">
                                        Basic Config
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/config-redmine" class="nav-link text-white rounded">
                                        Redmine Config
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        );
    }
}