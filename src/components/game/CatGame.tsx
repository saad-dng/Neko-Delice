import { useEffect, useRef, useState, useCallback } from 'react'
import { CatSitting } from '@/components/cat-art/CatSitting'
import { CatSleeping } from '@/components/cat-art/CatSleeping'
import { Button } from '@/components/ui/Button'

interface Obstacle {
  x: number
  y: number
  width: number
  height: number
  type: 'bowl' | 'scratcher' | 'herb'
}

interface Treat {
  x: number
  y: number
  radius: number
  collected: boolean
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string
}

interface FloatingText {
  x: number
  y: number
  text: string
  opacity: number
}

// Simple Web Audio synthesizer (no external audio files needed)
class GameAudio {
  private ctx: AudioContext | null = null
  public enabled: boolean = true

  private getContext(): AudioContext | null {
    if (!this.enabled || typeof window === 'undefined') return null
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioCtx) return null
      if (!this.ctx) {
        this.ctx = new AudioCtx()
      }
      if (this.ctx.state === 'suspended') {
        void this.ctx.resume()
      }
      return this.ctx
    } catch {
      return null
    }
  }

  playJump() {
    const ctx = this.getContext()
    if (!ctx) return
    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const t = ctx.currentTime
      osc.type = 'sine'
      osc.frequency.setValueAtTime(320, t)
      osc.frequency.exponentialRampToValueAtTime(560, t + 0.1)
      gain.gain.setValueAtTime(0.08, t)
      gain.gain.linearRampToValueAtTime(0.001, t + 0.1)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.1)
    } catch {
      // Audio autoplay policy fallback
    }
  }

  playTreat() {
    const ctx = this.getContext()
    if (!ctx) return
    try {
      const t = ctx.currentTime
      ;[523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        const startTime = t + i * 0.04
        osc.frequency.setValueAtTime(freq, startTime)
        gain.gain.setValueAtTime(0.07, startTime)
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(startTime)
        osc.stop(startTime + 0.15)
      })
    } catch {
      // Audio fallback
    }
  }

  playGameOver() {
    const ctx = this.getContext()
    if (!ctx) return
    try {
      const t = ctx.currentTime
      ;[440, 392, 349.23].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        const startTime = t + i * 0.08
        osc.frequency.setValueAtTime(freq, startTime)
        gain.gain.setValueAtTime(0.08, startTime)
        gain.gain.linearRampToValueAtTime(0.001, startTime + 0.18)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(startTime)
        osc.stop(startTime + 0.18)
      })
    } catch {
      // Audio fallback
    }
  }
}

const audio = new GameAudio()

