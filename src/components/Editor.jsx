import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Scene from './Scene';
import RichTextArea from './RichTextArea';
import scenesData from '../scenes.json';
import { useSupabaseSync } from '../hooks/useSupabaseSync';
import { TRANSITIONS, TRANSITION_OPTIONS } from './SlideTransition';
import { supabase } from '../lib/supabase';

// Aspect ratio configurations
const ASPECT_RATIOS = {
  '16:9': { width: 1920, height: 1080, label: '16:9 (Standard HD)' },
  '21:9': { width: 2560, height: 1080, label: '21:9 (Ultrawide)' },
  '4:3': { width: 1440, height: 1080, label: '4:3 (Classic)' }
};

export default function Editor() {
  const [scenes, setScenes] = useState(scenesData);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Slideshow settings
  const [settings, setSettings] = useState({
    transitionMode: 'sync', // 'sync' = crossfade, 'wait' = blank gap
    buildScope: 'components', // 'off', 'components', 'elements', 'sections'
    buildStyle: 'classic', // 'off', 'classic', 'cascadingFade', 'scalingCascade', 'slideIn', 'blurFocus', 'typewriter'
    aspectRatio: '16:9' // '16:9', '21:9', '4:3'
  });

  // Undo/Redo history
  const [history, setHistory] = useState([scenesData]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Removed localStorage conflict detection - using Supabase real-time sync

  // Image upload state
  const [uploadingImage, setUploadingImage] = useState(false);

  // Video upload state
  const [uploadingVideo, setUploadingVideo] = useState(false);

  // Supabase autosave
  const { saveStatus, lastSaved, forceSave, isLoading } = useSupabaseSync(
    scenes,
    settings,
    (newScenes) => {
      // When receiving remote updates from real-time listener, update local state
      setScenes(newScenes);
      // Add to history so user can undo if needed
      setHistory(prevHistory => {
        const newHistory = [...prevHistory, newScenes];
        if (newHistory.length > 50) {
          newHistory.shift();
        }
        return newHistory;
      });
      setHistoryIndex(prevIndex => Math.min(prevIndex + 1, 49));
    },
    (newSettings) => {
      setSettings(newSettings);
    }
  );

  // Resizable panels state
  const [leftPanelWidth, setLeftPanelWidth] = useState(() => {
    const saved = localStorage.getItem('editorLeftPanelWidth');
    return saved ? parseFloat(saved) : 50;
  });
  const [topPanelHeight, setTopPanelHeight] = useState(() => {
    const saved = localStorage.getItem('editorTopPanelHeight');
    return saved ? parseFloat(saved) : 60;
  });
  const [isDraggingVertical, setIsDraggingVertical] = useState(false);
  const [isDraggingHorizontal, setIsDraggingHorizontal] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);

  // Drag-and-drop state for slide reordering
  const [draggedSlideIndex, setDraggedSlideIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Update preview scale when window or panels resize
  useEffect(() => {
    const updatePreviewScale = () => {
      const previewContainer = document.querySelector('.preview-container');
      if (!previewContainer) return;

      const containerWidth = previewContainer.offsetWidth;
      const containerHeight = previewContainer.offsetHeight;

      // Add padding to prevent content from touching edges
      const padding = 20; // 20px padding on all sides
      const availableWidth = containerWidth - (padding * 2);
      const availableHeight = containerHeight - (padding * 2);

      // Get selected aspect ratio dimensions
      const aspectRatioConfig = ASPECT_RATIOS[settings.aspectRatio] || ASPECT_RATIOS['16:9'];
      const targetWidth = aspectRatioConfig.width;
      const targetHeight = aspectRatioConfig.height;

      // Calculate scale to fit content in container
      const scaleX = availableWidth / targetWidth;
      const scaleY = availableHeight / targetHeight;
      const scale = Math.min(scaleX, scaleY, 1); // Cap at 1 to avoid upscaling

      setPreviewScale(scale);
      document.documentElement.style.setProperty('--preview-scale', scale.toString());
    };

    // Initial scale calculation (with retry in case container not ready)
    updatePreviewScale();
    const retryTimeout = setTimeout(updatePreviewScale, 100);
    const retryTimeout2 = setTimeout(updatePreviewScale, 300);

    window.addEventListener('resize', updatePreviewScale);

    // Update scale when panels resize
    const observer = new ResizeObserver(updatePreviewScale);
    const previewContainer = document.querySelector('.preview-container');
    if (previewContainer) {
      observer.observe(previewContainer);
    }

    return () => {
      clearTimeout(retryTimeout);
      clearTimeout(retryTimeout2);
      window.removeEventListener('resize', updatePreviewScale);
      observer.disconnect();
    };
  }, [leftPanelWidth, topPanelHeight, settings.aspectRatio]);

  // Save to history when scenes change (using functional updates to prevent race conditions)
  // Can accept either new scenes array OR a function that receives prev scenes
  const saveToHistory = (newScenesOrUpdater) => {
    setScenes(prevScenes => {
      // Determine the new scenes value
      const newScenes = typeof newScenesOrUpdater === 'function'
        ? newScenesOrUpdater(prevScenes)
        : newScenesOrUpdater;

      // Update history with the new scenes
      setHistoryIndex(prevIndex => {
        setHistory(prevHistory => {
          const newHistory = prevHistory.slice(0, prevIndex + 1);
          newHistory.push(newScenes);

          // Limit history to 50 states
          if (newHistory.length > 50) {
            newHistory.shift();
          }
          return newHistory;
        });

        let newIndex = prevIndex + 1;

        // Adjust index if we removed first item
        if (prevIndex + 2 > 50) {
          newIndex = prevIndex; // Don't increment if we're at the limit
        }

        return newIndex;
      });

      return newScenes;
    });
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setScenes(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setScenes(history[historyIndex + 1]);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  // Auto-play preview
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      setPreviewIndex((prev) => (prev + 1) % scenes.length);
    }, scenes[previewIndex]?.durationSec * 1000 || 5000);

    return () => clearTimeout(timer);
  }, [previewIndex, isPlaying, scenes]);

  const updateScene = (index, updates) => {
    console.log('[Editor] Updating scene', index, 'with:', updates);

    // Use functional state update to avoid stale closure issues
    setScenes(prevScenes => {
      const newScenes = [...prevScenes];
      newScenes[index] = { ...newScenes[index], ...updates };
      console.log('[Editor] Updated scene:', newScenes[index]);

      // Save to history with the new scenes (must be done synchronously)
      setHistoryIndex(prevIndex => {
        setHistory(prevHistory => {
          const newHistory = prevHistory.slice(0, prevIndex + 1);
          newHistory.push(newScenes);

          // Limit history to 50 states
          if (newHistory.length > 50) {
            newHistory.shift();
          }
          return newHistory;
        });

        let newIndex = prevIndex + 1;

        // Adjust index if we removed first item
        if (prevIndex + 2 > 50) {
          newIndex = prevIndex; // Don't increment if we're at the limit
        }

        return newIndex;
      });

      return newScenes;
    });
  };

  // Resize image if larger than 3MB
  const resizeImageIfNeeded = async (file) => {
    const MAX_SIZE = 3 * 1024 * 1024; // 3MB

    if (file.size <= MAX_SIZE) {
      return file; // No resize needed
    }

    // GIFs (especially animated ones) cannot be resized using canvas without losing animation
    // Reject files that are too large instead of silently failing
    if (file.type === 'image/gif') {
      throw new Error(
        `GIF file is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). ` +
        `Maximum size is ${MAX_SIZE / 1024 / 1024}MB. ` +
        `Please use a smaller GIF or a different image format.`
      );
    }

    console.log(`[Editor] Image is ${(file.size / 1024 / 1024).toFixed(2)}MB, resizing...`);

    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        // Calculate new dimensions to achieve target file size
        // Start with 80% quality and adjust dimensions if needed
        let width = img.width;
        let height = img.height;
        const aspectRatio = width / height;

        // Estimate scaling factor based on file size ratio
        const sizeRatio = MAX_SIZE / file.size;
        const scaleFactor = Math.sqrt(sizeRatio) * 0.9; // Conservative estimate

        width = Math.floor(width * scaleFactor);
        height = Math.floor(height * scaleFactor);

        canvas.width = width;
        canvas.height = height;

        // Draw resized image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob with quality adjustment
        // Use JPEG for better compression (PNG for transparency)
        const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        canvas.toBlob(
          (blob) => {
            if (blob) {
              console.log(`[Editor] Resized from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(blob.size / 1024 / 1024).toFixed(2)}MB`);
              console.log(`[Editor] Dimensions: ${img.width}x${img.height} → ${width}x${height}`);

              // Create new File object with same name
              const resizedFile = new File([blob], file.name, {
                type: outputType,
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          outputType,
          0.85 // Quality for JPEG/PNG
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const moveScene = (index, direction) => {
    // Use updater function to avoid stale closure
    saveToHistory(prevScenes => {
      if (
        (direction === 'up' && index === 0) ||
        (direction === 'down' && index === prevScenes.length - 1)
      ) {
        return prevScenes; // No change
      }

      const newScenes = [...prevScenes];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      [newScenes[index], newScenes[targetIndex]] = [newScenes[targetIndex], newScenes[index]];
      setSelectedIndex(targetIndex);
      return newScenes;
    });
  };

  // Drag-and-drop handlers for slide reordering
  const handleDragStart = (e, index) => {
    // Prevent drag from form inputs, textareas, and buttons
    const target = e.target;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'BUTTON' ||
      target.tagName === 'SELECT' ||
      target.isContentEditable ||
      target.closest('input') ||
      target.closest('textarea') ||
      target.closest('button') ||
      target.closest('select')
    ) {
      e.preventDefault();
      return;
    }

    setDraggedSlideIndex(index);
    e.dataTransfer.effectAllowed = 'move';

    // Create a semi-transparent ghost image
    const dragImage = e.currentTarget.cloneNode(true);
    dragImage.style.opacity = '0.5';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (draggedSlideIndex !== null && draggedSlideIndex !== index) {
      // Determine if we should show indicator above or below this slide
      const rect = e.currentTarget.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      const isAbove = e.clientY < midpoint;

      // Set the drop index based on position
      const targetIndex = isAbove ? index : index + 1;
      setDragOverIndex(targetIndex);
    }
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();

    if (draggedSlideIndex === null) {
      setDragOverIndex(null);
      return;
    }

    const draggedIndex = draggedSlideIndex;
    let dropIndex = dragOverIndex !== null ? dragOverIndex : targetIndex;

    // Adjust drop index if dragging down
    if (draggedIndex < dropIndex) {
      dropIndex = dropIndex - 1;
    }

    if (draggedIndex === dropIndex) {
      setDraggedSlideIndex(null);
      setDragOverIndex(null);
      return;
    }

    saveToHistory(prevScenes => {
      const newScenes = [...prevScenes];
      const [draggedSlide] = newScenes.splice(draggedIndex, 1);
      newScenes.splice(dropIndex, 0, draggedSlide);
      return newScenes;
    });

    setSelectedIndex(dropIndex);
    setDraggedSlideIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedSlideIndex(null);
    setDragOverIndex(null);
  };

  const handleDragLeave = (e) => {
    // Only clear if we're leaving the slide list area
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverIndex(null);
    }
  };

  const duplicateScene = (index) => {
    saveToHistory(prevScenes => {
      const newScenes = [...prevScenes];
      newScenes.splice(index + 1, 0, { ...prevScenes[index] });
      return newScenes;
    });
  };

  const deleteScene = (index) => {
    saveToHistory(prevScenes => {
      if (prevScenes.length <= 1) {
        alert('Cannot delete the last slide!');
        return prevScenes; // No change
      }

      const newScenes = prevScenes.filter((_, i) => i !== index);

      // Update selected index if needed
      if (selectedIndex >= newScenes.length) {
        setSelectedIndex(newScenes.length - 1);
      }

      return newScenes;
    });
  };

  const addNewScene = () => {
    const newScene = {
      type: 'hero',
      title: 'New Slide Title',
      subtitle: 'Add your content here',
      cta: null,
      image: '/assets/placeholder-01.svg',
      durationSec: 20,
    };

    saveToHistory(prevScenes => {
      setSelectedIndex(prevScenes.length); // Select the new slide
      return [...prevScenes, newScene];
    });
  };

  const downloadJSON = () => {
    const dataStr = JSON.stringify(scenes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    link.download = `scenes-${timestamp}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const uploadJSON = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (Array.isArray(json) && json.length > 0) {
          saveToHistory(json);
          alert(`Successfully loaded ${json.length} slides!`);
        } else {
          alert('Invalid JSON format. Expected an array of slides.');
        }
      } catch (err) {
        alert('Failed to parse JSON file: ' + err.message);
      }
    };
    reader.onerror = () => {
      alert('Failed to read file');
    };
    reader.readAsText(file);
    // Clear the input so the same file can be selected again
    event.target.value = '';
  };

  // localStorage conflict detection removed - using Supabase real-time sync instead

  // Handle vertical resize (left/right panels)
  useEffect(() => {
    if (isDraggingVertical) {
      document.body.classList.add('resizing');
    } else {
      document.body.classList.remove('resizing');
    }

    if (!isDraggingVertical) return;

    const handleMouseMove = (e) => {
      const newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth >= 20 && newWidth <= 80) {
        setLeftPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingVertical(false);
      localStorage.setItem('editorLeftPanelWidth', leftPanelWidth.toString());
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingVertical, leftPanelWidth]);

  // Handle horizontal resize (top/bottom in right panel)
  useEffect(() => {
    if (isDraggingHorizontal) {
      document.body.classList.add('resizing-horizontal');
    } else {
      document.body.classList.remove('resizing-horizontal');
    }

    if (!isDraggingHorizontal) return;

    const handleMouseMove = (e) => {
      const rightPanel = document.querySelector('.right-panel');
      if (!rightPanel) return;

      const rect = rightPanel.getBoundingClientRect();
      const newHeight = ((e.clientY - rect.top) / rect.height) * 100;
      if (newHeight >= 30 && newHeight <= 80) {
        setTopPanelHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingHorizontal(false);
      localStorage.setItem('editorTopPanelHeight', topPanelHeight.toString());
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingHorizontal, topPanelHeight]);

  const selectedScene = scenes[selectedIndex];

  // Show loading state while fetching from Supabase
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-tgteal border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-xl text-gray-400">Loading slides...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Editor Panel - Left Side */}
      <div
        className="flex flex-col border-r border-gray-700"
        style={{ width: `${leftPanelWidth}%` }}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Slide Editor</h1>
              <div className="flex gap-1">
                <button
                  onClick={undo}
                  disabled={historyIndex === 0}
                  className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                  title="Undo (Ctrl+Z)"
                >
                  ↶ Undo
                </button>
                <button
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                  title="Redo (Ctrl+Y)"
                >
                  ↷ Redo
                </button>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              {/* Save Status - more prominent */}
              <div className="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 min-w-[140px]">
                {saveStatus === 'saving' && (
                  <div className="flex items-center gap-2 text-blue-400">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                    <span className="text-sm font-medium">Saving...</span>
                  </div>
                )}
                {saveStatus === 'saved' && (
                  <div className="flex items-center gap-2 text-green-400">
                    <span>✓</span>
                    <span className="text-sm font-medium">Auto-saved</span>
                  </div>
                )}
                {saveStatus === 'pending' && (
                  <div className="flex items-center gap-2 text-yellow-400">
                    <span>○</span>
                    <span className="text-sm font-medium">Saving in 2s...</span>
                  </div>
                )}
                {saveStatus === 'error' && (
                  <div className="flex items-center gap-2 text-red-400">
                    <span>✕</span>
                    <span className="text-sm font-medium">Save failed</span>
                  </div>
                )}
                {saveStatus === 'idle' && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <span>✓</span>
                    <span className="text-sm font-medium">All saved</span>
                  </div>
                )}
              </div>

              {/* Save Now Button */}
              <button
                onClick={forceSave}
                disabled={saveStatus === 'saving'}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                title="Force save to database now"
              >
                💾 Save Now
              </button>

              {/* Settings Menu */}
              <div className="relative group">
                <button className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors font-semibold">
                  ⚙️ Settings
                </button>
                <div className="absolute right-0 top-full mt-2 w-56 bg-gray-800 rounded-lg shadow-xl border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  {/* Backup Section */}
                  <div className="px-4 py-2 border-b border-gray-700">
                    <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Backup</div>
                  </div>
                  <label className="block px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-700">
                    <span className="text-sm">📤 Import from JSON</span>
                    <input
                      type="file"
                      accept=".json,application/json"
                      onChange={uploadJSON}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={downloadJSON}
                    className="block w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors text-sm"
                    title="Download backup JSON file"
                  >
                    💾 Export to JSON
                  </button>

                  {/* Slideshow Settings */}
                  <div className="px-4 py-2 border-t border-gray-700">
                    <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Slideshow</div>
                  </div>
                  <div className="px-4 py-3 space-y-2">
                    <label className="text-sm text-gray-300 font-medium">Transition Style</label>
                    <select
                      value={settings.transitionMode}
                      onChange={(e) => {
                        const newMode = e.target.value;
                        console.log('[Editor] Transition mode changed to:', newMode);
                        setSettings({ ...settings, transitionMode: newMode });
                      }}
                      className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm border border-gray-600 focus:border-tgteal focus:outline-none"
                    >
                      <option value="sync">🔄 Crossfade (smooth overlap)</option>
                      <option value="wait">⏸️ Blank gap (fade out then in)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      <strong>Crossfade:</strong> New slide fades in while old fades out<br />
                      <strong>Blank gap:</strong> Old fades out completely, then new fades in<br />
                      <span className="text-tgteal">Current: {settings.transitionMode === 'sync' ? 'Crossfade' : 'Blank gap'}</span>
                    </p>

                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <label className="text-sm text-gray-300 font-medium">Build Animation Scope</label>
                      <select
                        value={settings.buildScope || 'components'}
                        onChange={(e) => {
                          console.log('[Editor] Build scope changed to:', e.target.value);
                          setSettings({ ...settings, buildScope: e.target.value });
                        }}
                        className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm border border-gray-600 focus:border-tgteal focus:outline-none mt-1"
                      >
                        <option value="off">🚫 Off (no build animations)</option>
                        <option value="components">📦 Components (title, subtitle, CTA)</option>
                        <option value="elements">✨ Elements (words, items)</option>
                        <option value="sections">📐 Sections (columns, blocks)</option>
                      </select>
                    </div>

                    <div className="mt-3">
                      <label className="text-sm text-gray-300 font-medium">Build Animation Style</label>
                      <select
                        value={settings.buildStyle || 'classic'}
                        onChange={(e) => {
                          console.log('[Editor] Build style changed to:', e.target.value);
                          setSettings({ ...settings, buildStyle: e.target.value });
                        }}
                        className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm border border-gray-600 focus:border-tgteal focus:outline-none mt-1"
                        disabled={settings.buildScope === 'off'}
                      >
                        <option value="off">🚫 Off</option>
                        <option value="classic">⭐ Classic (word-by-word rise)</option>
                        <option value="cascadingFade">💧 Cascading Fade</option>
                        <option value="scalingCascade">🔍 Scaling Cascade</option>
                        <option value="slideIn">➡️ Slide In</option>
                        <option value="blurFocus">🎯 Blur Focus</option>
                        <option value="typewriter">⌨️ Typewriter</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Animates elements within slides as they appear
                      </p>
                    </div>

                    <div className="mt-3">
                      <label className="text-sm text-gray-300 font-medium">Aspect Ratio</label>
                      <select
                        value={settings.aspectRatio || '16:9'}
                        onChange={(e) => {
                          console.log('[Editor] Aspect ratio changed to:', e.target.value);
                          setSettings({ ...settings, aspectRatio: e.target.value });
                        }}
                        className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm border border-gray-600 focus:border-tgteal focus:outline-none mt-1"
                      >
                        <option value="16:9">📺 16:9 (Standard HD)</option>
                        <option value="21:9">🖥️ 21:9 (Ultrawide)</option>
                        <option value="4:3">🔲 4:3 (Classic)</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Choose the aspect ratio for your display. Ensures slides look great on different screens.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="/"
                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                View Slideshow
              </a>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-400">
              {scenes.length} slides • Total duration: {scenes.reduce((acc, s) => acc + s.durationSec, 0)}s
            </div>
            {lastSaved && (
              <div className="text-gray-500 text-xs">
                Last saved: {lastSaved.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        {/* Slide List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {scenes.map((scene, index) => (
            <div key={index} className="relative">
              {/* Drop indicator - shows BEFORE this slide */}
              {dragOverIndex === index && draggedSlideIndex !== null && (
                <div className="absolute -top-2 left-0 right-0 h-1 bg-tgteal shadow-[0_0_8px_rgba(0,212,255,0.6)] rounded-full z-10" />
              )}

              <motion.div
                layout
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`p-3 rounded-lg transition-all ${
                  draggedSlideIndex === index
                    ? 'opacity-40 cursor-grabbing scale-95'
                    : 'cursor-grab'
                } ${
                  selectedIndex === index
                    ? 'bg-tgteal/20 border-2 border-tgteal'
                    : 'bg-gray-800 border-2 border-transparent hover:border-gray-600'
                }`}
              >
                <div className="flex items-start gap-2">
                  {/* Drag Handle */}
                  <div className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-tgteal transition-colors pt-1 flex-shrink-0">
                  <svg width="16" height="24" viewBox="0 0 16 24" fill="currentColor">
                    <circle cx="4" cy="6" r="2"/>
                    <circle cx="12" cy="6" r="2"/>
                    <circle cx="4" cy="12" r="2"/>
                    <circle cx="12" cy="12" r="2"/>
                    <circle cx="4" cy="18" r="2"/>
                    <circle cx="12" cy="18" r="2"/>
                  </svg>
                </div>

                {/* Slide Info */}
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => {
                    setSelectedIndex(index);
                    setPreviewIndex(index);
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono bg-gray-700 px-2 py-0.5 rounded">
                      {index + 1}
                    </span>
                    <span className="text-xs font-mono bg-tgmagenta/30 px-2 py-0.5 rounded">
                      {scene.type}
                    </span>
                    {scene.featured && (
                      <span className="text-xs font-mono bg-yellow-600 px-2 py-0.5 rounded">
                        ⭐ Featured
                      </span>
                    )}
                    <span className="text-xs text-gray-400">{scene.durationSec}s</span>
                  </div>
                  <div className="font-semibold truncate">{scene.title}</div>
                  {scene.subtitle && (
                    <div className="text-sm text-gray-400 truncate">
                      {scene.subtitle.substring(0, 60)}...
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
          ))}

          {/* Drop indicator - shows AFTER last slide */}
          {dragOverIndex === scenes.length && draggedSlideIndex !== null && (
            <div className="relative h-1 bg-tgteal shadow-[0_0_8px_rgba(0,212,255,0.6)] rounded-full mb-2" />
          )}

          <button
            onClick={addNewScene}
            className="w-full p-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-tgteal hover:bg-tgteal/5 transition-all"
          >
            + Add New Slide
          </button>
        </div>
      </div>

      {/* Vertical Resize Handle */}
      <div
        className="w-1 bg-gray-700 hover:bg-tgteal cursor-col-resize transition-colors relative group"
        onMouseDown={() => setIsDraggingVertical(true)}
      >
        <div className="absolute inset-y-0 -left-1 -right-1" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-tgteal text-black px-2 py-1 rounded text-xs font-bold whitespace-nowrap pointer-events-none">
          ⇔ Resize
        </div>
      </div>

      {/* Right Panel */}
      <div
        className="flex flex-col right-panel"
        style={{ width: `${100 - leftPanelWidth}%` }}
      >
        {/* Preview Section */}
        <div
          className="flex flex-col border-b border-gray-700"
          style={{ height: `${topPanelHeight}%` }}
        >
          {/* Preview Controls */}
          <div className="p-4 border-b border-gray-700 bg-gray-800">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">
                Preview: Slide {previewIndex + 1} of {scenes.length}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewIndex(selectedIndex)}
                  className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors text-sm"
                >
                  Preview This
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-3 py-1 rounded transition-colors text-sm ${
                    isPlaying
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-tgteal text-black hover:bg-tgteal/80'
                  }`}
                >
                  {isPlaying ? '⏸ Pause' : '▶ Play'}
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPreviewIndex((prev) => (prev - 1 + scenes.length) % scenes.length)}
                className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors text-sm"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPreviewIndex((prev) => (prev + 1) % scenes.length)}
                className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors text-sm"
              >
                Next →
              </button>
            </div>
          </div>

          {/* Live Preview - Scaled */}
          <div className="flex-1 relative bg-black overflow-hidden flex items-center justify-center preview-container">
            <div className="relative w-full h-full flex items-center justify-center">
              <div
                className="relative"
                style={{
                  width: `${ASPECT_RATIOS[settings.aspectRatio]?.width || 1920}px`,
                  height: `${ASPECT_RATIOS[settings.aspectRatio]?.height || 1080}px`,
                  transform: 'scale(var(--preview-scale))',
                  transformOrigin: 'center center'
                }}
              >
                <AnimatePresence mode="wait">
                  <Scene
                    key={previewIndex}
                    scene={scenes[previewIndex]}
                    isActive={true}
                    aspectRatio={ASPECT_RATIOS[settings.aspectRatio]}
                  />
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Resize Handle */}
        <div
          className="h-1 bg-gray-700 hover:bg-tgteal cursor-row-resize transition-colors relative group"
          onMouseDown={() => setIsDraggingHorizontal(true)}
        >
          <div className="absolute inset-x-0 -top-1 -bottom-1" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-tgteal text-black px-2 py-1 rounded text-xs font-bold whitespace-nowrap pointer-events-none">
            ⇕ Resize
          </div>
        </div>

        {/* Slide Details Section */}
        <div
          className="overflow-y-auto p-4 bg-gray-800"
          style={{ height: `${100 - topPanelHeight}%` }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Edit Slide {selectedIndex + 1}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => duplicateScene(selectedIndex)}
                className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors text-sm"
              >
                Duplicate
              </button>
              <button
                onClick={() => deleteScene(selectedIndex)}
                className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {/* Slide Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Slide Type</label>
              <select
                value={selectedScene.type || 'hero'}
                onChange={(e) => updateScene(selectedIndex, { type: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              >
                <option value="hero">Hero</option>
                <option value="testimonial">Testimonial</option>
                <option value="logo-grid">Logo Grid</option>
                <option value="service-card">Service Card</option>
                <option value="split-content">Split Content</option>
                <option value="fullscreen-image">Full Screen Image</option>
                <option value="fullscreen-video">Full Screen Video</option>
              </select>
            </div>

            {/* Transition Effect */}
            <div>
              <label className="block text-sm font-medium mb-1">Transition Effect</label>
              <select
                value={selectedScene.transition || 'fade'}
                onChange={(e) => updateScene(selectedIndex, { transition: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              >
                {TRANSITION_OPTIONS.map(key => (
                  <option key={key} value={key}>
                    {TRANSITIONS[key].name}
                  </option>
                ))}
              </select>
              <div className="mt-1 text-xs text-gray-400">
                Preview the transition by switching slides in the slideshow
              </div>
            </div>

            {/* Build Animation Override */}
            <div className="p-3 bg-blue-900/20 border border-blue-700/50 rounded space-y-2">
              <div className="text-sm font-semibold text-blue-300">Build Animation Override</div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Build Scope</label>
                <select
                  value={selectedScene.buildScope || 'default'}
                  onChange={(e) => {
                    const value = e.target.value === 'default' ? undefined : e.target.value;
                    updateScene(selectedIndex, { buildScope: value });
                  }}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                >
                  <option value="default">🌐 Use Global ({settings.buildScope || 'components'})</option>
                  <option value="off">🚫 Off</option>
                  <option value="components">📦 Components</option>
                  <option value="elements">✨ Elements</option>
                  <option value="sections">📐 Sections</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Build Style</label>
                <select
                  value={selectedScene.buildStyle || 'default'}
                  onChange={(e) => {
                    const value = e.target.value === 'default' ? undefined : e.target.value;
                    updateScene(selectedIndex, { buildStyle: value });
                  }}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                >
                  <option value="default">🌐 Use Global ({settings.buildStyle || 'classic'})</option>
                  <option value="off">🚫 Off</option>
                  <option value="classic">⭐ Classic</option>
                  <option value="cascadingFade">💧 Cascading Fade</option>
                  <option value="scalingCascade">🔍 Scaling Cascade</option>
                  <option value="slideIn">➡️ Slide In</option>
                  <option value="blurFocus">🎯 Blur Focus</option>
                  <option value="typewriter">⌨️ Typewriter</option>
                </select>
              </div>
              <div className="text-xs text-gray-500">
                Override global build animation settings for this slide only
              </div>
            </div>

            {/* Duration (hidden for fullscreen-video with auto-advance) */}
            {!(selectedScene.type === 'fullscreen-video' && selectedScene.loop !== true) && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Duration: {selectedScene.durationSec}s
                </label>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={selectedScene.durationSec}
                  onChange={(e) => {
                    // Save to history on every change (autosave will debounce)
                    updateScene(selectedIndex, { durationSec: parseInt(e.target.value) });
                  }}
                  className="w-full"
                />
              </div>
            )}

            {/* Show info message for auto-advancing videos */}
            {selectedScene.type === 'fullscreen-video' && selectedScene.loop !== true && (
              <div className="p-3 bg-blue-900/20 border border-blue-700/50 rounded">
                <div className="text-sm text-blue-200">
                  ℹ️ Video will auto-advance when playback completes (duration setting not used)
                </div>
              </div>
            )}

            {/* Featured Slide */}
            <div className="flex items-center gap-3 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded">
              <input
                type="checkbox"
                id="featured"
                checked={selectedScene.featured || false}
                onChange={(e) => updateScene(selectedIndex, { featured: e.target.checked })}
                className="w-5 h-5 rounded cursor-pointer"
              />
              <label htmlFor="featured" className="cursor-pointer flex-1">
                <div className="font-semibold text-yellow-300">⭐ Featured Slide</div>
                <div className="text-sm text-yellow-200/70">
                  This slide will appear multiple times throughout the slideshow
                </div>
              </label>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={selectedScene.title || ''}
                onChange={(e) => updateScene(selectedIndex, { title: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>

            {/* Subtitle/Description */}
            {['hero', 'split-content', 'logo-grid', 'service-card'].includes(selectedScene.type) && (
              <RichTextArea
                label="Subtitle"
                value={selectedScene.subtitle || ''}
                onChange={(value) => updateScene(selectedIndex, { subtitle: value })}
                rows={4}
              />
            )}

            {/* Quote (for testimonials) */}
            {selectedScene.type === 'testimonial' && (
              <>
                <RichTextArea
                  label="Quote"
                  value={selectedScene.quote || ''}
                  onChange={(value) => updateScene(selectedIndex, { quote: value })}
                  rows={3}
                />
                <div>
                  <label className="block text-sm font-medium mb-1">Author</label>
                  <input
                    type="text"
                    value={selectedScene.author || ''}
                    onChange={(e) => updateScene(selectedIndex, { author: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <input
                    type="text"
                    value={selectedScene.role || ''}
                    onChange={(e) => updateScene(selectedIndex, { role: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company</label>
                  <input
                    type="text"
                    value={selectedScene.company || ''}
                    onChange={(e) => updateScene(selectedIndex, { company: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={selectedScene.rating || 5}
                    onChange={(e) => updateScene(selectedIndex, { rating: parseInt(e.target.value) })}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
              </>
            )}

            {/* CTA */}
            <div>
              <label className="block text-sm font-medium mb-1">Call to Action (optional)</label>
              <input
                type="text"
                value={selectedScene.cta || ''}
                onChange={(e) => updateScene(selectedIndex, { cta: e.target.value || null })}
                placeholder="Leave empty for no CTA"
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium mb-1">Background Image</label>
              <div className="flex gap-2">
                <select
                  value={
                    selectedScene.image?.startsWith('data:') || selectedScene.image?.startsWith('https://')
                      ? 'custom'
                      : selectedScene.image || ''
                  }
                  onChange={(e) => {
                    if (e.target.value !== 'custom') {
                      updateScene(selectedIndex, { image: e.target.value });
                    }
                  }}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                >
                  {(selectedScene.image?.startsWith('data:') || selectedScene.image?.startsWith('https://')) && (
                    <option value="custom">
                      🖼️ {selectedScene.imageName || 'Custom Upload'}
                    </option>
                  )}
                  <option value="">None</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={`/assets/placeholder-0${n}.svg`}>
                      Placeholder {n}
                    </option>
                  ))}
                </select>
                <label className={`px-4 py-2 rounded transition-colors cursor-pointer text-sm whitespace-nowrap ${
                  uploadingImage ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}>
                  {uploadingImage ? '⏳ Uploading...' : '📁 Upload'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingImage}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setUploadingImage(true);
                        try {
                          // Resize image if needed
                          const fileToUpload = await resizeImageIfNeeded(file);

                          // Upload to Supabase Storage
                          const fileExt = fileToUpload.name.split('.').pop();
                          const originalName = fileToUpload.name.replace(/\.[^/.]+$/, ''); // Remove extension
                          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                          const filePath = `slides/${fileName}`;

                          const { data, error } = await supabase.storage
                            .from('slideshow-images')
                            .upload(filePath, fileToUpload, {
                              cacheControl: '3600',
                              upsert: false
                            });

                          if (error) throw error;

                          // Get public URL
                          const { data: { publicUrl } } = supabase.storage
                            .from('slideshow-images')
                            .getPublicUrl(filePath);

                          // Store both URL and original filename
                          updateScene(selectedIndex, {
                            image: publicUrl,
                            imageName: originalName
                          });
                          setUploadingImage(false);
                          e.target.value = '';
                        } catch (error) {
                          console.error('Error uploading image:', error);
                          console.error('Error details:', error.message, error.code, error.statusCode);
                          alert('Failed to upload image: ' + error.message + '\n\nCheck console for details.');
                          setUploadingImage(false);
                          e.target.value = '';
                        }
                      }
                    }}
                  />
                </label>
              </div>
              {/* Image Preview */}
              {selectedScene.image && (
                <div className="mt-3 p-2 bg-gray-800 rounded border border-gray-700">
                  <div className="text-xs text-gray-400 mb-2">Preview:</div>
                  <div className="relative w-full h-32 bg-gray-900 rounded overflow-hidden">
                    <img
                      src={selectedScene.image}
                      alt="Background preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-full h-full items-center justify-center text-gray-500 text-sm">
                      Failed to load image
                    </div>
                  </div>
                  {selectedScene.image.startsWith('data:') && (
                    <div className="mt-2 text-xs text-yellow-400">
                      ⚠️ Custom upload ({(selectedScene.image.length / 1024).toFixed(0)}KB) - Large images may affect performance
                    </div>
                  )}
                </div>
              )}
              <div className="mt-2 text-xs text-gray-400">
                Upload custom images (converted to data URLs for portability)
              </div>
            </div>

            {/* Video (for fullscreen-video type) */}
            {selectedScene.type === 'fullscreen-video' && (
              <div>
                <label className="block text-sm font-medium mb-1">Video</label>
                <div className="flex gap-2">
                  {selectedScene.video ? (
                    <div className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white flex items-center justify-between">
                      <span className="text-sm">🎬 {selectedScene.videoName || 'Uploaded Video'}</span>
                      <button
                        onClick={() => updateScene(selectedIndex, { video: null, videoName: null })}
                        className="ml-2 text-red-400 hover:text-red-300"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-gray-400">
                      No video uploaded
                    </div>
                  )}
                  <label className={`px-4 py-2 rounded transition-colors cursor-pointer text-sm whitespace-nowrap ${
                    uploadingVideo ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}>
                    {uploadingVideo ? '⏳ Uploading...' : '📁 Upload'}
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      disabled={uploadingVideo}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadingVideo(true);
                          try {
                            // Check file size (limit to 100MB)
                            const MAX_SIZE = 100 * 1024 * 1024;
                            if (file.size > MAX_SIZE) {
                              throw new Error(
                                `Video file is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). ` +
                                `Maximum size is ${MAX_SIZE / 1024 / 1024}MB.`
                              );
                            }

                            // Upload to Supabase Storage
                            const fileExt = file.name.split('.').pop();
                            const originalName = file.name.replace(/\.[^/.]+$/, '');
                            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                            const filePath = `videos/${fileName}`;

                            const { data, error } = await supabase.storage
                              .from('slideshow-videos')
                              .upload(filePath, file, {
                                cacheControl: '3600',
                                upsert: false
                              });

                            if (error) throw error;

                            // Get public URL
                            const { data: { publicUrl } } = supabase.storage
                              .from('slideshow-videos')
                              .getPublicUrl(filePath);

                            // Store both URL and original filename
                            updateScene(selectedIndex, {
                              video: publicUrl,
                              videoName: originalName
                            });
                            setUploadingVideo(false);
                            e.target.value = '';
                          } catch (error) {
                            console.error('Error uploading video:', error);
                            console.error('Error details:', error.message, error.code, error.statusCode);
                            alert('Failed to upload video: ' + error.message + '\n\nCheck console for details.');
                            setUploadingVideo(false);
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                  </label>
                </div>
                {/* Video Preview */}
                {selectedScene.video && (
                  <div className="mt-3 p-2 bg-gray-800 rounded border border-gray-700">
                    <div className="text-xs text-gray-400 mb-2">Preview:</div>
                    <div className="relative w-full h-32 bg-gray-900 rounded overflow-hidden">
                      <video
                        src={selectedScene.video}
                        className="w-full h-full object-cover"
                        controls
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden w-full h-full items-center justify-center text-gray-500 text-sm">
                        Failed to load video
                      </div>
                    </div>
                  </div>
                )}
                <div className="mt-2 text-xs text-gray-400">
                  Upload videos (max 100MB) - stored in Supabase
                </div>

                {/* Video Options */}
                <div className="mt-4 space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedScene.loop !== true}
                      onChange={(e) => updateScene(selectedIndex, { loop: !e.target.checked })}
                      className="bg-gray-700 border border-gray-600 rounded"
                    />
                    <span className="text-sm text-gray-300">Auto-advance to next slide when done (no loop)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedScene.muted !== false}
                      onChange={(e) => updateScene(selectedIndex, { muted: e.target.checked })}
                      className="bg-gray-700 border border-gray-600 rounded"
                    />
                    <span className="text-sm text-gray-300">Mute video (required for autoplay)</span>
                  </label>
                </div>
              </div>
            )}

            {/* Split Content - Points Editor */}
            {selectedScene.type === 'split-content' && (
              <div>
                <label className="block text-sm font-medium mb-2">Bullet Points</label>
                {(selectedScene.points || []).map((point, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={point}
                      onChange={(e) => {
                        const newPoints = [...(selectedScene.points || [])];
                        newPoints[idx] = e.target.value;
                        updateScene(selectedIndex, { points: newPoints });
                      }}
                      className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder={`Point ${idx + 1}`}
                    />
                    <button
                      onClick={() => {
                        const newPoints = (selectedScene.points || []).filter((_, i) => i !== idx);
                        updateScene(selectedIndex, { points: newPoints });
                      }}
                      className="px-3 py-2 bg-red-600 rounded hover:bg-red-700 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newPoints = [...(selectedScene.points || []), 'New point'];
                    updateScene(selectedIndex, { points: newPoints });
                  }}
                  className="w-full px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors text-sm"
                >
                  + Add Point
                </button>
                <div className="mt-2">
                  <label className="block text-sm font-medium mb-1">Layout</label>
                  <select
                    value={selectedScene.layout || 'image-left'}
                    onChange={(e) => updateScene(selectedIndex, { layout: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    <option value="image-left">Image Left</option>
                    <option value="image-right">Image Right</option>
                  </select>
                </div>
              </div>
            )}

            {/* Logo Grid - Logos Editor */}
            {selectedScene.type === 'logo-grid' && (
              <div>
                <label className="block text-sm font-medium mb-2">Client Logos</label>
                {(selectedScene.logos || []).map((logo, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={logo.name}
                      onChange={(e) => {
                        const newLogos = [...(selectedScene.logos || [])];
                        newLogos[idx] = { name: e.target.value };
                        updateScene(selectedIndex, { logos: newLogos });
                      }}
                      className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="Company Name"
                    />
                    <button
                      onClick={() => {
                        const newLogos = (selectedScene.logos || []).filter((_, i) => i !== idx);
                        updateScene(selectedIndex, { logos: newLogos });
                      }}
                      className="px-3 py-2 bg-red-600 rounded hover:bg-red-700 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newLogos = [...(selectedScene.logos || []), { name: 'New Company' }];
                    updateScene(selectedIndex, { logos: newLogos });
                  }}
                  className="w-full px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors text-sm"
                >
                  + Add Logo
                </button>
                {selectedScene.footer !== undefined && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium mb-1">Footer Text</label>
                    <input
                      type="text"
                      value={selectedScene.footer || ''}
                      onChange={(e) => updateScene(selectedIndex, { footer: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Service Card - Services Editor */}
            {selectedScene.type === 'service-card' && (
              <div>
                <label className="block text-sm font-medium mb-2">Services</label>
                {(selectedScene.services || []).map((service, idx) => (
                  <div key={idx} className="mb-4 p-3 bg-gray-700/50 rounded border border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold">Service {idx + 1}</span>
                      <button
                        onClick={() => {
                          const newServices = (selectedScene.services || []).filter((_, i) => i !== idx);
                          updateScene(selectedIndex, { services: newServices });
                        }}
                        className="px-2 py-1 bg-red-600 rounded hover:bg-red-700 transition-colors text-sm"
                      >
                        ✕ Remove
                      </button>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={service.icon || ''}
                        onChange={(e) => {
                          const newServices = [...(selectedScene.services || [])];
                          newServices[idx] = { ...service, icon: e.target.value };
                          updateScene(selectedIndex, { services: newServices });
                        }}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                        placeholder="Icon (emoji)"
                      />
                      <input
                        type="text"
                        value={service.name || ''}
                        onChange={(e) => {
                          const newServices = [...(selectedScene.services || [])];
                          newServices[idx] = { ...service, name: e.target.value };
                          updateScene(selectedIndex, { services: newServices });
                        }}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                        placeholder="Service Name"
                      />
                      <textarea
                        value={service.description || ''}
                        onChange={(e) => {
                          const newServices = [...(selectedScene.services || [])];
                          newServices[idx] = { ...service, description: e.target.value };
                          updateScene(selectedIndex, { services: newServices });
                        }}
                        rows={2}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                        placeholder="Description"
                      />
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Features (one per line)</label>
                        <textarea
                          value={(service.features || []).join('\n')}
                          onChange={(e) => {
                            const newServices = [...(selectedScene.services || [])];
                            newServices[idx] = {
                              ...service,
                              features: e.target.value.split('\n').filter(f => f.trim())
                            };
                            updateScene(selectedIndex, { services: newServices });
                          }}
                          rows={3}
                          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm font-mono"
                          placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                        />
                      </div>
                      <input
                        type="text"
                        value={service.badge || ''}
                        onChange={(e) => {
                          const newServices = [...(selectedScene.services || [])];
                          newServices[idx] = { ...service, badge: e.target.value };
                          updateScene(selectedIndex, { services: newServices });
                        }}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                        placeholder="Badge (optional)"
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newService = {
                      icon: '🎯',
                      name: 'New Service',
                      description: 'Service description',
                      features: ['Feature 1', 'Feature 2', 'Feature 3'],
                      badge: ''
                    };
                    const newServices = [...(selectedScene.services || []), newService];
                    updateScene(selectedIndex, { services: newServices });
                  }}
                  className="w-full px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors text-sm"
                >
                  + Add Service
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
