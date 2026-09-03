let cachedSupport: boolean | undefined

export function supportsWebGL() {
  if (cachedSupport !== undefined) return cachedSupport

  try {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    cachedSupport = Boolean(context)
    context?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    cachedSupport = false
  }

  return cachedSupport
}

