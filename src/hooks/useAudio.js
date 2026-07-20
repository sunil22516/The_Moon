import { useState, useEffect, useCallback, useRef } from 'react';
import audioEngine from '../lib/audioEngine';

export function useAudio() {
  const [state, setState] = useState({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    url: null,
  });

  useEffect(() => {
    audioEngine.onUpdate((s) => setState(s));
    return () => audioEngine.onUpdate(null);
  }, []);

  const load = useCallback(async (url) => {
    await audioEngine.load(url);
  }, []);

  const play = useCallback(async () => {
    await audioEngine.play();
  }, []);

  const pause = useCallback(() => {
    audioEngine.pause();
  }, []);

  const toggle = useCallback(async () => {
    await audioEngine.toggle();
  }, []);

  const seek = useCallback((time) => {
    audioEngine.seek(time);
  }, []);

  const seekRelative = useCallback((delta) => {
    audioEngine.seekRelative(delta);
  }, []);

  const setVolume = useCallback((v) => {
    audioEngine.setVolume(v);
    setState(prev => ({ ...prev, volume: v }));
  }, []);

  return { ...state, load, play, pause, toggle, seek, seekRelative, setVolume };
}
