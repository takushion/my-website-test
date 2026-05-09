import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('初期ロード時にローディング表示が出ること', async () => {
  render(<App />);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});
