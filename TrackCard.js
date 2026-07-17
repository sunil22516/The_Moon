import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { supabase } from '../lib/supabase';

export default function TrackCard({ track, userId, onLikeChange }) {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(track.liked_by_me);
  const [likeCount, setLikeCount] = useState(track.like_count || 0);

  useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  const togglePlay = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
      return;
    }
    const { sound: newSound } = await Audio.Sound.createAsync({ uri: track.audio_url }, { shouldPlay: true });
    setSound(newSound);
    setIsPlaying(true);
  };

  const toggleLike = async () => {
    if (liked) {
      await supabase.from('likes').delete().eq('track_id', track.id).eq('user_id', userId);
      setLikeCount((c) => c - 1);
    } else {
      await supabase.from('likes').insert({ track_id: track.id, user_id: userId });
      setLikeCount((c) => c + 1);
    }
    setLiked(!liked);
    if (onLikeChange) onLikeChange();
  };

  return (
    <View style={styles.card}>
      {track.cover_url ? (
        <Image source={{ uri: track.cover_url }} style={styles.cover} />
      ) : (
        <View style={[styles.cover, styles.coverPlaceholder]} />
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{track.title}</Text>
        <Text style={styles.meta}>{likeCount} likes</Text>
      </View>
      <TouchableOpacity onPress={togglePlay} style={styles.iconButton}>
        <Text style={styles.icon}>{isPlaying ? '⏸' : '▶'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleLike} style={styles.iconButton}>
        <Text style={[styles.icon, liked && styles.iconLiked]}>{liked ? '♥' : '♡'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#0d0d0d',
    borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#1a1a1a',
  },
  cover: { width: 48, height: 48, borderRadius: 8, marginRight: 12 },
  coverPlaceholder: { backgroundColor: '#222' },
  info: { flex: 1 },
  title: { color: '#fff', fontSize: 15, fontWeight: '600' },
  meta: { color: '#888', fontSize: 12, marginTop: 2 },
  iconButton: { paddingHorizontal: 8 },
  icon: { color: '#ccc', fontSize: 20 },
  iconLiked: { color: '#ec4899' },
});
