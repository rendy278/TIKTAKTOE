import React, { useState, useEffect } from "react";
import "./Tictactoe.css";
import Circle from "../circle.png";
import Cross from "../cross.png";

const Tictactoe = () => {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [count, setCount] = useState(0);
  const [lock, setLock] = useState(false);
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const currentPlayer = count % 2 === 0 ? "Player 1 " : "Player 2 ";

  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];

  const checkWin = () => {
    for (const condition of winConditions) {
      const [a, b, c] = condition;
      if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        setLock(true);
        updateScore(board[a]);
        return;
      }
    }

    // Check for a tie
    if (count === 8 && !winner) {
      setWinner("tie");
      setLock(true);
    }
  };

  const updateScore = (winner) => {
    if (winner === "x") {
      setScores((prevScores) => ({
        ...prevScores,
        player1: prevScores.player1 + 1,
      }));
    } else if (winner === "o") {
      setScores((prevScores) => ({
        ...prevScores,
        player2: prevScores.player2 + 1,
      }));
    }
  };

  const handleClick = (index) => {
    if (lock || board[index] !== "") {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = count % 2 === 0 ? "x" : "o";

    setBoard(newBoard);
    setCount(count + 1);
    checkWin();
  };

  const resetGame = () => {
    setBoard(Array(9).fill(""));
    setCount(0);
    setLock(false);
    setWinner(null);
  };

  useEffect(() => {
    // If it's Player 2's turn and the game is not locked
    if (count % 2 === 1 && !lock) {
      // Implement the Minimax algorithm for Player 2
      const bestMove = minimax(board, "o", count).index;

      // Simulate a delay to make it look like AI is "thinking"
      setTimeout(() => handleClick(bestMove), 500);
    }
  }, [count, board, lock]);

  const minimax = (board, player, depth) => {
    const availableSpots = emptySquares(board);

    if (checkWinning(board, "x")) {
      return { score: -10 + depth };
    } else if (checkWinning(board, "o")) {
      return { score: 10 - depth };
    } else if (availableSpots.length === 0) {
      return { score: 0 };
    }

    const moves = [];
    for (let i = 0; i < availableSpots.length; i++) {
      const move = {};
      move.index = availableSpots[i];
      board[availableSpots[i]] = player;

      const result = minimax(board, player === "x" ? "o" : "x", depth + 1);
      move.score = result.score;

      board[availableSpots[i]] = "";

      moves.push(move);
    }

    let bestMove;
    if (player === "o") {
      let bestScore = -Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove];
  };

  const emptySquares = (board) => {
    return board.reduce(
      (acc, value, index) => (value === "" ? acc.concat(index) : acc),
      []
    );
  };

  const checkWinning = (board, player) => {
    for (const condition of winConditions) {
      const [a, b, c] = condition;
      if (board[a] === player && board[b] === player && board[c] === player) {
        return true;
      }
    }
    return false;
  };

  const renderSquare = (index) => (
    <div className="boxes" onClick={() => handleClick(index)}>
      {board[index] === "x" && <img src={Cross} alt="cross" />}
      {board[index] === "o" && <img src={Circle} alt="circle" />}
    </div>
  );

  return (
    <div>
      <div className="container">
        <h1 className="title">
          Tic Tac Toe Game In <span>REACT JS</span>
        </h1>
        <div className="score">
          Skor: <br /> Player 1{" "}
          <span className="skr">
            {scores.player1} - {scores.player2}
          </span>{" "}
          Player 2
        </div>
        <div className="board">
          {[0, 1, 2].map((row) => (
            <div key={row} className={`row${row + 1}`}>
              {[0, 1, 2].map((col) => (
                <div key={row * 3 + col}>{renderSquare(row * 3 + col)}</div>
              ))}
            </div>
          ))}
        </div>
        <div className="status">
          {winner
            ? winner === "tie"
              ? "Permainan Seri!"
              : `Selamat: ${winner === "x" ? "Player 1 " : "Player 2 "}`
            : `Giliran: ${currentPlayer}`}
        </div>

        <button className="reset" onClick={resetGame}>
          RESET
        </button>
      </div>
    </div>
  );
};

export default Tictactoe;
