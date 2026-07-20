import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Secure Print heading', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /secure print/i })).toBeInTheDocument();
});
