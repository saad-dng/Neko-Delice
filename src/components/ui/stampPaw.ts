/**
 * stampPaw — Programmatically injects a brief tactile paw print onto a button
 * Automatically cleaned up after 350ms; respects prefers-reduced-motion
 */
export function stampPaw(element: HTMLElement) {
  if (typeof window === 'undefined') return

  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
  if (prefersReduced) return

  // Ensure target has a relative positioning context
  const computedPos = window.getComputedStyle(element).position
  if (computedPos === 'static') {
    element.style.position = 'relative'
  }

  const stamp = document.createElement('div')
  stamp.setAttribute('aria-hidden', 'true')
  stamp.className = 'absolute pointer-events-none z-20 flex items-center justify-center inset-0'
  stamp.innerHTML = `
    <svg viewBox="0 0 24 24" class="w-6 h-6 text-current opacity-80 animate-paw-stamp" fill="currentColor">
      <ellipse cx="12" cy="14" rx="4.5" ry="4" />
      <circle cx="7" cy="8" r="1.8" />
      <circle cx="10.5" cy="5.8" r="1.8" />
      <circle cx="14.5" cy="6" r="1.8" />
      <circle cx="17.8" cy="8.8" r="1.8" />
    </svg>
  `

  element.appendChild(stamp)

  setTimeout(() => {
    if (stamp.parentNode) {
      stamp.parentNode.removeChild(stamp)
    }
  }, 350)
}

export default stampPaw
