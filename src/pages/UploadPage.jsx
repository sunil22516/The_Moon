import React, { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

const ChevronLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const CameraIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

const MusicIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13"></path>
    <circle cx="6" cy="18" r="3"></circle>
    <circle cx="18" cy="16" r="3"></circle>
  </svg>
);

const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const GENRES = ['Desi Hip Hop', 'Lo-fi', 'Indie', 'Boom Bap', 'R&B', 'Electronic', 'Spoken Word', 'Poetry', 'Cover Songs', 'Original Music', 'Rap', 'Chill Trap', 'Storytelling', 'Comedy', 'Podcasts', 'Shayari'];

export default function UploadPage({ user, onBack, onPostCreated }) {
  const [title, setTitle] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [category, setCategory] = useState(GENRES[0]);
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const audioInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const audioRef = useRef(null);

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        setError('Audio file must be less than 20MB');
        return;
      }
      setAudioFile(file);
      setAudioPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Cover image must be less than 5MB');
        return;
      }
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const removeAudio = (e) => {
    e.stopPropagation();
    setAudioFile(null);
    setAudioPreview(null);
    if (audioInputRef.current) audioInputRef.current.value = '';
  };

  const togglePlay = (e) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (audioRef.current.paused) audioRef.current.play();
      else audioRef.current.pause();
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !audioFile) {
      setError('Title and audio file are required');
      return;
    }

    setLoading(true);
    setError('');
    setProgress(10);

    try {
      const timestamp = Date.now();
      
      // Upload Audio
      const audioPath = `${user.id}/${timestamp}_${audioFile.name}`;
      const { error: audioError } = await supabase.storage
        .from('audio')
        .upload(audioPath, audioFile);
        
      if (audioError) throw audioError;
      setProgress(50);
      
      const { data: audioData } = supabase.storage.from('audio').getPublicUrl(audioPath);
      const audioUrl = audioData.publicUrl;

      // Upload Cover (if any)
      let coverUrl = null;
      if (coverFile) {
        const coverPath = `${user.id}/${timestamp}_${coverFile.name}`;
        const { error: coverError } = await supabase.storage
          .from('covers')
          .upload(coverPath, coverFile);
          
        if (coverError) throw coverError;
        
        const { data: coverData } = supabase.storage.from('covers').getPublicUrl(coverPath);
        coverUrl = coverData.publicUrl;
      }
      setProgress(80);

      const parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);

      // Insert Post
      const { error: dbError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          audio_url: audioUrl,
          cover_url: coverUrl,
          caption: title,
          category,
          tags: parsedTags,
          duration_seconds: 0 // Ideally this would be extracted from the audio metadata
        });

      if (dbError) throw dbError;
      
      setProgress(100);
      onPostCreated();
      
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn" style={{
      maxWidth: '480px',
      margin: '0 auto',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg)',
      color: 'var(--text-primary)',
      overflowY: 'auto',
      paddingBottom: 'var(--space-2xl)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: 'var(--space-md)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        backgroundColor: 'var(--bg)',
        zIndex: 10
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex' }}>
          <ChevronLeftIcon />
        </button>
        <h1 style={{ margin: '0 auto', fontSize: '1.25rem', paddingRight: '24px' }}>New Post</h1>
      </div>

      <div style={{ padding: 'var(--space-lg)' }}>
        {/* Cover Upload */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-xl)' }}>
          <div 
            onClick={() => coverInputRef.current?.click()}
            style={{
              width: '200px',
              height: '200px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--surface-elevated)',
              border: coverPreview ? 'none' : '2px dashed var(--border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {coverPreview ? (
              <img src={coverPreview} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <>
                <div style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-sm)' }}><CameraIcon /></div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Add Cover Art</span>
              </>
            )}
            <input type="file" accept="image/*" ref={coverInputRef} onChange={handleCoverChange} style={{ display: 'none' }} />
          </div>
        </div>

        {/* Audio Upload */}
        <div 
          onClick={() => !audioFile && audioInputRef.current?.click()}
          style={{
            background: 'var(--glass)',
            border: audioFile ? '1px solid var(--glass-border)' : '2px dashed var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-md)',
            marginBottom: 'var(--space-xl)',
            display: 'flex',
            alignItems: 'center',
            cursor: audioFile ? 'default' : 'pointer'
          }}
        >
          {audioFile ? (
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <button onClick={togglePlay} style={{
                background: 'var(--accent)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 'var(--space-md)',
                cursor: 'pointer'
              }}>
                <PlayIcon />
              </button>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {audioFile.name}
                </p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button onClick={removeAudio} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
                <XIcon />
              </button>
              {audioPreview && <audio ref={audioRef} src={audioPreview} style={{ display: 'none' }} />}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', padding: 'var(--space-md) 0' }}>
              <div style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-sm)' }}><MusicIcon /></div>
              <span style={{ color: 'var(--text-secondary)' }}>Tap to select audio</span>
            </div>
          )}
          <input type="file" accept="audio/*" ref={audioInputRef} onChange={handleAudioChange} style={{ display: 'none' }} />
        </div>

        {/* Inputs */}
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your post a title..."
            style={{
              width: '100%',
              padding: 'var(--space-md)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              boxSizing: 'border-box',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ marginBottom: 'var(--space-md)' }}>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: '100%',
              padding: 'var(--space-md)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              boxSizing: 'border-box',
              outline: 'none',
              appearance: 'none'
            }}
          >
            {GENRES.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Add tags (comma separated)"
            style={{
              width: '100%',
              padding: 'var(--space-md)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              boxSizing: 'border-box',
              outline: 'none'
            }}
          />
        </div>

        {error && <p style={{ color: '#f87171', marginBottom: 'var(--space-md)', fontSize: '0.875rem' }}>{error}</p>}
        
        {loading && (
          <div style={{ width: '100%', height: '4px', background: 'var(--surface-elevated)', borderRadius: '2px', marginBottom: 'var(--space-md)' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent)', borderRadius: '2px', transition: 'width 0.3s' }} />
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !title.trim() || !audioFile}
          style={{
            width: '100%',
            padding: 'var(--space-md)',
            borderRadius: 'var(--radius-full)',
            background: (loading || !title.trim() || !audioFile) ? 'var(--surface)' : 'var(--gradient-accent)',
            color: (loading || !title.trim() || !audioFile) ? 'var(--text-tertiary)' : '#fff',
            border: 'none',
            fontSize: '1.125rem',
            fontWeight: 'bold',
            cursor: (loading || !title.trim() || !audioFile) ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Uploading...' : 'Share to Moon'}
        </button>
      </div>
    </div>
  );
}
