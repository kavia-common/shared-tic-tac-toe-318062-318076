import React, { useState, useEffect } from 'react';
import './TicTacToe.css';

// PUBLIC_INTERFACE
/**
 * TicTacToe component - Main game component handling game logic and state
 * Supports same-device play and share-by-link functionality
 */
function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameId, setGameId] = useState(null);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [showCopied, setShowCopied] = useState(false);

  // Initialize or join game from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlGameId = params.get('game');
    
    if (urlGameId) {
      // Load game state from localStorage if it exists
      const savedGame = localStorage.getItem(`tictactoe_${urlGameId}`);
      if (savedGame) {
        const gameState = JSON.parse(savedGame);
        setBoard(gameState.board);
        setIsXNext(gameState.isXNext);
        setGameId(urlGameId);
      } else {
        // New shared game
        setGameId(urlGameId);
      }
    } else {
      // Generate new game ID for potential sharing
      const newGameId = generateGameId();
      setGameId(newGameId);
    }
  }, []);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    if (gameId) {
      const gameState = {
        board,
        isXNext,
        timestamp: Date.now()
      };
      localStorage.setItem(`tictactoe_${gameId}`, JSON.stringify(gameState));
    }
  }, [board, isXNext, gameId]);

  // Check for winner whenever board changes
  useEffect(() => {
    const result = calculateWinner(board);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
    } else {
      setWinner(null);
      setWinningLine([]);
    }
  }, [board]);

  // PUBLIC_INTERFACE
  /**
   * Generate a unique game ID for sharing
   */
  const generateGameId = () => {
    return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
  };

  // PUBLIC_INTERFACE
  /**
   * Calculate winner and winning line
   */
  const calculateWinner = (squares) => {
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
        return { winner: squares[a], line: lines[i] };
      }
    }
    return null;
  };

  // PUBLIC_INTERFACE
  /**
   * Handle square click
   */
  const handleClick = (index) => {
    if (board[index] || winner) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  // PUBLIC_INTERFACE
  /**
   * Reset the game
   */
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine([]);
  };

  // PUBLIC_INTERFACE
  /**
   * Share game link
   */
  const shareGame = () => {
    const gameUrl = `${window.location.origin}${window.location.pathname}?game=${gameId}`;
    navigator.clipboard.writeText(gameUrl).then(() => {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    });
  };

  // PUBLIC_INTERFACE
  /**
   * Render a single square
   */
  const renderSquare = (index) => {
    const isWinningSquare = winningLine.includes(index);
    return (
      <button
        className={`square ${isWinningSquare ? 'winning' : ''} ${board[index] ? 'filled' : ''}`}
        onClick={() => handleClick(index)}
        disabled={!!winner || !!board[index]}
      >
        {board[index]}
      </button>
    );
  };

  // Get game status
  const getStatus = () => {
    if (winner) {
      return `Winner: ${winner}`;
    } else if (board.every(square => square !== null)) {
      return "It's a Draw!";
    } else {
      return `Current Player: ${isXNext ? 'X' : 'O'}`;
    }
  };

  return (
    <div className="tictactoe-container">
      <div className="game-header">
        <h1 className="game-title">Tic Tac Toe</h1>
        <p className="game-subtitle">Challenge your friends!</p>
      </div>

      <div className="control-panel">
        <div className="status">{getStatus()}</div>
        <div className="button-group">
          <button className="btn btn-primary" onClick={resetGame}>
            New Game
          </button>
          <button className="btn btn-secondary" onClick={shareGame}>
            {showCopied ? '✓ Link Copied!' : 'Share Game'}
          </button>
        </div>
      </div>

      <div className="board">
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>

      {winner && (
        <div className="winner-banner">
          <div className="winner-content">
            <span className="winner-emoji">🎉</span>
            <span className="winner-text">Player {winner} Wins!</span>
            <span className="winner-emoji">🎉</span>
          </div>
        </div>
      )}

      <div className="game-info">
        <p className="info-text">
          Play on the same device or share the link to play with a friend remotely!
        </p>
      </div>
    </div>
  );
}

export default TicTacToe;
