import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Animated as RNAnimated,
  Dimensions,
} from 'react-native';
import GlassView from './GlassView';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../constants/theme';
import { DEMO_TRACKS } from '../constants/mockData';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SearchModal({ visible, onClose, onSelectTrack }) {
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? DEMO_TRACKS.filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.artist.toLowerCase().includes(query.toLowerCase()) ||
          t.genre.toLowerCase().includes(query.toLowerCase())
      )
    : DEMO_TRACKS;

  const renderResult = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => {
        if (onSelectTrack) onSelectTrack(item);
        onClose();
      }}
      activeOpacity={0.7}
    >
      <Ionicons name="musical-note" size={20} color={COLORS.accent} />
      <View style={styles.resultText}>
        <Text style={styles.resultTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.resultArtist} numberOfLines={1}>
          {item.artist} · {item.genre}
        </Text>
      </View>
      {item.isDemo && (
        <View style={styles.demoBadge}>
          <Text style={styles.demoBadgeText}>SAMPLE</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <GlassView intensity={30} style={styles.backdrop} fallbackColor="rgba(0, 0, 0, 0.85)">
        <View style={styles.container}>
          {/* Search bar */}
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={COLORS.textTertiary} />
            <TextInput
              style={styles.input}
              placeholder="Search songs, artists..."
              placeholderTextColor={COLORS.textTertiary}
              value={query}
              onChangeText={setQuery}
              autoFocus
              selectionColor={COLORS.accent}
            />
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Results */}
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={renderResult}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No results found</Text>
            }
          />
        </View>
      </GlassView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  container: {
    flex: 1,
    paddingTop: 60,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    padding: 0,
  },
  cancelText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.accent,
  },
  listContent: {
    padding: SPACING.lg,
    gap: SPACING.xs,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.03)',
    gap: SPACING.md,
  },
  resultText: {
    flex: 1,
  },
  resultTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  resultArtist: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  demoBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  demoBadgeText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.accent,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginTop: 60,
  },
});
