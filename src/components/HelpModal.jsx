import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const helpContent = [
  {
    category: "Quick Start",
    items: [
      { title: "Select a Slide", desc: "Click any slide in the left panel to edit it" },
      { title: "Edit Content", desc: "Update fields in the right panel" },
      { title: "Preview", desc: "Watch changes in real-time in the center" },
      { title: "Auto-Save", desc: "All changes save automatically to the cloud" }
    ]
  },
  {
    category: "Slide Types",
    items: [
      { title: "🎯 Hero", desc: "Title slides and main messages with large text" },
      { title: "💥 Impact / ROI", desc: "Showcase big numbers with fireworks effects" },
      { title: "💬 Testimonial", desc: "Customer quotes with ratings and details" },
      { title: "🏢 Logo Grid", desc: "Display client/partner logos in adaptive grid" },
      { title: "📦 Service Card", desc: "Services or features in card layout" },
      { title: "🔀 Split Content", desc: "Half image, half text (like 'The Challenge')" },
      { title: "🖼️ Full Screen Image", desc: "Image that fills the entire screen" },
      { title: "🎬 Full Screen Video", desc: "Auto-playing video with auto-advance" }
    ]
  },
  {
    category: "Images & Videos",
    items: [
      { title: "Upload Images", desc: "Click 📁 Upload button, select file, auto-resized and stored" },
      { title: "Reuse Images", desc: "Once uploaded, images appear in dropdown for all slides" },
      { title: "Upload Videos", desc: "MP4 files up to 100MB, stored in cloud" },
      { title: "Video Options", desc: "Toggle loop/mute, auto-advance when video ends" }
    ]
  },
  {
    category: "Settings",
    items: [
      { title: "Transition Style", desc: "Crossfade (smooth overlap) or Blank Gap (fade out/in)" },
      { title: "Build Animation", desc: "Control how elements appear: scope and style options" },
      { title: "Aspect Ratio", desc: "16:9 (Standard), 21:9 (Ultrawide), or 4:3 (Classic)" }
    ]
  },
  {
    category: "Slide Management",
    items: [
      { title: "Reorder", desc: "Drag and drop slides in left panel" },
      { title: "Duplicate", desc: "Click 📋 Duplicate to copy current slide" },
      { title: "Delete", desc: "Click 🗑️ Delete to remove current slide" },
      { title: "Add New", desc: "Click ➕ Add Slide at bottom of left panel" },
      { title: "Featured", desc: "Check ⭐ Featured to show slide multiple times" }
    ]
  },
  {
    category: "Playback (/ root path)",
    items: [
      { title: "Navigate", desc: "Arrow Right/Space (next), Arrow Left (previous)" },
      { title: "Jump to Slide", desc: "Type slide number + Enter to jump directly" },
      { title: "Auto-Advance", desc: "Slides advance automatically based on duration" },
      { title: "Controls", desc: "Auto-hide after 500ms of inactivity" }
    ]
  },
  {
    category: "Tips & Tricks",
    items: [
      { title: "Test First", desc: "Always preview on the actual display you'll use" },
      { title: "High-Res Images", desc: "Upload the best quality images you have" },
      { title: "Keep It Simple", desc: "Don't overcrowd slides with too much info" },
      { title: "Markdown", desc: "Use **bold** for emphasis in text fields" },
      { title: "Featured Slides", desc: "Use for your most important messages" },
      { title: "Short Videos", desc: "Keep under 30 seconds for better engagement" }
    ]
  }
];

export default function HelpModal({ isOpen, onClose }) {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden pointer-events-auto border border-gray-700">
              {/* Header */}
              <div className="bg-gradient-to-r from-tgteal/20 to-tgmagenta/20 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">📚 Editor Help Guide</h2>
                  <p className="text-sm text-gray-400 mt-1">Learn how to create stunning slideshows</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex h-[calc(85vh-100px)]">
                {/* Sidebar */}
                <div className="w-64 bg-gray-800/50 border-r border-gray-700 overflow-y-auto">
                  {helpContent.map((section, index) => (
                    <button
                      key={section.category}
                      onClick={() => setActiveCategory(index)}
                      className={`w-full text-left px-6 py-3 transition-colors ${
                        activeCategory === index
                          ? 'bg-tgteal/20 text-tgteal border-l-4 border-tgteal'
                          : 'text-gray-300 hover:bg-gray-700/50 border-l-4 border-transparent'
                      }`}
                    >
                      <div className="font-medium">{section.category}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{section.items.length} topics</div>
                    </button>
                  ))}
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-8">
                  <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-2xl font-bold text-white mb-6">
                      {helpContent[activeCategory].category}
                    </h3>
                    <div className="space-y-4">
                      {helpContent[activeCategory].items.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-tgteal/50 transition-colors"
                        >
                          <h4 className="font-semibold text-white mb-2">{item.title}</h4>
                          <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-800/50 border-t border-gray-700 px-6 py-3 flex items-center justify-between text-sm">
                <div className="text-gray-400">
                  Built with ❤️ using React, Framer Motion, and Supabase
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveCategory((prev) => Math.max(0, prev - 1))}
                    disabled={activeCategory === 0}
                    className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => setActiveCategory((prev) => Math.min(helpContent.length - 1, prev + 1))}
                    disabled={activeCategory === helpContent.length - 1}
                    className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
