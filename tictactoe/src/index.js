import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
    return (
        <button className={props.className} onClick={props.onClick}>
            {props.value}
        </button>
    )
}

function Toggle(props){
  return (
    <button className= "togglebutton" onClick = {props.onClick}>
      {props.value}
    </button>
  )
}
  class Board extends React.Component {
  
    renderSquare(i,isWin) {
      return (
        <Square
            value ={this.props.squares[i]}
            onClick = {()=> this.props.onClick(i)}
            className = {isWin}    
        />
      );
    }

    renderToggle(){
      return (
        <Toggle 
          value = {"ToggleView"}
          onClick = { () => this.props.onToggle()}
        />
      );
    }
  
    render() {
        let squares= [];
        for (let i =0; i < 3; i++){
            let row = [];
            
            for(let j=0; j < 3; j++){
              let isWin = "square";
              
              if( this.props.winner && this.props.winner.indexOf(i*3 + j) !== -1 ){ // this square is part of the winning triplet of squares
                  isWin = isWin + " win";
              }
              row.push(<span key={i*3 + j}>{this.renderSquare(i*3 + j, isWin)}</span>);
            }
            squares.push(
                <div className="board-row" key={i}>
                {row}</div>);
        }      
        
        return (
            <div>
            {squares}
            {this.renderToggle()}
            </div>
      );
    }
  }
  
  class Game extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        history:[{
          squares: Array(9).fill(null),
          lastmove: Array(2).fill(null),
          winner: Array(3).fill(null),
        }],
        stepNumber: 0,
        xIsNext: true,
        toggle: false,
      }
    }

      
    handleClick(i){
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      const lastmove = current.lastmove.slice();

      if (calculateWinner(squares) || squares[i]) {
        return;
      }

      squares[i] = this.state.xIsNext ? 'X' : 'O';
      lastmove[0] = Math.floor(i/3); 
      lastmove[1] = i%3;
      const winner = calculateWinner(squares);

      this.setState({
        history: history.concat([{
          squares: squares,  
          lastmove: lastmove,
          winner: winner,        
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }

    toggleView(){
      this.setState({
        toggle: !this.state.toggle,
      });
    }

    jumpTo(step){
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }


    render() {

      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);


      const moves = history.map((step, move) => {
        const lastmove = step.lastmove;
        // console.log(lastmove);
        const desc = move ? 
          `Go to move col: ${lastmove[1]} row: ${lastmove[0]}` :
          'Go to game start';
        const bold = (move === this.state.stepNumber)? 'bold' :'';
        return (
          <li key={move}>
            <button className={bold} onClick = {
              () => this.jumpTo(move)}
            >{desc}</button>
          </li>
        );
      });

      if(this.state.toggle)
        moves.reverse();

      let status;

      if(winner){
        status = `Winner ${current.squares[winner[0]]}`;
      } else if( this.state.stepNumber === 9){
        status = 'Match Drawn';
      }
       else {
        status = `Next player: ${(this.state.xIsNext ? 'X' : 'O')}`;
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares = {current.squares}
              onClick= { (i) => this.handleClick(i)}
              onToggle= { () => this.toggleView() }
              winner = {current.winner}
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
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );


  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [0, 3, 6],
      [0, 4, 8],
      [1, 4, 7],
      [2, 5, 8],
      [3, 4, 5],
      [6, 7, 8],
      [6, 4, 2],
    ];
    for (let i = 0; i < lines.length ; i++) {
      const [a, b, c] = lines[i];
      if(squares[a] === squares[b] && squares[a] === squares[c] && squares[a]!=null ){
        return [a ,b ,c];
      }
    }
    return null;
  }