import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('MazeCanvas がレンダリングされること', () => {
  render(<App />);
  const canvas = document.querySelector('canvas');
  expect(canvas).toBeInTheDocument();
});
