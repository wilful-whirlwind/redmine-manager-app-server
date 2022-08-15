import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

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

    handleClick(i, j) {
        console.log(i,j);
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

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board currentPlayer="X"/>
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
