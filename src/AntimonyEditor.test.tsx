import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders conversion dropdown', () => {
  render(<App />);
  const conversionDrop = screen.getByText(/Conversion/i);
  expect(conversionDrop).toBeInTheDocument();
});

