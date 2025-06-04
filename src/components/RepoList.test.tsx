import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import RepoList from './RepoList'
import { AppProvider } from '../context/AppContext'
import { useAppContext } from '../context/useAppContext'

// Mock the useAppContext hook
vi.mock('../context/useAppContext')

describe('RepoList', () => {
  const mockUser = {
    id: 1,
    login: 'testuser',
    avatar_url: 'https://github.com/avatar.png'
  }

  const mockUsers = [
    mockUser,
    {
      id: 2,
      login: 'testuser2',
      avatar_url: 'https://github.com/avatar2.png'
    }
  ]

  it('renders empty state correctly', () => {
    vi.mocked(useAppContext).mockReturnValue({
      loading: false,
      searchResults: mockUsers,
      error: null,
      selectedUser: mockUser,
      repos: [],
      searchQuery: '',
      searchUsers: vi.fn(),
      selectUser: vi.fn(),
      reset: vi.fn()
    })

    render(
      <AppProvider>
        <RepoList />
      </AppProvider>
    )

    // Check if the empty state message is rendered
    expect(screen.getByText('No repositories found.')).toBeInTheDocument()
    // Check if the user dropdown is rendered
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByText('testuser')).toBeInTheDocument()
    expect(screen.getByText('testuser2')).toBeInTheDocument()
  })

  it('renders loading state correctly', () => {
    vi.mocked(useAppContext).mockReturnValue({
      loading: true,
      searchResults: mockUsers,
      error: null,
      selectedUser: mockUser,
      repos: [],
      searchQuery: '',
      searchUsers: vi.fn(),
      selectUser: vi.fn(),
      reset: vi.fn()
    })

    render(
      <AppProvider>
        <RepoList />
      </AppProvider>
    )

    // Check if loading spinner is rendered
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('renders repositories correctly', () => {
    const mockRepos = [
      {
        id: 1,
        name: 'repo1',
        description: 'Test repo 1',
        stargazers_count: 100,
        html_url: 'https://github.com/testuser/repo1'
      },
      {
        id: 2,
        name: 'repo2',
        description: 'Test repo 2',
        stargazers_count: 200,
        html_url: 'https://github.com/testuser/repo2'
      }
    ]

    vi.mocked(useAppContext).mockReturnValue({
      loading: false,
      searchResults: mockUsers,
      error: null,
      selectedUser: mockUser,
      repos: mockRepos,
      searchQuery: '',
      searchUsers: vi.fn(),
      selectUser: vi.fn(),
      reset: vi.fn()
    })

    render(
      <AppProvider>
        <RepoList />
      </AppProvider>
    )

    // Check if repositories are rendered
    expect(screen.getByText('repo1')).toBeInTheDocument()
    expect(screen.getByText('repo2')).toBeInTheDocument()
    expect(screen.getByText('Test repo 1')).toBeInTheDocument()
    expect(screen.getByText('Test repo 2')).toBeInTheDocument()
  })

  it('renders error state correctly', () => {
    vi.mocked(useAppContext).mockReturnValue({
      loading: false,
      searchResults: mockUsers,
      error: 'Failed to load repositories',
      selectedUser: mockUser,
      repos: [],
      searchQuery: '',
      searchUsers: vi.fn(),
      selectUser: vi.fn(),
      reset: vi.fn()
    })

    render(
      <AppProvider>
        <RepoList />
      </AppProvider>
    )

    // Check if error message is rendered
    expect(screen.getByText('Failed to load repositories')).toBeInTheDocument()
  })

  it('handles user selection from dropdown', () => {
    const selectUser = vi.fn()
    vi.mocked(useAppContext).mockReturnValue({
      loading: false,
      searchResults: mockUsers,
      error: null,
      selectedUser: mockUser,
      repos: [],
      searchQuery: '',
      searchUsers: vi.fn(),
      selectUser,
      reset: vi.fn()
    })

    render(
      <AppProvider>
        <RepoList />
      </AppProvider>
    )

    // Get the select element
    const select = screen.getByRole('combobox')
    
    // Change the selection to the second user
    fireEvent.change(select, { target: { value: 'testuser2' } })

    // Verify that selectUser was called with the correct user
    expect(selectUser).toHaveBeenCalledWith(mockUsers[1])
  })

  it('does not call selectUser when user is not found', () => {
    const selectUser = vi.fn()
    vi.mocked(useAppContext).mockReturnValue({
      loading: false,
      searchResults: mockUsers,
      error: null,
      selectedUser: mockUser,
      repos: [],
      searchQuery: '',
      searchUsers: vi.fn(),
      selectUser,
      reset: vi.fn()
    })

    render(
      <AppProvider>
        <RepoList />
      </AppProvider>
    )

    // Get the select element
    const select = screen.getByRole('combobox')
    
    // Try to select a non-existent user
    fireEvent.change(select, { target: { value: 'nonexistentuser' } })

    // Verify that selectUser was not called
    expect(selectUser).not.toHaveBeenCalled()
  })
}) 