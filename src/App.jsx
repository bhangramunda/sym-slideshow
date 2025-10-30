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
  const [settings, setSettings] = useState({
    transitionMode: 'sync', // 'sync' = crossfade, 'wait' = gap
    buildScope: 'components', // 'off', 'components', 'elements', 'sections'
    buildStyle: 'classic' // 'off', 'classic', 'cascadingFade', 'scalingCascade', 'slideIn', 'blurFocus', 'typewriter'
  })

  // Load slides from Supabase
  useEffect(() => {
    async function loadSlides() {
      try {
        console.log('[Slideshow] Loading from Supabase...')
        const { data, error } = await supabase
          .from('slideshow_data')
          .select('slides, settings')
          .eq('project_name', PROJECT_NAME)
          .single()

        if (error) {
          console.error('[Slideshow] Supabase load failed:', error)
          // Try again without settings column (backwards compatibility)
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('slideshow_data')
            .select('slides')
            .eq('project_name', PROJECT_NAME)
            .single()

          if (!fallbackError && fallbackData && fallbackData.slides) {
            console.log('[Slideshow] Loaded', fallbackData.slides.length, 'slides from Supabase (without settings)')
            setRawScenes(fallbackData.slides)
            setIsLoading(false)
            return
          }

          console.log('[Slideshow] Using fallback scenes.json')
          // Use fallback scenesData
        } else if (data && data.slides) {
          console.log('[Slideshow] Loaded', data.slides.length, 'slides from Supabase')
          console.log('[Slideshow] First slide:', data.slides[0]?.type, data.slides[0]?.title?.substring(0, 50))
          setRawScenes(data.slides)

          // Load settings from database
          if (data.settings) {
            console.log('[Slideshow] Settings from database:', data.settings)
            setSettings(prevSettings => ({
              ...prevSettings,
              ...data.settings
            }))
          } else {
            console.log('[Slideshow] No settings in database, using defaults')
          }
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
          if (payload.new && payload.new.settings) {
            console.log('[Slideshow] Real-time update: Settings changed to:', payload.new.settings)
            setSettings(prevSettings => ({
              ...prevSettings,
              ...payload.new.settings
            }))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Build an expanded scene list with featured slides duplicated and sprinkled in
  const scenes = useMemo(() => {
    const featuredScenes = rawScenes.filter(s => s.featured)

    console.log('[Slideshow] Total slides:', rawScenes.length, 'Featured slides:', featuredScenes.length)
    console.log('[Slideshow] Featured slide titles:', featuredScenes.map(s => s.title?.substring(0, 30)))

    // If no featured slides, return original order with unique IDs
    if (featuredScenes.length === 0) {
      console.log('[Slideshow] No featured slides, using original order')
      return rawScenes.map((scene, i) => ({ ...scene, _slideId: `slide-${i}` }))
    }

    // Start with all slides in original order, add unique IDs
    const result = rawScenes.map((scene, i) => ({ ...scene, _slideId: `slide-${i}` }))

    // Calculate how many times to repeat each featured slide
    const totalSlides = rawScenes.length
    const totalFeatured = featuredScenes.length

    // How many copies of each featured slide to insert (in addition to original)
    const copiesPerFeatured = Math.min(3, Math.floor(totalSlides / totalFeatured))

    // Calculate spacing between featured slide insertions
    const totalInsertions = copiesPerFeatured * totalFeatured
    const interval = Math.max(1, Math.floor((totalSlides + totalInsertions) / (totalInsertions + 1)))

    console.log('[Slideshow] Will insert', copiesPerFeatured, 'copies of each featured slide, spacing them every', interval, 'slides')

    // Insert featured slide copies at calculated intervals
    let insertOffset = 0
    for (let copyNum = 0; copyNum < copiesPerFeatured; copyNum++) {
      featuredScenes.forEach((featuredSlide, featIndex) => {
        const insertPos = interval * (copyNum * totalFeatured + featIndex + 1) + insertOffset
        if (insertPos <= result.length) {
          result.splice(insertPos, 0, {
            ...featuredSlide,
            _slideId: `featured-${featIndex}-copy-${copyNum}`
          })
          insertOffset++
        }
      })
    }

    console.log('[Slideshow] Final deck:', result.length, 'slides (', rawScenes.length, 'original +', result.length - rawScenes.length, 'featured duplicates)')
    console.log('[Slideshow] First 5 slides:', result.slice(0, 5).map(s => s.title?.substring(0, 30)))
    console.log('[Slideshow] Full slide order:', result.map(s => s.title?.substring(0, 20)))
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
      {/* Debug: Show current transition mode */}
      <div className="absolute bottom-4 left-4 z-50 text-white/20 text-xs">
        Mode: {settings.transitionMode}
      </div>
      <AnimatePresence mode={settings.transitionMode}>
        {scenes.map((scene, i) => (
          i === index && (
            <Scene
              key={scene._slideId || i}
              scene={scene}
              isActive={true}
              buildScope={settings.buildScope}
              buildStyle={settings.buildStyle}
            />
          )
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
