import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Scene from './components/Scene.jsx'
import Editor from './components/Editor.jsx'
import MobileWarning from './components/MobileWarning.jsx'
import scenesData from './scenes.json'
import { supabase } from './lib/supabase'

const FPS_SAFE_DELAY = 50 // ms safety delay between scenes
const PROJECT_NAME = 'default'
const SHOW_MOBILE_WARNING = true // Set to false to disable mobile warning

// Aspect ratio configurations
const ASPECT_RATIOS = {
  '16:9': { width: 1920, height: 1080, label: '16:9 (Standard HD)' },
  '21:9': { width: 2560, height: 1080, label: '21:9 (Ultrawide)' },
  '4:3': { width: 1440, height: 1080, label: '4:3 (Classic)' }
}

function Slideshow() {
  const [rawScenes, setRawScenes] = useState(scenesData)
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState({
    transitionMode: 'sync', // 'sync' = crossfade, 'wait' = gap
    buildScope: 'components', // 'off', 'components', 'elements', 'sections'
    buildStyle: 'classic', // 'off', 'classic', 'cascadingFade', 'scalingCascade', 'slideIn', 'blurFocus', 'typewriter'
    aspectRatio: '16:9', // '16:9', '21:9', '4:3', 'custom'
    featuredRepeats: 2 // How many additional copies of each featured slide (0-5)
  })

  // Mobile detection
  const [showMobileWarning, setShowMobileWarning] = useState(false)

  useEffect(() => {
    if (!SHOW_MOBILE_WARNING) return

    // Detect mobile devices
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      || window.innerWidth < 768 // Also catch small viewports

    setShowMobileWarning(isMobile)
  }, [])

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

  // Build an expanded scene list with featured slides duplicated and evenly distributed
  const scenes = useMemo(() => {
    const featuredScenes = rawScenes.filter(s => s.featured)
    const nonFeaturedScenes = rawScenes.filter(s => !s.featured)

    console.log('[Slideshow] Total slides:', rawScenes.length, 'Featured:', featuredScenes.length, 'Non-featured:', nonFeaturedScenes.length)
    console.log('[Slideshow] Featured slide titles:', featuredScenes.map(s => s.title?.substring(0, 30)))

    // If no featured slides, return original order with unique IDs
    if (featuredScenes.length === 0) {
      console.log('[Slideshow] No featured slides, using original order')
      return rawScenes.map((scene, i) => ({ ...scene, _slideId: `slide-${i}` }))
    }

    // Calculate how many copies of each featured slide to create
    // Use the featuredRepeats setting (defaults to 2)
    const totalSlides = rawScenes.length
    const totalFeatured = featuredScenes.length
    const copiesPerFeatured = settings.featuredRepeats ?? 2

    // Build pool of all featured slide instances (originals + copies)
    // INTERLEAVE copies across different featured slides to avoid repetition
    const allFeaturedInstances = []

    // First add all originals
    featuredScenes.forEach((featuredSlide, featIndex) => {
      allFeaturedInstances.push({
        ...featuredSlide,
        _slideId: `featured-${featIndex}-original`
      })
    })

    // Then add copies, round-robin style to interleave
    for (let copyNum = 0; copyNum < copiesPerFeatured; copyNum++) {
      featuredScenes.forEach((featuredSlide, featIndex) => {
        allFeaturedInstances.push({
          ...featuredSlide,
          _slideId: `featured-${featIndex}-copy-${copyNum}`
        })
      })
    }

    // Add unique IDs to non-featured slides
    const nonFeaturedWithIds = nonFeaturedScenes.map((scene, i) => ({
      ...scene,
      _slideId: `slide-${i}`
    }))

    // Calculate even distribution: place featured slides evenly among non-featured
    const totalFeaturedInstances = allFeaturedInstances.length
    const totalNonFeatured = nonFeaturedWithIds.length

    // If we have more featured than non-featured, just alternate
    if (totalFeaturedInstances >= totalNonFeatured) {
      const result = []
      const maxLength = Math.max(totalFeaturedInstances, totalNonFeatured)
      for (let i = 0; i < maxLength; i++) {
        if (i < nonFeaturedWithIds.length) result.push(nonFeaturedWithIds[i])
        if (i < allFeaturedInstances.length) result.push(allFeaturedInstances[i])
      }
      console.log('[Slideshow] Final deck (alternating):', result.length, 'slides')
      console.log('[Slideshow] Full slide order:', result.map(s => s.title?.substring(0, 20)))
      return result
    }

    // Calculate spacing: how many non-featured slides between each featured
    const spacing = Math.floor(totalNonFeatured / (totalFeaturedInstances + 1))

    // Build result by evenly distributing featured slides
    const result = []
    let nonFeaturedIndex = 0
    let featuredIndex = 0

    while (nonFeaturedIndex < totalNonFeatured || featuredIndex < totalFeaturedInstances) {
      // Add a batch of non-featured slides
      const batchSize = featuredIndex === 0 ? spacing : spacing
      for (let i = 0; i < batchSize && nonFeaturedIndex < totalNonFeatured; i++) {
        result.push(nonFeaturedWithIds[nonFeaturedIndex])
        nonFeaturedIndex++
      }

      // Add one featured slide
      if (featuredIndex < totalFeaturedInstances) {
        result.push(allFeaturedInstances[featuredIndex])
        featuredIndex++
      }
    }

    // Add any remaining non-featured slides at the end
    while (nonFeaturedIndex < totalNonFeatured) {
      result.push(nonFeaturedWithIds[nonFeaturedIndex])
      nonFeaturedIndex++
    }

    console.log('[Slideshow] Final deck:', result.length, 'slides (', nonFeaturedScenes.length, 'non-featured +', totalFeaturedInstances, 'featured instances)')
    console.log('[Slideshow] Spacing:', spacing, 'non-featured slides between featured')
    console.log('[Slideshow] First 10 slides:', result.slice(0, 10).map(s => s.title?.substring(0, 20)))
    console.log('[Slideshow] Full slide order:', result.map(s => s.title?.substring(0, 20)))
    return result
  }, [rawScenes, settings.featuredRepeats])

  const [index, setIndex] = useState(0)
  const [jumpToInput, setJumpToInput] = useState('')
  const [showControls, setShowControls] = useState(true)

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

  // Keyboard navigation: type number and press Enter to jump to slide
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if it's a number key (0-9)
      if (e.key >= '0' && e.key <= '9') {
        setJumpToInput(prev => prev + e.key)
      }
      // Press Enter to jump to the slide
      else if (e.key === 'Enter' && jumpToInput) {
        const targetSlide = parseInt(jumpToInput, 10) - 1 // Convert to 0-indexed
        if (targetSlide >= 0 && targetSlide < scenes.length) {
          setIndex(targetSlide)
        }
        setJumpToInput('') // Clear input
      }
      // Press Escape to clear input
      else if (e.key === 'Escape') {
        setJumpToInput('')
      }
      // Arrow keys for next/previous
      else if (e.key === 'ArrowRight' || e.key === ' ') {
        setIndex(prev => (prev + 1) % scenes.length)
      }
      else if (e.key === 'ArrowLeft') {
        setIndex(prev => (prev - 1 + scenes.length) % scenes.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [jumpToInput, scenes.length])

  // Auto-hide controls after 500ms of inactivity
  useEffect(() => {
    let hideTimeout

    const showControlsTemporarily = () => {
      setShowControls(true)
      clearTimeout(hideTimeout)
      hideTimeout = setTimeout(() => {
        setShowControls(false)
      }, 500)
    }

    // Show controls on any mouse or keyboard activity
    window.addEventListener('mousemove', showControlsTemporarily)
    window.addEventListener('keydown', showControlsTemporarily)

    // Initial timeout
    hideTimeout = setTimeout(() => {
      setShowControls(false)
    }, 500)

    return () => {
      clearTimeout(hideTimeout)
      window.removeEventListener('mousemove', showControlsTemporarily)
      window.removeEventListener('keydown', showControlsTemporarily)
    }
  }, [])

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
    <>
      {/* Mobile Warning Overlay */}
      {showMobileWarning && (
        <MobileWarning onDismiss={() => setShowMobileWarning(false)} />
      )}

      <div
        className="w-screen h-screen relative overflow-hidden transition-[cursor] duration-300"
        style={{ cursor: showControls ? 'default' : 'none' }}
      >
        {/* Secret Editor Access - Press 'e' key */}
      <div
        className="absolute top-4 right-4 z-50 transition-opacity duration-300"
        style={{ opacity: showControls ? 1 : 0 }}
      >
        <a
          href="/editor"
          className="text-white/30 hover:text-white/80 text-xs"
        >
          Edit
        </a>
      </div>
      {/* Debug: Show current transition mode */}
      <div
        className="absolute bottom-4 left-4 z-50 text-white/20 text-xs transition-opacity duration-300"
        style={{ opacity: showControls ? 1 : 0 }}
      >
        Mode: {settings.transitionMode}
      </div>

      {/* Slide counter and jump-to indicator */}
      <div
        className="absolute bottom-4 right-4 z-50 text-white/40 text-sm transition-opacity duration-300"
        style={{ opacity: showControls || jumpToInput ? 1 : 0 }}
      >
        Slide {index + 1} / {scenes.length}
        {jumpToInput && (
          <div className="mt-2 bg-black/80 backdrop-blur border border-white/30 rounded px-4 py-2 text-white text-lg">
            Jump to: {jumpToInput}_
            <div className="text-xs text-white/60 mt-1">Press Enter to go, Esc to cancel</div>
          </div>
        )}
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
              aspectRatio={ASPECT_RATIOS[settings.aspectRatio]}
              onVideoEnd={() => {
                console.log('[App] Video ended, advancing to next slide');
                setIndex(prev => (prev + 1) % scenes.length);
              }}
            />
          )
        ))}
      </AnimatePresence>
    </div>
    </>
  )
}

export default function App() {
  // Simple client-side routing
  const isEditor = window.location.pathname === '/editor'

  return isEditor ? <Editor /> : <Slideshow />
}
