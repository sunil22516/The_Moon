import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { supabase } from '../lib/supabase';
import TrackCard from '../components/TrackCard';

export default function TrendingScreen() {
  const [tracks, setTracks] = useState([]);
  const [userId, setUserId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUserId(user?.id);

    const { data, error } = await supabase
      .from('tracks')
      .select('*, likes(count)')
      .eq('approved', true);

    if (!error && data) {
      const withCounts = data
        .map((t) => ({ ...t, like_count: t.likes?.[0]?.count || 0 }))
        .sort((a, b) => b.like_count - a.like_count);
      setTracks(withCounts);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Trending</Text>
      <FlatList
        data={tracks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TrackCard track={item} userId={userId} onLikeChange={load} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
        ListEmptyComponent={<Text style={styles.empty}>No likes yet — go like something.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16, paddingTop: 60 },
  header: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 16 },
  empty: { color: '#666', textAlign: 'center', marginTop: 40 },
});
