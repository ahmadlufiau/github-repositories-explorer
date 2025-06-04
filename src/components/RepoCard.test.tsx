import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import RepoCard from './RepoCard'

describe('RepoCard', () => {
  const mockRepo = {
    id: 1,
    name: 'test-repo',
    description: 'A test repository',
    stargazers_count: 100,
    html_url: 'https://github.com/testuser/test-repo'
  }

  it('renders repository information correctly', () => {
    render(<RepoCard repo={mockRepo} />)

    expect(screen.getByText('test-repo')).toBeInTheDocument()
    expect(screen.getByText('A test repository')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('renders link with correct href', () => {
    render(<RepoCard repo={mockRepo} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://github.com/testuser/test-repo')
  })

  it('renders without description', () => {
    const repoWithoutDescription = {
      ...mockRepo,
      description: ''
    }

    render(<RepoCard repo={repoWithoutDescription} />)

    expect(screen.getByText('test-repo')).toBeInTheDocument()
    expect(screen.queryByText('A test repository')).not.toBeInTheDocument()
  })
}) 