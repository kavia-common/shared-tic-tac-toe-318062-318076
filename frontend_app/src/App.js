import React from 'react';
import TicTacToe from './components/TicTacToe';
import './App.css';

// PUBLIC_INTERFACE
/**
 * Main App component - Entry point for the Tic Tac Toe application
 * Provides the game interface with light theme styling
 */
function App() {
  return (
    <div className="App">
      <TicTacToe />
    </div>
  );
}

export default App;