export function CatGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle')
  const [score, setScore] = useState(0)
  const [treatsCount, setTreatsCount] = useState(0)
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window === 'undefined') return 0
    try {
      const saved = localStorage.getItem('neko_404_highscore')
      return saved ? parseInt(saved, 10) || 0 : 0
    } catch {
      return 0
    }
  })
  const [soundOn, setSoundOn] = useState(true)
  const [isNewRecord, setIsNewRecord] = useState(false)

  // Internal game engine state ref to keep 60fps loop free of stale React closures
  const gameRef = useRef({
    state: 'idle' as 'idle' | 'playing' | 'gameover',
    score: 0,
    treats: 0,
    catX: 72,
    catY: 195,
    velocityY: 0,
    isGrounded: true,
    speed: 220,
    distanceTimer: 0,
    obstacleTimer: 1.2,
    treatTimer: 0.8,
    runCycle: 0,
    obstacles: [] as Obstacle[],
    treatsList: [] as Treat[],
    particles: [] as Particle[],
    floatingTexts: [] as FloatingText[],
    groundOffset: 0,
    lastTime: 0,
  })

  // Sync sound settings
  useEffect(() => {
    audio.enabled = soundOn
  }, [soundOn])

  // Start / restart game
  const startGame = useCallback(() => {
    const g = gameRef.current
    g.state = 'playing'
    g.score = 0
    g.treats = 0
    g.catY = 195
    g.velocityY = 0
    g.isGrounded = true
    g.speed = 220
    g.distanceTimer = 0
    g.obstacleTimer = 1.6
    g.treatTimer = 1.0
    g.obstacles = []
    g.treatsList = []
    g.particles = []
    g.floatingTexts = []
    g.groundOffset = 0
    g.lastTime = performance.now()

    setScore(0)
    setTreatsCount(0)
    setIsNewRecord(false)
    setGameState('playing')
  }, [])

  // Cat jump trigger
  const jump = useCallback(() => {
    const g = gameRef.current
    if (g.state === 'idle' || g.state === 'gameover') {
      startGame()
      return
    }
    if (g.isGrounded) {
      g.velocityY = -480
      g.isGrounded = false
      audio.playJump()
    }
  }, [startGame])

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in form controls
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return
      }

      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault()
        jump()
      }
    }

    window.addEventListener('keydown', handleKeyDown, { passive: false })
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [jump])

  // Main 60fps canvas loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const g = gameRef.current

    // Setup high-DPI scaling
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const baseW = 640
    const baseH = 240
    canvas.width = baseW * dpr
    canvas.height = baseH * dpr

    const groundY = 195
    const gravity = 1350

    const render = (now: number) => {
      if (!g.lastTime) g.lastTime = now
      let dt = (now - g.lastTime) / 1000
      g.lastTime = now
      if (dt > 0.1) dt = 0.1 // Cap max delta time if tab was hidden

      // ==========================================
      // UPDATE STATE (when playing)
      // ==========================================
      if (g.state === 'playing') {
        // Accelerate gradually
        g.speed = Math.min(380, 220 + g.score * 0.15)

        // Distance & score progression
        g.distanceTimer += dt
        if (g.distanceTimer >= 0.12) {
          g.distanceTimer = 0
          g.score += 1
          setScore(g.score)
        }

        // Cat physics
        g.velocityY += gravity * dt
        g.catY += g.velocityY * dt
        if (g.catY >= groundY) {
          g.catY = groundY
          g.velocityY = 0
          g.isGrounded = true
        }

        g.runCycle += dt * (g.speed / 18)
        g.groundOffset = (g.groundOffset + g.speed * dt) % 40

        // Spawn obstacles
        g.obstacleTimer -= dt
        if (g.obstacleTimer <= 0) {
          const types: Obstacle['type'][] = ['bowl', 'scratcher', 'herb']
          const type: Obstacle['type'] = types[Math.floor(Math.random() * types.length)] ?? 'bowl'
          const width = type === 'bowl' ? 32 : type === 'scratcher' ? 28 : 24
          const height = type === 'bowl' ? 18 : type === 'scratcher' ? 24 : 26
          g.obstacles.push({
            x: baseW + 20,
            y: groundY - height,
            width,
            height,
            type,
          })
          // Randomize next obstacle gap (1.6s to 3.0s)
          g.obstacleTimer = 1.6 + Math.random() * 1.4
        }

        // Spawn treats
        g.treatTimer -= dt
        if (g.treatTimer <= 0) {
          // Floating treat at jump height
          g.treatsList.push({
            x: baseW + 20,
            y: groundY - 50 - Math.random() * 35,
            radius: 10,
            collected: false,
          })
          g.treatTimer = 1.8 + Math.random() * 2.2
        }

        // Move obstacles & test collisions
        const catBox = {
          x: g.catX - 16,
          y: g.catY - 32,
          w: 32,
          h: 32,
        }

        for (let i = g.obstacles.length - 1; i >= 0; i--) {
          const obs = g.obstacles[i]
          if (!obs) continue
          obs.x -= g.speed * dt

          // Forgiving collision box (inner 70%)
          const obsBox = {
            x: obs.x + obs.width * 0.15,
            y: obs.y + obs.height * 0.15,
            w: obs.width * 0.7,
            h: obs.height * 0.85,
          }

          if (
            catBox.x < obsBox.x + obsBox.w &&
            catBox.x + catBox.w > obsBox.x &&
            catBox.y < obsBox.y + obsBox.h &&
            catBox.y + catBox.h > obsBox.y
          ) {
            // Collision! Game over
            g.state = 'gameover'
            audio.playGameOver()
            setGameState('gameover')

            // Update high score
            setHighScore((prev) => {
              if (g.score > prev) {
                setIsNewRecord(true)
                try {
                  localStorage.setItem('neko_404_highscore', String(g.score))
                } catch {
                  // Ignore storage error
                }
                return g.score
              }
              return prev
            })
            break
          }

          if (obs.x + obs.width < -30) {
            g.obstacles.splice(i, 1)
          }
        }

        // Move treats & test catch
        for (let i = g.treatsList.length - 1; i >= 0; i--) {
          const treat = g.treatsList[i]
          if (!treat) continue
          treat.x -= g.speed * dt

          // Distance from cat center to treat
          const dx = g.catX - treat.x
          const dy = g.catY - 18 - treat.y
          const dist = Math.hypot(dx, dy)

          if (!treat.collected && dist < 32) {
            treat.collected = true
            g.treats += 1
            g.score += 25
            setTreatsCount(g.treats)
            setScore(g.score)
            audio.playTreat()

            // Sparkle particles
            for (let p = 0; p < 6; p++) {
              const angle = (Math.PI * 2 * p) / 6 + Math.random() * 0.4
              const spd = 50 + Math.random() * 60
              g.particles.push({
                x: treat.x,
                y: treat.y,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd,
                life: 0.6,
                color: '#9B6E3A',
              })
            }

            // Floating text
            g.floatingTexts.push({
              x: treat.x,
              y: treat.y - 10,
              text: '+25 Purr! ✨',
              opacity: 1.0,
            })
          }

          if (treat.x < -30 || treat.collected) {
            g.treatsList.splice(i, 1)
          }
        }

        // Update particles
        for (let i = g.particles.length - 1; i >= 0; i--) {
          const p = g.particles[i]
          if (!p) continue
          p.x += p.vx * dt
          p.y += p.vy * dt
          p.vy += 150 * dt
          p.life -= dt
          if (p.life <= 0) {
            g.particles.splice(i, 1)
          }
        }

        // Update floating texts
        for (let i = g.floatingTexts.length - 1; i >= 0; i--) {
          const ft = g.floatingTexts[i]
          if (!ft) continue
          ft.y -= 30 * dt
          ft.opacity -= dt * 1.4
          if (ft.opacity <= 0) {
            g.floatingTexts.splice(i, 1)
          }
        }
      }

      // ==========================================
      // DRAW CANVAS
      // ==========================================
      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, baseW, baseH)

      // Background warm gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, baseH)
      bgGrad.addColorStop(0, '#FBF6EE')
      bgGrad.addColorStop(1, '#F4F6F2')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, baseW, baseH)

      // Distant rolling sage hills
      ctx.fillStyle = '#E7ECE3'
      ctx.beginPath()
      ctx.moveTo(0, groundY)
      ctx.bezierCurveTo(120, groundY - 45, 240, groundY - 15, 360, groundY - 40)
      ctx.bezierCurveTo(460, groundY - 60, 560, groundY - 25, baseW, groundY - 35)
      ctx.lineTo(baseW, groundY)
      ctx.closePath()
      ctx.fill()

      // Ground path
      ctx.fillStyle = '#F1E9D6'
      ctx.fillRect(0, groundY, baseW, baseH - groundY)

      // Ground stroke line
      ctx.strokeStyle = '#778A6F'
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(0, groundY)
      ctx.lineTo(baseW, groundY)
      ctx.stroke()

      // Cobblestone / path markers scrolling
      ctx.strokeStyle = '#D2DDCB'
      ctx.lineWidth = 1.5
      for (let x = -g.groundOffset; x < baseW; x += 36) {
        ctx.beginPath()
        ctx.moveTo(x, groundY + 10)
        ctx.lineTo(x + 14, groundY + 10)
        ctx.stroke()
      }

      // Draw Obstacles
      for (const obs of g.obstacles) {
        ctx.save()
        ctx.translate(obs.x, obs.y)

        if (obs.type === 'bowl') {
          // Ceramic Whisker Bowl
          ctx.fillStyle = '#F4F6F2'
          ctx.strokeStyle = '#617359'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.ellipse(obs.width / 2, obs.height / 2 + 2, obs.width / 2 - 2, 7, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()

          // Inner rim
          ctx.fillStyle = '#E7ECE3'
          ctx.beginPath()
          ctx.ellipse(obs.width / 2, obs.height / 2 + 1, obs.width / 2 - 6, 4, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
        } else if (obs.type === 'scratcher') {
          // Birch scratcher block
          ctx.fillStyle = '#E5D8BC'
          ctx.strokeStyle = '#8B6A45'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.roundRect(2, 2, obs.width - 4, obs.height - 2, [4, 4, 0, 0])
          ctx.fill()
          ctx.stroke()

          // Wood grain details
          ctx.strokeStyle = '#8B6A45'
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.moveTo(6, 9)
          ctx.lineTo(14, 9)
          ctx.moveTo(10, 16)
          ctx.lineTo(20, 16)
          ctx.stroke()
        } else {
          // Botanical herb sprout
          ctx.fillStyle = '#D2DDCB'
          ctx.strokeStyle = '#4B5A44'
          ctx.lineWidth = 2
          ctx.beginPath()
          // Stem
          ctx.moveTo(obs.width / 2, obs.height)
          ctx.lineTo(obs.width / 2, 8)
          // Leaf 1
          ctx.bezierCurveTo(obs.width / 2 - 10, 6, obs.width / 2 - 8, 0, obs.width / 2, 8)
          // Leaf 2
          ctx.bezierCurveTo(obs.width / 2 + 10, 6, obs.width / 2 + 8, 0, obs.width / 2, 8)
          ctx.fill()
          ctx.stroke()
        }
        ctx.restore()
      }

      // Draw Treats
      for (const treat of g.treatsList) {
        ctx.save()
        ctx.translate(treat.x, treat.y + Math.sin(now * 0.005) * 3)

        // Golden crunchy biscuit / heart
        ctx.fillStyle = '#9B6E3A'
        ctx.strokeStyle = '#74311D'
        ctx.lineWidth = 1.8
        ctx.beginPath()
        // Diamond / crunch shape
        ctx.moveTo(0, -treat.radius)
        ctx.lineTo(treat.radius, 0)
        ctx.lineTo(0, treat.radius)
        ctx.lineTo(-treat.radius, 0)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        // Biscuit inner dot
        ctx.fillStyle = '#FBF6EE'
        ctx.beginPath()
        ctx.arc(0, 0, 2.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // Draw Particles
      for (const p of g.particles) {
        ctx.save()
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, p.life / 0.6)
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // Draw Floating Texts
      for (const ft of g.floatingTexts) {
        ctx.save()
        ctx.font = '600 13px "DM Sans", sans-serif'
        ctx.fillStyle = `rgba(169, 79, 51, ${ft.opacity})` // terracotta-600
        ctx.fillText(ft.text, ft.x - 20, ft.y)
        ctx.restore()
      }

      // Draw Neko (The Cat Hero)
      if (g.state === 'playing') {
        ctx.save()
        const catX = g.catX
        const catY = g.catY

        // Slight forward tilt when jumping
        const tilt = g.isGrounded ? 0 : -0.15
        ctx.translate(catX, catY)
        ctx.rotate(tilt)

        ctx.strokeStyle = '#2B211A' // espresso-900
        ctx.fillStyle = '#FBF6EE' // warm cream
        ctx.lineWidth = 2.2
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        // Tail (animated wave)
        const tailWave = Math.sin(g.runCycle * 1.5) * 6
        ctx.beginPath()
        ctx.moveTo(-16, -16)
        ctx.bezierCurveTo(-26, -20 + tailWave, -28, -32 + tailWave, -18, -34 + tailWave)
        ctx.stroke()

        // Cat Body
        ctx.beginPath()
        ctx.ellipse(0, -16, 18, 12, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()

        // Cat Head
        ctx.beginPath()
        ctx.arc(16, -22, 9, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()

        // Cat Ears
        ctx.beginPath()
        // Left Ear
        ctx.moveTo(12, -29)
        ctx.lineTo(15, -37)
        ctx.lineTo(19, -29)
        // Right Ear
        ctx.moveTo(18, -29)
        ctx.lineTo(22, -37)
        ctx.lineTo(24, -28)
        ctx.fillStyle = '#D99A85' // terracotta-300 ear tint
        ctx.fill()
        ctx.stroke()

        // Alert Eye
        ctx.fillStyle = '#2B211A'
        ctx.beginPath()
        ctx.arc(19, -22, 1.3, 0, Math.PI * 2)
        ctx.fill()

        // Whiskers
        ctx.strokeStyle = '#2B211A'
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(23, -20)
        ctx.lineTo(29, -22)
        ctx.moveTo(23, -18)
        ctx.lineTo(29, -17)
        ctx.stroke()

        // Cat Legs & Paws
        ctx.lineWidth = 2.2
        if (g.isGrounded) {
          const legPhase = g.runCycle
          const fLeg1 = Math.sin(legPhase) * 7
          const fLeg2 = Math.sin(legPhase + Math.PI) * 7
          const bLeg1 = Math.sin(legPhase + Math.PI) * 7
          const bLeg2 = Math.sin(legPhase) * 7

          // Back legs
          ctx.beginPath()
          ctx.moveTo(-12, -8)
          ctx.lineTo(-12 + bLeg1, 0)
          ctx.moveTo(-6, -8)
          ctx.lineTo(-6 + bLeg2, 0)

          // Front legs
          ctx.moveTo(8, -8)
          ctx.lineTo(8 + fLeg1, 0)
          ctx.moveTo(14, -8)
          ctx.lineTo(14 + fLeg2, 0)
          ctx.stroke()
        } else {
          // Mid-air leap pose (stretched playfully)
          ctx.beginPath()
          // Back legs stretched behind
          ctx.moveTo(-12, -8)
          ctx.lineTo(-22, -3)
          // Front legs reaching forward
          ctx.moveTo(12, -8)
          ctx.lineTo(24, -3)
          ctx.stroke()
        }

        ctx.restore()
      }

      ctx.restore()
      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <section
      aria-label="Neko Garden Leap Mini Game"
      className="w-full max-w-xl mx-auto my-6 bg-cream-50 border border-sage-200/90 rounded-2xl p-4 sm:p-5 shadow-xs transition-all text-left"
    >
      {/* Game Header Bar */}
      <div className="flex items-center justify-between gap-2 border-b border-sage-200/70 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-sage-100 text-sage-800 text-xs font-serif font-bold">
            🐾
          </span>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-espresso-900">
              Neko's Trail Leap
            </h2>
            <p className="text-[11px] text-espresso-600 hidden sm:block">
              Collect treats & leap over bowls
            </p>
          </div>
        </div>

        {/* Live Counters & Audio Toggle */}
        <div className="flex items-center gap-3 text-xs text-espresso-800">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              Treats:{' '}
              <strong className="text-terracotta-700 font-semibold">{treatsCount}</strong>
            </span>
            <span className="text-espresso-300">|</span>
            <span className="font-medium">
              Score: <strong className="font-semibold">{score}</strong>
            </span>
            {highScore > 0 && (
              <>
                <span className="text-espresso-300 hidden xs:inline">|</span>
                <span className="text-espresso-600 hidden xs:inline">
                  Best: <strong className="font-semibold text-espresso-900">{highScore}</strong>
                </span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setSoundOn((s) => !s)}
            className="p-1.5 rounded-md hover:bg-sage-100/70 text-espresso-700 active:scale-95 transition-all"
            aria-label={soundOn ? 'Mute game sound effects' : 'Unmute game sound effects'}
            title={soundOn ? 'Sound On' : 'Sound Muted'}
          >
            {soundOn ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Game Stage Area */}
      <div className="relative w-full aspect-[640/240] rounded-xl overflow-hidden border border-sage-200/80 bg-cream-50 select-none">
        <canvas
          ref={canvasRef}
          onClick={jump}
          onTouchStart={(e) => {
            e.preventDefault()
            jump()
          }}
          className="w-full h-full block cursor-pointer"
          aria-label="Game canvas showing Neko running along the garden trail"
        />

        {/* Start / Idle Overlay */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-cream-50/90 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center">
            <div className="text-terracotta-700 mb-2">
              <CatSitting width={56} height={56} aria-hidden="true" />
            </div>
            <p className="font-serif text-lg sm:text-xl font-semibold text-espresso-950 mb-1">
              Guide Neko Along the Garden Trail
            </p>
            <p className="text-xs text-espresso-700 max-w-xs mb-3">
              Leap over ceramic bowls & birch scratchers to collect botanical treats.
            </p>
            <button
              type="button"
              onClick={startGame}
              className="px-5 py-2 rounded-pill bg-terracotta-600 text-cream-50 font-medium text-xs sm:text-sm hover:bg-terracotta-700 active:scale-95 transition-all shadow-xs inline-flex items-center gap-1.5"
            >
              Start Journey 🐾
            </button>
            <span className="text-[10px] text-espresso-500 mt-2">
              Press <kbd className="px-1.5 py-0.5 rounded bg-sage-100 text-espresso-800">Space</kbd>{' '}
              or tap anywhere to leap
            </span>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-cream-50/95 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center animate-fade-in">
            <div className="text-terracotta-700 mb-1">
              <CatSleeping width={56} height={56} aria-hidden="true" />
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-semibold text-espresso-950 mb-1">
              Catnap Time!
            </h3>
            <p className="text-xs text-espresso-700 max-w-xs mb-2">
              Neko curled up for a cozy rest after an adventurous stroll.
            </p>

            <div className="flex items-center gap-3 bg-sage-100/70 px-3 py-1.5 rounded-lg mb-3 text-xs">
              <span>
                Treats: <strong className="text-terracotta-700">{treatsCount}</strong>
              </span>
              <span className="text-espresso-300">|</span>
              <span>
                Score: <strong>{score}</strong>
              </span>
              {isNewRecord && (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-terracotta-700 bg-terracotta-100 px-1.5 py-0.5 rounded-full">
                  New Best!
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={startGame}
                className="px-4 py-2 rounded-pill bg-terracotta-600 text-cream-50 font-medium text-xs sm:text-sm hover:bg-terracotta-700 active:scale-95 transition-all shadow-xs"
              >
                Play Again 🐾
              </button>
              <Button
                asChild
                to="/shop"
                variant="secondary"
                className="px-4 py-2 min-h-[38px] text-xs"
              >
                Shop treats
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Controls / Guidance Bar */}
      <div className="flex items-center justify-between mt-3 text-xs text-espresso-600">
        <div className="flex items-center gap-1.5">
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-sage-100 text-espresso-800 border border-sage-200">
            Space
          </kbd>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-sage-100 text-espresso-800 border border-sage-200">
            ↑
          </kbd>
          <span className="text-[11px]">Tap or press Space to leap</span>
        </div>

        {/* Mobile Tactile Leap Button */}
        <button
          type="button"
          onClick={jump}
          className="px-4 py-1.5 rounded-pill bg-terracotta-600 text-cream-50 font-medium text-xs hover:bg-terracotta-700 active:scale-95 transition-all shadow-xs flex items-center gap-1 sm:hidden min-h-[36px]"
          aria-label="Leap over obstacles"
        >
          <span>🐾</span>
          <span>Leap!</span>
        </button>
      </div>
    </section>
  )
}

export default CatGame
