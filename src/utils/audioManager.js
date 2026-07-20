import { Audio } from 'expo-av';

class AudioManager {
  constructor() {
    this.sound = null;
    this.isPlaying = false;
    this.currentTrackId = null;
    this.statusCallback = null;
    this._volume = 0.8;
  }

  async load(trackId, audioUrl) {
    // Already loaded this track
    if (this.currentTrackId === trackId && this.sound) {
      return;
    }

    // Unload previous
    await this.unload();

    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: false, volume: this._volume },
        this._onPlaybackStatusUpdate
      );

      this.sound = sound;
      this.currentTrackId = trackId;
    } catch (err) {
      console.warn('[AudioManager] load error:', err.message);
    }
  }

  _onPlaybackStatusUpdate = (status) => {
    if (!status.isLoaded) return;

    this.isPlaying = status.isPlaying;

    if (this.statusCallback) {
      this.statusCallback({
        isPlaying: status.isPlaying,
        positionMillis: status.positionMillis || 0,
        durationMillis: status.durationMillis || 0,
        isBuffering: !!status.isBuffering,
        didJustFinish: !!status.didJustFinish,
      });
    }

    // Loop the track when it finishes
    if (status.didJustFinish) {
      this.sound?.setPositionAsync(0).then(() => this.sound?.playAsync());
    }
  };

  async play() {
    if (!this.sound) return;
    try {
      await this.sound.playAsync();
      this.isPlaying = true;
    } catch (err) {
      console.warn('[AudioManager] play error:', err.message);
    }
  }

  async pause() {
    if (!this.sound) return;
    try {
      await this.sound.pauseAsync();
      this.isPlaying = false;
    } catch (err) {
      console.warn('[AudioManager] pause error:', err.message);
    }
  }

  async togglePlay() {
    if (this.isPlaying) {
      await this.pause();
    } else {
      await this.play();
    }
    return this.isPlaying;
  }

  async seek(positionMillis) {
    if (!this.sound) return;
    try {
      await this.sound.setPositionAsync(Math.max(0, positionMillis));
    } catch (err) {
      console.warn('[AudioManager] seek error:', err.message);
    }
  }

  async setVolume(volume) {
    this._volume = Math.max(0, Math.min(1, volume));
    if (!this.sound) return;
    try {
      await this.sound.setVolumeAsync(this._volume);
    } catch (err) {
      console.warn('[AudioManager] setVolume error:', err.message);
    }
  }

  onStatusUpdate(callback) {
    this.statusCallback = callback;
  }

  async unload() {
    if (this.sound) {
      try {
        await this.sound.unloadAsync();
      } catch (err) {
        // Ignore unload errors
      }
      this.sound = null;
      this.isPlaying = false;
      this.currentTrackId = null;
    }
  }
}

// Singleton
export default new AudioManager();
