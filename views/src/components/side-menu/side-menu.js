import React from 'react';
import './side-menu.css';

export class SideMenu extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div class="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" id="side-menu">
                <a href="/"
                   class="d-flex align-items-center me-md-auto text-white text-decoration-none">
                    <span class="fs-4">Project Management Helper</span>
                </a>
                <hr />
                <ul class="nav nav-pills flex-column mb-auto">
                    <li class="nav-item">
                        <a href="#" class="nav-link active" aria-current="page">
                            Home
                        </a>
                    </li>
                    <li>
                        <a href="#" class="nav-link text-white">
                            Project
                        </a>
                    </li>
                    <li>
                        <a href="#" class="nav-link text-white">
                            Management
                        </a>
                    </li>
                    <li>
                        <a href="#" class="nav-link text-white">
                            Reports
                        </a>
                    </li>
                    <li>
                        <a href="#" class="nav-link text-white">
                            Settings
                        </a>
                    </li>
                </ul>
            </div>
        );
    }
}