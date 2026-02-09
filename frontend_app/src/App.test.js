import { render, screen } from '@testing-library/react';
import App from './App';

test('renders tic tac toe game', () => {
  render(<App />);
  const titleElement = screen.getByText(/Tic Tac Toe/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders game board', () => {
  render(<App />);
  const buttons = screen.getAllByRole('button');
  // Should have 9 squares + 2 control buttons (New Game + Share Game)
  expect(buttons.length).toBeGreaterThanOrEqual(11);
});
