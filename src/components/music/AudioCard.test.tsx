import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AudioCard } from './AudioCard';

describe('AudioCard', () => {
  it('renders song info', () => {
    render(
      <AudioCard
        title="测试歌曲"
        artist="周浩洋"
        originalArtist="原唱"
        isPlaying={false}
        isCurrent={false}
        onClick={vi.fn()}
      />
    );
    expect(screen.getByText('测试歌曲')).toBeInTheDocument();
    expect(screen.getByText('周浩洋 · 原唱 原唱')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(
      <AudioCard
        title="测试"
        artist="周浩洋"
        isPlaying={false}
        isCurrent={false}
        onClick={onClick}
      />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
