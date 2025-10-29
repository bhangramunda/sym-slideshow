import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Scene from './Scene';
import RichTextArea from './RichTextArea';
import scenesData from '../scenes.json';

export default function Editor() {
  const [scenes, setScenes] = useState(scenesData);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Undo/Redo history
  const [history, setHistory] = useState([scenesData]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Save to history when scenes change
  const saveToHistory = (newScenes) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newScenes);
    // Limit history to 50 states
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(historyIndex + 1);
    }
    setHistory(newHistory);
    setScenes(newScenes);
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
    const newScenes = [...scenes];
    newScenes[index] = { ...newScenes[index], ...updates };
    saveToHistory(newScenes);
  };

  const moveScene = (index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === scenes.length - 1)
    ) {
      return;
    }

    const newScenes = [...scenes];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newScenes[index], newScenes[targetIndex]] = [newScenes[targetIndex], newScenes[index]];
    saveToHistory(newScenes);
    setSelectedIndex(targetIndex);
  };

  const duplicateScene = (index) => {
    const newScenes = [...scenes];
    newScenes.splice(index + 1, 0, { ...scenes[index] });
    saveToHistory(newScenes);
  };

  const deleteScene = (index) => {
    if (scenes.length <= 1) {
      alert('Cannot delete the last slide!');
      return;
    }
    const newScenes = scenes.filter((_, i) => i !== index);
    saveToHistory(newScenes);
    if (selectedIndex >= newScenes.length) {
      setSelectedIndex(newScenes.length - 1);
    }
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
    saveToHistory([...scenes, newScene]);
    setSelectedIndex(scenes.length);
  };

  const downloadJSON = () => {
    const dataStr = JSON.stringify(scenes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'scenes.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const selectedScene = scenes[selectedIndex];

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Editor Panel */}
      <div className="w-1/2 flex flex-col border-r border-gray-700">
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
            <div className="flex gap-2">
              <button
                onClick={downloadJSON}
                className="px-4 py-2 bg-tgteal text-black rounded-lg hover:bg-tgteal/80 transition-colors font-semibold"
              >
                Download JSON
              </button>
              <a
                href="/"
                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                View Slideshow
              </a>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            {scenes.length} slides • Total duration: {scenes.reduce((acc, s) => acc + s.durationSec, 0)}s
          </div>
        </div>

        {/* Slide List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {scenes.map((scene, index) => (
            <motion.div
              key={index}
              layout
              className={`p-3 rounded-lg cursor-pointer transition-all ${
                selectedIndex === index
                  ? 'bg-tgteal/20 border-2 border-tgteal'
                  : 'bg-gray-800 border-2 border-transparent hover:border-gray-600'
              }`}
              onClick={() => {
                setSelectedIndex(index);
                setPreviewIndex(index);
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
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
                <div className="flex flex-col gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveScene(index, 'up');
                    }}
                    disabled={index === 0}
                    className="p-1 text-xs hover:bg-gray-700 rounded disabled:opacity-30"
                  >
                    ▲
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveScene(index, 'down');
                    }}
                    disabled={index === scenes.length - 1}
                    className="p-1 text-xs hover:bg-gray-700 rounded disabled:opacity-30"
                  >
                    ▼
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          <button
            onClick={addNewScene}
            className="w-full p-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-tgteal hover:bg-tgteal/5 transition-all"
          >
            + Add New Slide
          </button>
        </div>
      </div>

      {/* Edit Panel */}
      <div className="w-1/2 flex flex-col">
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

        {/* Live Preview */}
        <div className="flex-1 relative bg-black overflow-hidden">
          <AnimatePresence mode="wait">
            <Scene key={previewIndex} scene={scenes[previewIndex]} isActive={true} />
          </AnimatePresence>
        </div>

        {/* Edit Form */}
        <div className="h-2/5 overflow-y-auto p-4 bg-gray-800 border-t border-gray-700">
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
              </select>
            </div>

            {/* Duration */}
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
                  // Update without saving to history (for live preview)
                  const newScenes = [...scenes];
                  newScenes[selectedIndex] = { ...newScenes[selectedIndex], durationSec: parseInt(e.target.value) };
                  setScenes(newScenes);
                }}
                onMouseUp={(e) => {
                  // Save to history when user releases the slider
                  updateScene(selectedIndex, { durationSec: parseInt(e.target.value) });
                }}
                onTouchEnd={(e) => {
                  // Save to history for touch devices
                  updateScene(selectedIndex, { durationSec: parseInt(e.target.value) });
                }}
                className="w-full"
              />
            </div>

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
                  value={selectedScene.image || ''}
                  onChange={(e) => updateScene(selectedIndex, { image: e.target.value })}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={`/assets/placeholder-0${n}.svg`}>
                      Placeholder {n}
                    </option>
                  ))}
                </select>
                <label className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors cursor-pointer text-sm whitespace-nowrap">
                  📁 Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Create a data URL for the image
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const dataUrl = event.target?.result;
                          updateScene(selectedIndex, { image: dataUrl });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
              <div className="mt-2 text-xs text-gray-400">
                Upload custom images or use placeholders
              </div>
            </div>

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
