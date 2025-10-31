import { useState } from 'react';
import LogoLibraryManager from '../components/LogoLibraryManager';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('logos');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-gray-400 mt-1">Manage your slideshow assets and settings</p>
          </div>
          <div className="flex gap-3">
            <a
              href="/editor"
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              📝 Editor
            </a>
            <a
              href="/"
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              🎬 Slideshow
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('logos')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'logos'
                  ? 'text-tgteal border-b-2 border-tgteal'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🖼️ Logo Library
            </button>
            <button
              onClick={() => setActiveTab('images')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'images'
                  ? 'text-tgteal border-b-2 border-tgteal'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📸 Background Images
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'videos'
                  ? 'text-tgteal border-b-2 border-tgteal'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🎥 Videos
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'text-tgteal border-b-2 border-tgteal'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              ⚙️ Settings
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {activeTab === 'logos' && (
          <div>
            <LogoLibraryManager
              isOpen={true}
              onClose={() => {}}
              onLogoChange={() => {}}
            />
          </div>
        )}

        {activeTab === 'images' && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-6xl mb-4">📸</div>
            <h2 className="text-2xl font-bold mb-2">Background Images</h2>
            <p>Image management coming soon...</p>
            <p className="text-sm mt-2">For now, use the image upload in the Editor</p>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-6xl mb-4">🎥</div>
            <h2 className="text-2xl font-bold mb-2">Video Library</h2>
            <p>Video management coming soon...</p>
            <p className="text-sm mt-2">For now, use the video upload in the Editor</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-bold mb-4">Application Settings</h2>
            <div className="space-y-4 text-gray-400">
              <div>
                <h3 className="font-semibold text-white mb-2">Storage Info</h3>
                <p className="text-sm">
                  • Supabase Project: fyiwpqnbiutuzuxjdeot<br />
                  • Region: US East<br />
                  • Status: Connected ✓
                </p>
              </div>
              <div className="pt-4 border-t border-gray-700">
                <h3 className="font-semibold text-white mb-2">Quick Links</h3>
                <div className="flex gap-2">
                  <a
                    href="https://supabase.com/dashboard/project/fyiwpqnbiutuzuxjdeot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors text-white text-sm"
                  >
                    🗄️ Supabase Dashboard
                  </a>
                  <a
                    href="https://supabase.com/dashboard/project/fyiwpqnbiutuzuxjdeot/storage/buckets"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors text-white text-sm"
                  >
                    📦 Storage Buckets
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
