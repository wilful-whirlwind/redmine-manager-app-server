import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {TitleLabel} from './components/title-label/title-label';
import { Helmet } from "react-helmet"

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
        const filePath = await window.electronAPI.openFile()
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

const Head = (props) => {
    const {title} = props
    return (
        <Helmet>
            <title>{title}</title>
            <link rel="stylesheet" href="../public/lib/bootstrap-5.0.2-dist/css/bootstrap.css" />
            <script src="../public/lib/bootstrap-5.0.2-dist/js/bootstrap.js"></script>
        </Helmet>
    )
}

class Top extends React.Component {
    render() {
        return (
            <div class="top">
                <Head title="test"></Head>
                <div className="container">
                    <div className="row">
                        <div className="col-3">
                            <div className="version-area">
                                <TitleLabel label="version"></TitleLabel>
                            </div>
                        </div>
                        <div className="col-9">
                            <div className="version-area">
                                <TitleLabel label="version"></TitleLabel>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-9">
                            <div className="version-area">
                                <TitleLabel label="version"></TitleLabel>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="version-area">
                                <TitleLabel label="version"></TitleLabel>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Top />,
    document.getElementById('root')
);
