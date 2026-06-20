import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PostCard } from './PostCard';

describe('PostCard', () => {
  it('renders title, category and date', () => {
    render(
      <PostCard
        title="测试文章"
        date={new Date('2026-06-01')}
        category="ai-infra"
        description="这是一篇测试文章"
        href="/posts/zh/test"
        lang="zh"
      />
    );
    expect(screen.getByText('测试文章')).toBeInTheDocument();
    expect(screen.getByText('AI 基础设施')).toBeInTheDocument();
    expect(screen.getByText('2026年6月1日')).toBeInTheDocument();
  });
});
