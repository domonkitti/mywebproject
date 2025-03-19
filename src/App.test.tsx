// src/App.test.tsx
// import React from 'react';
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App Component', () => {
  it('renders without crashing', () => {
    // Render the App component
    render(<App />)

    // Basic test to check if App renders (you can extend this later with more tests)
    expect(true).toBe(true)
  })
})
