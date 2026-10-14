import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import Home from '@/app/(home)/page'

describe('Home page Menu', () => {
  it('renders the "Menu" text', () => {
    render(<Home />)

    expect(screen.getByText('Menu')).toBeInTheDocument()
  })
})
