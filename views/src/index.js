import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Helmet } from "react-helmet"
import {CreateRedmineVersion} from "./pages/create-redmine-version";
import {Config} from "./pages/config";
import {SideMenu} from "./components/side-menu/side-menu";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Management} from "./pages/management";
import {Reports} from "./pages/reports";
import {Home} from "./pages/home";
import {ConfigRedmine} from "./pages/config-redmine";
import {ListRedmineVersion} from "./pages/list-redmine-version";
import {EditRedmineVersion} from "./pages/edit-redmine-version";

class Square extends React.Component {
    render() {
        return (
            <button
                className="square"
                onClick={() => this.props.onClick()}
            >
                {this.props.value}
            </button>
        );
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: [
                [0,1,2],
                [3,4,5],
                [6,7,8],
            ],
            currentPlayer: "X"
        };
    }

    async handleClick(i, j) {
        console.log(i,j);
        const filePath = await window.electronAPI.initializeVersion()
        console.log(filePath);
        let currentSquares = this.state.squares;
        const nextPlayer = this.state.currentPlayer === "X" ? "0" : "X";
        currentSquares[i][j] = nextPlayer;
        this.setState({currentPlayer: nextPlayer, squares: currentSquares});
    }

    renderSquare(i, j) {
        return (
            <Square
                value={this.state.squares[i][j]}
                onClick={() => this.handleClick(i, j)}
            />
        );
    }

    render() {
        const status = 'Next player: X';

        return (
            <div>
                <div className="status">{status}</div>
                <div className="board-row">
                    {this.renderSquare(0,0, this.props.currentPlayer)}
                    {this.renderSquare(0,1, this.props.currentPlayer)}
                    {this.renderSquare(0,2, this.props.currentPlayer)}
                </div>
                <div className="board-row">
                    {this.renderSquare(1,0, this.props.currentPlayer)}
                    {this.renderSquare(1,1, this.props.currentPlayer)}
                    {this.renderSquare(1,2, this.props.currentPlayer)}
                </div>
                <div className="board-row">
                    {this.renderSquare(2,0, this.props.currentPlayer)}
                    {this.renderSquare(2,1, this.props.currentPlayer)}
                    {this.renderSquare(2,2, this.props.currentPlayer)}
                </div>
            </div>
        );
    }
}

class Head extends React.Component {
    constructor(props) {
        super(props);
        this.title = props.title;
    }
    render() {
        return (
            <Helmet>
                <title>{this.title}</title>
                <link rel="stylesheet" href="../public/lib/bootstrap-5.0.2-dist/css/bootstrap.css"/>
                <script src="../public/lib/bootstrap-5.0.2-dist/js/bootstrap.js"></script>
            </Helmet>
        );
    }
}

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
                <Head title="Project Manager" />

                <BrowserRouter>
                    <div class="row" id="content-field">
                        <div class="col-3" id="side-menu-field">
                            <SideMenu />
                        </div>
                        <div class="col-9" id="main-content-field">
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
