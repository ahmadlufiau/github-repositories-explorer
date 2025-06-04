import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import UserList from './UserList'
import { AppProvider } from '../context/AppContext'
import { useAppContext } from '../context/useAppContext'
import { getUserRepos } from '../services/githubApi'

// Mock the useAppContext hook
vi.mock('../context/useAppContext')

// Mock the githubApi
vi.mock('../services/githubApi', () => ({
  getUserRepos: vi.fn()
}))

describe('UserList', () => {
  const mockUsers = [
    {
      id: 1,
      login: 'testuser1',
      avatar_url: 'https://github.com/avatar1.png'
    },
    {
      id: 2,
      login: 'testuser2',
      avatar_url: 'https://github.com/avatar2.png'
    }
  ]

  const mockRepos = [
    {
      id: 1,
      name: 'repo1',
      description: 'Test repo 1',
      stargazers_count: 100,
      html_url: 'https://github.com/testuser1/repo1'
    },
    {
      id: 2,
      name: 'repo2',
      description: 'Test repo 2',
      stargazers_count: 200,
      html_url: 'https://github.com/testuser1/repo2'
    }
  ]

  it('renders empty state correctly', () => {
    vi.mocked(useAppContext).mockReturnValue({
      loading: false,
      searchResults: [],
      error: null,
      selectedUser: null,
      repos: [],
      searchQuery: '',
      searchUsers: vi.fn(),
      selectUser: vi.fn(),
      reset: vi.fn()
    })

    const { container } = render(
      <AppProvider>
        <UserList />
      </AppProvider>
    )

    // Component should return null when searchResults is empty
    expect(container.firstChild).toBeNull()
  })

  it('renders loading state correctly', () => {
    vi.mocked(useAppContext).mockReturnValue({
      loading: true,
      searchResults: [],
      error: null,
      selectedUser: null,
      repos: [],
      searchQuery: '',
      searchUsers: vi.fn(),
      selectUser: vi.fn(),
      reset: vi.fn()
    })

    const { container } = render(
      <AppProvider>
        <UserList />
      </AppProvider>
    )

    // Component should return null when loading is true
    expect(container.firstChild).toBeNull()
  })

  it('renders user list correctly', () => {
    vi.mocked(useAppContext).mockReturnValue({
      loading: false,
      searchResults: mockUsers,
      error: null,
      selectedUser: null,
      repos: [],
      searchQuery: 'test',
      searchUsers: vi.fn(),
      selectUser: vi.fn(),
      reset: vi.fn()
    })

    render(
      <AppProvider>
        <UserList />
      </AppProvider>
    )

    // Check if users are rendered
    expect(screen.getByText('testuser1')).toBeInTheDocument()
    expect(screen.getByText('testuser2')).toBeInTheDocument()
    expect(screen.getByText('Showing users for')).toBeInTheDocument()
    expect(screen.getByText('"test"')).toBeInTheDocument()
  })

  it('toggles accordion when clicking on user', async () => {
    vi.mocked(useAppContext).mockReturnValue({
      loading: false,
      searchResults: mockUsers,
      error: null,
      selectedUser: null,
      repos: [],
      searchQuery: 'test',
      searchUsers: vi.fn(),
      selectUser: vi.fn(),
      reset: vi.fn()
    })

    vi.mocked(getUserRepos).mockResolvedValue(mockRepos)

    render(
      <AppProvider>
        <UserList />
      </AppProvider>
    )

    // Click on first user
    const userButton = screen.getByText('testuser1').closest('button')
    fireEvent.click(userButton!)

    // Check if loading state is shown
    const expandedButton = screen.getByRole('button', { name: /testuser1/i })
    expect(expandedButton).toHaveAttribute('aria-expanded', 'true')

    // Wait for repos to load
    await waitFor(() => {
      expect(screen.getByText('repo1')).toBeInTheDocument()
      expect(screen.getByText('repo2')).toBeInTheDocument()
    })

    // Click again to close
    fireEvent.click(userButton!)
    expect(expandedButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('shows error state when repo loading fails', async () => {
    vi.mocked(useAppContext).mockReturnValue({
      loading: false,
      searchResults: mockUsers,
      error: null,
      selectedUser: null,
      repos: [],
      searchQuery: 'test',
      searchUsers: vi.fn(),
      selectUser: vi.fn(),
      reset: vi.fn()
    })

    const errorMessage = 'Failed to load repos'
    vi.mocked(getUserRepos).mockRejectedValue(new Error(errorMessage))

    render(
      <AppProvider>
        <UserList />
      </AppProvider>
    )

    // Click on first user
    const userButton = screen.getByText('testuser1').closest('button')
    fireEvent.click(userButton!)

    // Wait for error state and verify the error message
    await waitFor(() => {
      const errorElement = screen.getByText(errorMessage)
      expect(errorElement).toBeInTheDocument()
      expect(errorElement).toHaveClass('text-red-500')
    })
  })

  it('shows empty state when user has no repos', async () => {
    vi.mocked(useAppContext).mockReturnValue({
      loading: false,
      searchResults: mockUsers,
      error: null,
      selectedUser: null,
      repos: [],
      searchQuery: 'test',
      searchUsers: vi.fn(),
      selectUser: vi.fn(),
      reset: vi.fn()
    })

    vi.mocked(getUserRepos).mockResolvedValue([])

    render(
      <AppProvider>
        <UserList />
      </AppProvider>
    )

    // Click on first user
    const userButton = screen.getByText('testuser1').closest('button')
    fireEvent.click(userButton!)

    // Wait for empty state
    await waitFor(() => {
      expect(screen.getByText('No repositories found.')).toBeInTheDocument()
    })
  })
}) 