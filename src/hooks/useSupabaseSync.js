import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

const PROJECT_NAME = 'default';
const AUTOSAVE_DELAY = 2000; // 2 seconds after last change

export function useSupabaseSync(scenes, settings, onScenesUpdate, onSettingsUpdate) {
  const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, saved, error
  const [lastSaved, setLastSaved] = useState(null);
  const [remoteVersion, setRemoteVersion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const saveTimeoutRef = useRef(null);
  const isInitialLoad = useRef(true);

  // Load initial data from Supabase
  useEffect(() => {
    async function loadFromSupabase() {
      try {
        const { data, error } = await supabase
          .from('slideshow_data')
          .select('*')
          .eq('project_name', PROJECT_NAME)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No data exists, create initial entry with current scenes/settings
            await saveToSupabase(scenes, settings, true);
          } else {
            throw error;
          }
        } else if (data && data.slides) {
          setRemoteVersion(data.version);
          setLastSaved(new Date(data.updated_at));

          // Check if remote data is different from local
          const remoteScenes = data.slides;
          const localScenes = JSON.stringify(scenes);
          const remote = JSON.stringify(remoteScenes);

          if (localScenes !== remote) {
            // Remote has different data, update local
            onScenesUpdate(remoteScenes);
          }

          // Load settings if available
          if (data.settings && onSettingsUpdate) {
            onSettingsUpdate(data.settings);
          }
        }
      } catch (error) {
        console.error('Error loading from Supabase:', error);
        setSaveStatus('error');
      } finally {
        setIsLoading(false);
      }
    }

    loadFromSupabase();
  }, [scenes, settings]);

  // Subscribe to real-time changes
  useEffect(() => {
    const channel = supabase
      .channel('slideshow-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'slideshow_data',
          filter: `project_name=eq.${PROJECT_NAME}`,
        },
        (payload) => {
          // Use latest remoteVersion via comparison with payload
          if (payload.new && payload.new.version > remoteVersion) {
            const shouldUpdate = confirm(
              'Newer changes detected from another session. Load them? (Your unsaved changes will be lost)'
            );

            if (shouldUpdate) {
              setRemoteVersion(payload.new.version);
              setLastSaved(new Date(payload.new.updated_at));
              onScenesUpdate(payload.new.slides);
              if (payload.new.settings && onSettingsUpdate) {
                onSettingsUpdate(payload.new.settings);
              }
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [remoteVersion, onScenesUpdate, onSettingsUpdate]);

  // Autosave when scenes or settings change
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set status to pending
    setSaveStatus('pending');

    // Schedule save
    saveTimeoutRef.current = setTimeout(() => {
      saveToSupabase(scenes, settings);
    }, AUTOSAVE_DELAY);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [scenes, settings]);

  async function saveToSupabase(scenesToSave, settingsToSave, isInitial = false) {
    setSaveStatus('saving');

    try {
      // Clean slides by removing internal properties like _slideId
      const cleanedSlides = scenesToSave.map(scene => {
        const { _slideId, ...cleanScene } = scene;
        return cleanScene;
      });

      // Log payload size for debugging
      const payloadSize = JSON.stringify(cleanedSlides).length;
      console.log(`[Supabase] Saving ${cleanedSlides.length} slides, payload size: ${(payloadSize / 1024).toFixed(2)} KB`);

      // Warn if payload is very large (might cause timeout)
      if (payloadSize > 500000) { // 500KB
        console.warn('[Supabase] Large payload detected! Consider optimizing images.');
      }

      const { data, error } = await supabase
        .from('slideshow_data')
        .upsert(
          {
            project_name: PROJECT_NAME,
            slides: cleanedSlides,
            settings: settingsToSave,
            updated_by: 'editor',
          },
          {
            onConflict: 'project_name',
          }
        )
        .select()
        .single();

      if (error) throw error;

      setRemoteVersion(data.version);
      setLastSaved(new Date(data.updated_at));
      setSaveStatus('saved');

      // Reset to idle after 2 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Error saving to Supabase:', error);
      setSaveStatus('error');
    }
  }

  async function forceSave() {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    await saveToSupabase(scenes, settings);
  }

  return {
    saveStatus,
    lastSaved,
    forceSave,
    isLoading,
  };
}
