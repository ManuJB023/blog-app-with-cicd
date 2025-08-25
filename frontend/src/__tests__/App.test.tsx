import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders blog app header', () => {
  render(<App />);
  const headerElement = screen.getByRole('heading', { level: 1 });
  expect(headerElement).toHaveTextContent('My Blog');
});

test('renders blog posts section', () => {
  render(<App />);
  const postsElement = screen.getByText(/Blog Posts/i);
  expect(postsElement).toBeInTheDocument();
});
