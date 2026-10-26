import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { useToast } from '@/store/toast'
import { Toast } from '@/components/ui/Toast'

describe('Toast Store & Component', () => {
  beforeEach(() => {
    useToast.getState().hideToast()
    vi.clearAllTimers()
  })

  it('showToast adds a toast item and hideToast clears it', () => {
    act(() => {
      useToast.getState().showToast({
        message: 'Added to your bag.',
      })
    })

    expect(useToast.getState().current?.message).toBe('Added to your bag.')

    act(() => {
      useToast.getState().hideToast()
    })

    expect(useToast.getState().current).toBeNull()
  })

  it('renders Toast with role status and aria-live polite', () => {
    act(() => {
      useToast.getState().showToast({
        message: 'Item added.',
      })
    })

    render(<Toast />)
    const toastEl = screen.getByRole('status')
    expect(toastEl).toBeTruthy()
    expect(toastEl.getAttribute('aria-live')).toBe('polite')
    expect(screen.getByText('Item added.')).toBeTruthy()
  })

  it('triggers undoAction and updates message when Undo is clicked', () => {
    const undoSpy = vi.fn()
    act(() => {
      useToast.getState().showToast({
        message: 'Added Chicken Broth to your bag.',
        undoAction: undoSpy,
      })
    })

    render(<Toast />)
    const undoBtn = screen.getByText('Undo')
    expect(undoBtn).toBeTruthy()

    fireEvent.click(undoBtn)
    expect(undoSpy).toHaveBeenCalledOnce()
    expect(screen.getByText('Addition undone.')).toBeTruthy()
  })

  it('dismiss button closes the toast', () => {
    act(() => {
      useToast.getState().showToast({
        message: 'Test message',
      })
    })

    render(<Toast />)
    const dismissBtn = screen.getByLabelText('Dismiss notification')
    fireEvent.click(dismissBtn)

    expect(useToast.getState().current).toBeNull()
  })
})
