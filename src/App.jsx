import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Scene from './components/Scene.jsx'
import Editor from './components/Editor.jsx'
import scenesData from './scenes.json'
import { supabase } from './lib/supabase'

const FPS_SAFE_DELAY = 50 // ms safety delay between scenes
const PROJECT_NAME = 'default'

function Slideshow() {
  const [rawScenes, setRawScenes] = useState(scenesData)
  const [isLoading, setIsLoading] = useState(true)

  // Load slides from Supabase
  useEffect(() => {
    async function loadSlides() {
      try {
        console.log('[Slideshow] Loading from Supabase...')
        const { data, error } = await supabase
          .from('slideshow_data')
          .select('slides')
          .eq('project_name', PROJECT_NAME)
          .single()

        if (error) {
          console.error('[Slideshow] Supabase load failed:', error)
          console.log('[Slideshow] Using fallback scenes.json')
          // Use fallback scenesData
        } else if (data && data.slides) {
          console.log('[Slideshow] Loaded', data.slides.length, 'slides from Supabase')
          console.log('[Slideshow] First slide:', data.slides[0]?.type, data.slides[0]?.title?.substring(0, 50))
          setRawScenes(data.slides)
        } else {
          console.warn('[Slideshow] No data in response, using fallback')
        }
      } catch (err) {
        console.error('[Slideshow] Supabase connection error:', err)
        console.log('[Slideshow] Using fallback scenes.json')
      } finally {
        setIsLoading(false)
      }
    }

    loadSlides()

    // Subscribe to real-time changes
    const channel = supabase
      .channel('slideshow-viewer')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'slideshow_data',
          filter: `project_name=eq.${PROJECT_NAME}`,
        },
        (payload) => {
          if (payload.new && payload.new.slides) {
            setRawScenes(payload.new.slides)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Build an expanded scene list with featured slides sprinkled in
  const scenes = useMemo(() => {
    const featuredScenes = rawScenes.filter(s => s.featured)
    const normalScenes = rawScenes.filter(s => !s.featured)

    // If no featured slides, return original
    if (featuredScenes.length === 0) return rawScenes

    // Sprinkle featured slides throughout
    const result = []
    const interval = Math.max(3, Math.floor(normalScenes.length / (featuredScenes.length + 1)))

    let featuredIndex = 0
    normalScenes.forEach((scene, i) => {
      result.push(scene)

      // Insert a featured slide every 'interval' slides
      if ((i + 1) % interval === 0 && featuredIndex < featuredScenes.length) {
        const featuredSlide = featuredScenes[featuredIndex % featuredScenes.length]
        // Only add if it's not the same as the last slide added
        if (result[result.length - 1] !== featuredSlide) {
          result.push(featuredSlide)
          featuredIndex++
        }
      }
    })

    return result
  }, [rawScenes])

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
  }, [scenes, index])

  // Prevent accidental interaction / keep fullscreen feel
  useEffect(() => {
    const handler = e => e.preventDefault()
    window.addEventListener('contextmenu', handler)
    return () => window.removeEventListener('contextmenu', handler)
  }, [])

  // Show loading while fetching from Supabase
  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black">
        <div className="animate-spin h-12 w-12 border-4 border-tgteal border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {/* Secret Editor Access - Press 'e' key */}
      <div className="absolute top-4 right-4 z-50">
        <a
          href="/editor"
          className="text-white/30 hover:text-white/80 text-xs"
        >
          Edit
        </a>
      </div>
      <AnimatePresence mode="wait">
        {scenes.map((scene, i) => (
          i === index && <Scene key={i} scene={scene} isActive={true} />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  // Simple client-side routing
  const isEditor = window.location.pathname === '/editor'

  return isEditor ? <Editor /> : <Slideshow />
}
