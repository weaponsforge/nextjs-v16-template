import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import Home from '@/app/(home)/page'

describe('Home page Button', () => {
  it('renders an enabled "Get Started" button', () => {
    render(<Home />)

    const button = screen.getByRole('button', { name: 'Get Started' })

    expect(button).toBeEnabled()
    expect(button).toHaveAttribute('type', 'button')
  })
})
