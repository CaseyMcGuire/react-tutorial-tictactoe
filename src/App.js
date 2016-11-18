import React from 'react';
import './index.css';

//React component class (or component type) takes in parameters, called 'props'
//and returns a hierarchy of views to display via the render method.

/*class Square extends React.Component {
  constructor() {
    super();
    //React components can have state by setting 'this.state' in the constructor,
    //which should be considered private to the component.
    this.state = {
      value: null,
    }
  }
  render() {
    return (
      <button className="square" onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}*/
//React supports a simpler syntax called 'stateless functional components' for
//component types like Square that only consist of a 'render' method. Rather than
//define a class extending React.Component, simply write a function that takes
//props and returns what should be rendered.
function Square(props) {
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  )
}

//When you want to aggregate data from multiple children or to have two child
//components communicate with each other, move the state upwards so that it lives
//in the parent component. The parent can then pass the state back down to the
//children via props, so that the child components are always in sync with each
//other.

class Board extends React.Component {

  renderSquare(i) {
    //since component state is private, we can't update Board's state directly
    //from Square. The usual pattern here is pass down a function from Board to
    //square that gets called when the square is clicked.
    //Note: we're also passing two props from Board to Square: 'value' and 'onClick'
    //Also note: 'onClick' doesn't have any special meaning here, but it's a popular
    //to name props starting with 'on' and their implementation with 'handle'.
    return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }
  /*handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }*/
  render() {
    const winner = calculateWinner(this.props.squares);
    let status;
    if (winner) {
      status = 'Winner ' + winner;
    } else {
      status = 'Next player: ' + (this.props.xIsNext ? 'X' : 'O');
    }
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(0).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0
    };
  }
  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    })
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    })
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    const moves = history.map((step, move) => {
    const desc = move ?
        'Move #' + move :
        'Game start';
        return (
          //key is a special property that's reserved by React (along with Ref,
          //a more advanced feature). When an element is created, React pulls
          //off the key property and stores the key directly on the returned element.

          //When a list is rerendered, React takes each element in the new version
          //and looks for one with a matching key in the previous list. When a key
          //is added to the set, a component is created; when a key is removed, a
          //component is destroyed. Keys tell React about the identity of each
          //component, so that it can maintain the state across rerenders. If you
          //change the key of a component, it will be completely destroyed and
          //recreated with a new state. 
          <li key={move}>
            <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
          </li>
        );
    });
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
export default Game;
