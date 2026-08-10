import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// HMR parcial em módulos com ScrollTrigger pinado deixa pin-spacers órfãos
// e corrompe o layout até um reload completo — força full reload nesses módulos.
function fullReloadForPinnedModules(): Plugin {
  return {
    name: 'full-reload-pinned-sections',
    handleHotUpdate({ file, server }) {
      if (file.includes('/src/sections/') || file.includes('/src/lib/')) {
        server.ws.send({ type: 'full-reload' })
        return []
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), fullReloadForPinnedModules()],
  // três importadores de 'three' (fiber, postprocessing e o app) — sem dedupe o
  // optimizer do Vite pode servir duas cópias em dev, o que quebra os
  // instanceof internos do R3F ("Multiple instances of Three.js" no console)
  resolve: { dedupe: ['three'] },
  optimizeDeps: { include: ['three', '@react-three/fiber', '@react-three/postprocessing', 'postprocessing'] },
})
