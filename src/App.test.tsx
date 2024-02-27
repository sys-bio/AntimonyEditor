import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders title', () => {
  jest.mock('monaco-editor', ()=>({})=>(<div></div>));
  render(<App />);
  const linkElement = screen.getByText('The Official Antimony Web Editor');
  expect(linkElement).toBeInTheDocument();
});
