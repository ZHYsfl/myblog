import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders author and links', () => {
    render(<Footer />);
    expect(screen.getByText('Haoyang Zhou')).toBeInTheDocument();
    expect(screen.getByLabelText('GitHub')).toHaveAttribute('href', 'https://github.com/ZHYsfl');
    expect(screen.getByLabelText('Email')).toHaveAttribute('href', 'mailto:zhouhy5523@gmail.com');
  });
});
