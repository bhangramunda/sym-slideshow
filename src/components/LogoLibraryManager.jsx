import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

export default function LogoLibraryManager({ isOpen, onClose, onLogoChange }) {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Fetch logos from Supabase
  const fetchLogos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('client_logos')
        .select('*')
        .order('display_name', { ascending: true });

      if (error) throw error;
      setLogos(data || []);
    } catch (error) {
      console.error('Error fetching logos:', error);
      alert('Failed to load logos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLogos();
    }
  }, [isOpen]);

  // Upload new logo
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.includes('svg')) {
      alert('Please upload an SVG file');
      return;
    }

    setUploading(true);
    try {
      // Generate unique filename to avoid conflicts
      const timestamp = Date.now();
      const cleanFilename = file.name
        .replace(/\s+/g, '-')
        .toLowerCase()
        .replace(/[^a-z0-9.-]/g, '');

      const uniqueFilename = `${timestamp}-${cleanFilename}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('client-logos')
        .upload(uniqueFilename, file, {
          contentType: 'image/svg+xml',
          upsert: true // Allow overwrite if somehow it exists
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('client-logos')
        .getPublicUrl(uniqueFilename);

      // Generate display name from filename
      const displayName = file.name
        .replace(/\.svg$/i, '')
        .replace(/-white|-dark|-light|-color|-gray/gi, '')
        .replace(/[-_]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Auto-detect theme
      const lower = file.name.toLowerCase();
      let theme = 'light';
      if (lower.includes('dark') || lower.includes('black')) theme = 'dark';
      else if (lower.includes('color')) theme = 'color';

      // Save to database
      const { error: dbError } = await supabase
        .from('client_logos')
        .insert([{
          filename: file.name,
          display_name: displayName,
          theme: theme,
          orientation: 'horizontal',
          storage_path: uniqueFilename,
          public_url: publicUrl
        }]);

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }

      // Refresh list
      await fetchLogos();
      if (onLogoChange) onLogoChange();

      e.target.value = '';
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Failed to upload logo: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Rename logo
  const handleRename = async (id, newName) => {
    if (!newName || !newName.trim()) {
      setEditingId(null);
      return;
    }

    try {
      console.log('Renaming logo ID:', id, 'to:', newName);

      const { error } = await supabase
        .from('client_logos')
        .update({ display_name: newName.trim() })
        .eq('id', id);

      if (error) {
        console.error('Rename error:', error);
        throw error;
      }

      console.log('Rename successful');

      setLogos(logos.map(logo =>
        logo.id === id ? { ...logo, display_name: newName.trim() } : logo
      ));
      setEditingId(null);
      if (onLogoChange) onLogoChange();
    } catch (error) {
      console.error('Error renaming logo:', error);
      alert('Failed to rename: ' + error.message + '\n\nCheck console for details.');
    }
  };

  // Delete logo
  const handleDelete = async (logo) => {
    try {
      console.log('Deleting logo:', logo);

      // Delete from database first
      const { error: dbError } = await supabase
        .from('client_logos')
        .delete()
        .eq('id', logo.id);

      if (dbError) {
        console.error('Database delete error:', dbError);
        throw dbError;
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('client-logos')
        .remove([logo.storage_path]);

      if (storageError) {
        console.error('Storage delete error:', storageError);
        // Don't throw - file might already be deleted, or we don't care if it fails
      }

      // Update UI
      setLogos(logos.filter(l => l.id !== logo.id));
      setDeleteConfirm(null);
      if (onLogoChange) onLogoChange();

      console.log('Logo deleted successfully');
    } catch (error) {
      console.error('Error deleting logo:', error);
      alert('Failed to delete: ' + error.message + '\n\nCheck console for details.');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-gray-800 rounded-lg shadow-2xl w-[90vw] h-[90vh] flex flex-col border border-gray-700"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-white">Logo Library Manager</h2>
              <p className="text-sm text-gray-400 mt-1">
                {logos.length} logo{logos.length !== 1 ? 's' : ''} in library
              </p>
            </div>
            <div className="flex gap-3">
              <label className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                uploading ? 'bg-blue-600' : 'bg-tgteal text-black hover:bg-tgteal/80'
              }`}>
                {uploading ? '⏳ Uploading...' : '📤 Upload SVG'}
                <input
                  type="file"
                  accept=".svg,image/svg+xml"
                  className="hidden"
                  disabled={uploading}
                  onChange={handleUpload}
                />
              </label>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-white"
              >
                ✕ Close
              </button>
            </div>
          </div>

          {/* Logo Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin h-12 w-12 border-4 border-tgteal border-t-transparent rounded-full mx-auto mb-4"></div>
                  <div className="text-gray-400">Loading logos...</div>
                </div>
              </div>
            ) : logos.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                  <div className="text-6xl mb-4">📦</div>
                  <div className="text-xl mb-2">No logos yet</div>
                  <div className="text-sm">Upload your first logo to get started</div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {logos.map(logo => (
                  <motion.div
                    key={logo.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gray-700/50 rounded-lg border border-gray-600 p-4 hover:border-tgteal/50 transition-all"
                  >
                    {/* Logo Preview */}
                    <div className="bg-white/5 rounded-lg h-32 flex items-center justify-center mb-3 p-3">
                      <img
                        src={logo.public_url}
                        alt={logo.display_name}
                        className="max-w-full max-h-full object-contain"
                        style={{ filter: 'brightness(0) invert(1)' }}
                      />
                    </div>

                    {/* Logo Name */}
                    {editingId === logo.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={() => {
                          if (editName.trim() && editName !== logo.display_name) {
                            handleRename(logo.id, editName.trim());
                          } else {
                            setEditingId(null);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleRename(logo.id, editName.trim());
                          } else if (e.key === 'Escape') {
                            setEditingId(null);
                          }
                        }}
                        autoFocus
                        className="w-full bg-gray-800 border border-tgteal rounded px-2 py-1 text-white text-sm mb-2"
                      />
                    ) : (
                      <div
                        className="text-sm font-medium text-white mb-2 truncate cursor-pointer hover:text-tgteal"
                        onClick={() => {
                          setEditingId(logo.id);
                          setEditName(logo.display_name);
                        }}
                        title="Click to rename"
                      >
                        {logo.display_name}
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                      <span className="bg-gray-600 px-2 py-0.5 rounded">{logo.theme}</span>
                      <span className="bg-gray-600 px-2 py-0.5 rounded">{logo.orientation}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(logo.id);
                          setEditName(logo.display_name);
                        }}
                        className="flex-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs text-white transition-colors"
                      >
                        ✏️ Rename
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(logo.id)}
                        className="flex-1 px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs text-white transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </div>

                    {/* Delete Confirmation */}
                    {deleteConfirm === logo.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 p-2 bg-red-900/50 border border-red-700 rounded"
                      >
                        <div className="text-xs text-red-200 mb-2">Delete permanently?</div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(logo)}
                            className="flex-1 px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs text-white"
                          >
                            Yes, Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="flex-1 px-2 py-1 bg-gray-600 hover:bg-gray-700 rounded text-xs text-white"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700 bg-gray-800/50">
            <div className="text-sm text-gray-400">
              💡 <strong>Tip:</strong> Click a logo name to rename it. SVG files are automatically converted to white for dark backgrounds.
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
