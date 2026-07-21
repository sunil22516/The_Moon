import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { timeAgo } from '../lib/demoData';

// Demo comments used when Supabase isn't available or post is demo
const DEMO_COMMENTS = [
  { id: 'c1', user: { username: 'musicfan', display_name: 'Music Fan' }, content: 'This is absolutely fire 🔥', created_at: '2026-07-15T10:00:00Z' },
  { id: 'c2', user: { username: 'beatmaker', display_name: 'BeatMaker' }, content: 'Love the vibes! Keep it up 💜', created_at: '2026-07-14T22:00:00Z' },
  { id: 'c3', user: { username: 'producer.x', display_name: 'Producer X' }, content: 'The production on this is insane', created_at: '2026-07-13T16:00:00Z' },
];

export default function CommentSheet({ visible, postId, userId, isDemo, onClose }) {
  const [inputValue, setInputValue] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch real comments when sheet opens
  useEffect(() => {
    if (!visible) return;

    if (isDemo || !supabase || !postId || postId.startsWith('demo-')) {
      setComments(DEMO_COMMENTS);
      return;
    }

    const fetchComments = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('comments')
        .select('*, user:profiles(username, display_name)')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setComments(data);
      }
      setLoading(false);
    };

    fetchComments();
  }, [visible, postId, isDemo]);

  if (!visible) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (!supabase || !userId || !postId || postId.startsWith('demo-')) {
      // Demo mode — just add locally
      setComments(prev => [{
        id: `local-${Date.now()}`,
        user: { username: 'you', display_name: 'You' },
        content: inputValue,
        created_at: new Date().toISOString(),
      }, ...prev]);
      setInputValue('');
      return;
    }

    // Real insert
    const { data, error } = await supabase
      .from('comments')
      .insert({ post_id: postId, user_id: userId, content: inputValue })
      .select('*, user:profiles(username, display_name)')
      .single();

    if (!error && data) {
      setComments(prev => [data, ...prev]);
    }
    setInputValue('');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 200 }} onClick={onClose}>
      <div
        className="animate-slideUp"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          maxWidth: 480, margin: '0 auto', height: '60vh',
          borderRadius: '24px 24px 0 0', backgroundColor: 'rgba(20,20,20,0.95)',
          backdropFilter: 'blur(40px)', borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ width: 36, height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, margin: '8px auto 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>Comments ({comments.length})</h2>
          <div onClick={onClose} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', paddingBottom: 80 }}>
          {loading && (
            <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>Loading...</p>
          )}
          {comments.map((comment, idx) => (
            <div key={comment.id} style={{ display: 'flex', gap: 12, marginBottom: 16, borderBottom: idx < comments.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', paddingBottom: idx < comments.length - 1 ? 16 : 0 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'var(--surface-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', fontWeight: 'bold', fontSize: 14, flexShrink: 0 }}>
                {comment.user?.username?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 'bold', color: 'var(--text-primary)' }}>{comment.user?.username || 'user'}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{timeAgo(comment.created_at)}</span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(20,20,20,0.95)', display: 'flex', gap: 12, alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{ flex: 1, height: 40, padding: '0 16px', backgroundColor: 'var(--surface)', borderRadius: 999, border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}
          />
          <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
