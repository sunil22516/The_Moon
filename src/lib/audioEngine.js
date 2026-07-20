// Singleton audio engine — manages a single <audio> element for the whole app
class AudioEngine {
  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'auto';
    this.audio.crossOrigin = 'anonymous';
    this._currentUrl = null;
    this._onUpdate = null;
    this._onEnded = null;
    this._raf = null;

    this.audio.addEventListener('ended', () => {
      if (this._onEnded) this._onEnded();
    });

    this.audio.addEventListener('error', (e) => {
      console.warn('Audio error:', e);
    });
  }

  async load(url) {
    if (this._currentUrl === url) return;
    this.audio.pause();
    this.audio.src = url;
    this._currentUrl = url;
    try {
      await this.audio.load();
    } catch (e) {
      console.warn('Audio load failed:', e);
    }
  }

  async play() {
    try {
      await this.audio.play();
      this._startUpdates();
    } catch (e) {
      console.warn('Playback failed (user interaction may be required):', e);
    }
  }

  pause() {
    this.audio.pause();
    this._stopUpdates();
    this._emitUpdate();
  }

  async toggle() {
    if (this.audio.paused) {
      await this.play();
    } else {
      this.pause();
    }
  }

  seek(time) {
    if (isFinite(time) && this.audio.duration) {
      this.audio.currentTime = Math.max(0, Math.min(time, this.audio.duration));
      this._emitUpdate();
    }
  }

  seekRelative(delta) {
    this.seek(this.audio.currentTime + delta);
  }

  setVolume(v) {
    this.audio.volume = Math.max(0, Math.min(1, v));
  }

  getVolume() {
    return this.audio.volume;
  }

  getState() {
    return {
      isPlaying: !this.audio.paused,
      currentTime: this.audio.currentTime || 0,
      duration: this.audio.duration || 0,
      volume: this.audio.volume,
      url: this._currentUrl,
    };
  }

  onUpdate(cb) {
    this._onUpdate = cb;
  }

  onEnded(cb) {
    this._onEnded = cb;
  }

  _startUpdates() {
    this._stopUpdates();
    const tick = () => {
      this._emitUpdate();
      this._raf = requestAnimationFrame(tick);
    };
    this._raf = requestAnimationFrame(tick);
  }

  _stopUpdates() {
    if (this._raf) {
      cancelAnimationFrame(this._raf);
      this._raf = null;
    }
  }

  _emitUpdate() {
    if (this._onUpdate) {
      this._onUpdate(this.getState());
    }
  }

  destroy() {
    this._stopUpdates();
    this.audio.pause();
    this.audio.src = '';
    this._currentUrl = null;
  }
}

const audioEngine = new AudioEngine();
export default audioEngine;
