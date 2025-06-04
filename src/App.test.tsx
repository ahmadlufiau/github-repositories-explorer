import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'
import { AppProvider } from './context/AppContext'

describe('App', () => {
  it('renders without crashing', () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    )
    
    // Check if the main heading is rendered
    expect(screen.getByText('GitHub Repositories Explorer')).toBeInTheDocument()
    // Check if the subtitle is rendered
    expect(screen.getByText('Search users and explore their repositories')).toBeInTheDocument()
  })
}) 