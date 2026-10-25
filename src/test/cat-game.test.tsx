import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CatGame } from '@/components/game/CatGame'

describe('CatGame component (404 Easter Egg)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders game section with title and initial idle screen', () => {
    render(
      <MemoryRouter>
        <CatGame />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('region', { name: /Neko Garden Leap Mini Game/i })
    ).not.toBeNull()
    expect(screen.getByText("Neko's Trail Leap")).not.toBeNull()
    expect(screen.getByRole('button', { name: /Start Journey/i })).not.toBeNull()
    expect(screen.getByText(/Treats:/i)).not.toBeNull()
    expect(screen.getByText(/Score:/i)).not.toBeNull()
  })

  it('toggles sound button aria-label on click', () => {
    render(
      <MemoryRouter>
        <CatGame />
      </MemoryRouter>
    )

    const soundBtn = screen.getByRole('button', { name: /Mute game sound effects/i })
    expect(soundBtn).not.toBeNull()

    fireEvent.click(soundBtn)
    expect(
      screen.getByRole('button', { name: /Unmute game sound effects/i })
    ).not.toBeNull()
  })

  it('starts game when Start Journey button is clicked', () => {
    render(
      <MemoryRouter>
        <CatGame />
      </MemoryRouter>
    )

    const startBtn = screen.getByRole('button', { name: /Start Journey/i })
    fireEvent.click(startBtn)

    // Idle overlay is removed
    expect(screen.queryByRole('button', { name: /Start Journey/i })).toBeNull()
  })

  it('loads high score from localStorage', () => {
    localStorage.setItem('neko_404_highscore', '150')

    render(
      <MemoryRouter>
        <CatGame />
      </MemoryRouter>
    )

    expect(screen.getByText('150')).not.toBeNull()
  })
})
