import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);
  // https://github.com/testing-library/jest-dom/issues/515
  // expect(linkElement).toBeInTheDocument();
});
