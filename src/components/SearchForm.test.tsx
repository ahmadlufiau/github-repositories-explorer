import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SearchForm from './SearchForm'
import { AppProvider } from '../context/AppContext'

describe('SearchForm', () => {
  it('renders search form correctly', () => {
    render(
      <AppProvider>
        <SearchForm />
      </AppProvider>
    )

    // Check if input and button are rendered
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()
  })

  it('disables search button when input is empty', () => {
    render(
      <AppProvider>
        <SearchForm />
      </AppProvider>
    )

    const searchButton = screen.getByRole('button', { name: 'Search' })
    expect(searchButton).toBeDisabled()
  })

  it('enables search button when input has text', () => {
    render(
      <AppProvider>
        <SearchForm />
      </AppProvider>
    )

    const input = screen.getByPlaceholderText('Enter username')
    fireEvent.change(input, { target: { value: 'testuser' } })

    const searchButton = screen.getByRole('button', { name: 'Search' })
    expect(searchButton).not.toBeDisabled()
  })

  it('shows loading state when searching', () => {
    render(
      <AppProvider>
        <SearchForm />
      </AppProvider>
    )

    const input = screen.getByPlaceholderText('Enter username')
    fireEvent.change(input, { target: { value: 'testuser' } })

    const searchButton = screen.getByRole('button', { name: 'Search' })
    fireEvent.click(searchButton)

    // Check if loading spinner is shown
    expect(screen.getByRole('button', { name: 'Search' })).toHaveAttribute('disabled')
  })
}) 