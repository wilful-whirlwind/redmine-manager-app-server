import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {CreateRedmineVersion} from "./pages/create-redmine-version";
import {Config} from "./pages/config";
import {SideMenu} from "./components/side-menu/side-menu";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Management} from "./pages/management";
import {Reports} from "./pages/reports";
import {ConfigRedmine} from "./pages/config-redmine";
import {ListRedmineVersion} from "./pages/list-redmine-version";
import {EditRedmineVersion} from "./pages/edit-redmine-version";

class Top extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.transitionToVersionDetailPage = this.transitionToVersionDetailPage.bind(this);
    }
    transitionToVersionDetailPage(name, value) {
        let state = {};
        state[name] = value;
        this.setState(state);
        document.getElementById("id-edit").click();
    }
    render() {
        return (
            <div class="top container-fluid">
                <script src="../public/ipc/ipc.js"></script>
                <script src="../public/style/style.js"></script>
                <BrowserRouter>
                    <div class="row" id="content-field">
                        <div class="col-2" id="side-menu-field">
                            <SideMenu />
                        </div>
                        <div class="col-10" id="main-content-field">
                            <Routes>
                                <Route path="/home" element={<EditRedmineVersion />} />
                                <Route path="/create-redmine-version" element={<CreateRedmineVersion />} />
                                <Route path="/list-redmine-version" element={<ListRedmineVersion callback={this.transitionToVersionDetailPage}/>} />
                                <Route path="/edit-redmine-version" element={<EditRedmineVersion id={this.state.id}/>}/>
                                <Route path="/management" element={<Management />} />
                                <Route path="/reports" element={<Reports />} />
                                <Route path="/config" element={<Config />} />
                                <Route path="/config-redmine" element={<ConfigRedmine />} />
                            </Routes>
                        </div>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Top />,
    document.getElementById('root')
);
