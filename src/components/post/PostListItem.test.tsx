import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PostListItem } from './PostListItem';

describe('PostListItem', () => {
  it('renders title, date and category', () => {
    render(
      <PostListItem
        title="测试标题"
        date={new Date('2026-06-20')}
        category="ai-infra"
        description="测试描述"
        href="/posts/zh/test"
        lang="zh"
      />
    );
    expect(screen.getByText('测试标题')).toBeInTheDocument();
    expect(screen.getByText('测试描述')).toBeInTheDocument();
    expect(screen.getByText('AI 基础设施')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/posts/zh/test');
  });
});
