import React from 'react'
import { vi } from 'vitest'

// Mock window.scrollTo for jsdom
if (typeof window !== 'undefined') {
  window.scrollTo = vi.fn()
}

// Mock vite-react-ssg Head for component unit tests
vi.mock('vite-react-ssg', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>()
  return {
    ...actual,
    Head: ({ children }: { children?: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  }
})
