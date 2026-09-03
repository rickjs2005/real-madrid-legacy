import gsap from 'gsap'

// Cursor de precisão: ponto + anel. Estados via [data-cursor="view|drag|enter"]
// nos elementos, e [data-cursor-hide] em cenas cinematográficas.
export type CursorState = 'explore' | 'view' | 'drag' | 'enter' | 'hidden'

export function mountCursor() {
  const dot = document.createElement('div')
  const ring = document.createElement('div')
  const label = document.createElement('span')
  dot.className = 'pointer-events-none fixed left-0 top-0 z-[100] h-[6px] w-[6px] rounded-full bg-silver mix-blend-difference'
  ring.className =
    'pointer-events-none fixed left-0 top-0 z-[100] flex h-9 w-9 items-center justify-center rounded-full border border-silver/60 mix-blend-difference'
  label.className = 't-label text-[9px] tracking-[0.3em] text-pure opacity-0'
  ring.appendChild(label)
  document.body.append(dot, ring)

  const qx = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'none' })
  const qy = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'none' })
  const rx = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' })
  const ry = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' })
  gsap.set([dot, ring], { xPercent: -50, yPercent: -50 })

  let state: CursorState = 'explore'
  const apply = (next: CursorState) => {
    if (next === state) return
    state = next
    const hidden = next === 'hidden'
    gsap.to([dot, ring], { opacity: hidden ? 0 : 1, duration: 0.3 })
    gsap.to(ring, {
      scale: next === 'view' ? 2.2 : next === 'enter' ? 2.6 : next === 'drag' ? 1.8 : 1,
      duration: 0.4,
      ease: 'power3.out',
    })
    label.textContent = next === 'view' ? 'VIEW' : next === 'drag' ? 'DRAG' : next === 'enter' ? 'ENTER' : ''
    gsap.to(label, { opacity: next === 'explore' || hidden ? 0 : 1, duration: 0.25 })
    gsap.to(dot, { scale: next === 'explore' ? 1 : 0, duration: 0.25 })
  }

  let pointerX = -1
  let pointerY = -1
  let scrollRaf = 0

  const updateStateAt = (x: number, y: number) => {
    const el = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-cursor],[data-cursor-hide]')
    if (!el) return apply('explore')
    if (el.hasAttribute('data-cursor-hide')) return apply('hidden')
    apply((el.dataset.cursor as CursorState) ?? 'explore')
  }

  const onMouseMove = (e: MouseEvent) => {
    pointerX = e.clientX
    pointerY = e.clientY
    qx(pointerX)
    qy(pointerY)
    rx(pointerX)
    ry(pointerY)
    updateStateAt(pointerX, pointerY)
  }
  const onScroll = () => {
    if (pointerX < 0 || scrollRaf) return
    scrollRaf = requestAnimationFrame(() => {
      scrollRaf = 0
      updateStateAt(pointerX, pointerY)
    })
  }
  const onMouseLeave = () => apply('hidden')
  const onMouseEnter = () => apply('explore')
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('mouseleave', onMouseLeave)
  document.addEventListener('mouseenter', onMouseEnter)

  return () => {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('scroll', onScroll)
    document.removeEventListener('mouseleave', onMouseLeave)
    document.removeEventListener('mouseenter', onMouseEnter)
    cancelAnimationFrame(scrollRaf)
    dot.remove()
    ring.remove()
  }
}
