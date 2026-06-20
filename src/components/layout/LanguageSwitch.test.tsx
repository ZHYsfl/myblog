import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LanguageSwitch } from './LanguageSwitch';

describe('LanguageSwitch', () => {
  it('renders link to target language', () => {
    render(<LanguageSwitch current="zh" targetHref="/posts/en/test" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/posts/en/test');
    expect(screen.getByText('EN')).toBeInTheDocument();
  });
});
