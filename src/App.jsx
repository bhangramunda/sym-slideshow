import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Scene from './components/Scene.jsx'
import scenesData from './scenes.json'

const FPS_SAFE_DELAY = 50 // ms safety delay between scenes

export default function App() {
  const scenes = useMemo(() => scenesData, [])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    let timeoutId
    function scheduleNext(i) {
      const durationMs = (scenes[i].durationSec ?? 20) * 1000
      timeoutId = setTimeout(() => {
        setIndex(prev => (prev + 1) % scenes.length)
        scheduleNext((i + 1) % scenes.length)
      }, durationMs + FPS_SAFE_DELAY)
    }
    scheduleNext(index)
    return () => clearTimeout(timeoutId)
  }, [scenes])

  // Prevent accidental interaction / keep fullscreen feel
  useEffect(() => {
    const handler = e => e.preventDefault()
    window.addEventListener('contextmenu', handler)
    return () => window.removeEventListener('contextmenu', handler)
  }, [])

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      <AnimatePresence mode="wait">
        {scenes.map((scene, i) => (
          i === index && <Scene key={i} scene={scene} isActive={true} />
        ))}
      </AnimatePresence>
    </div>
  )
}
