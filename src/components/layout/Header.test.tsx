import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from './Header';

describe('Header', () => {
  it('renders author name and navigation', () => {
    render(<Header />);
    expect(screen.getByText('Haoyang Zhou')).toBeInTheDocument();
    expect(screen.getByText('文章')).toHaveAttribute('href', '/posts');
    expect(screen.getByText('音乐')).toHaveAttribute('href', '/music');
    expect(screen.getByText('关于')).toHaveAttribute('href', '/about');
  });
});
