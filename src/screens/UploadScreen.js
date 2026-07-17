import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../lib/supabase';
import { COLORS, GRADIENTS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';

export default function UploadScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [coverUri, setCoverUri] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickAudio = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
    if (result.canceled) return;
    setAudioFile(result.assets[0]);
  };

  const pickCover = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (result.canceled) return;
    setCoverUri(result.assets[0].uri);
  };

  const upload = async () => {
    if (!title || !audioFile) {
      return Alert.alert('Missing info', 'Add a title and pick an audio file');
    }
    setUploading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const ts = Date.now();

      // Upload audio
      const audioExt = audioFile.name.split('.').pop();
      const audioPath = `${user.id}/${ts}.${audioExt}`;
      const audioResponse = await fetch(audioFile.uri);
      const audioBlob = await audioResponse.blob();
      const { error: audioErr } = await supabase.storage
        .from('audio')
        .upload(audioPath, audioBlob, {
          contentType: audioFile.mimeType || 'audio/mpeg',
        });
      if (audioErr) throw audioErr;
      const { data: audioUrlData } = supabase.storage
        .from('audio')
        .getPublicUrl(audioPath);

      // Upload cover (optional)
      let coverUrl = null;
      if (coverUri) {
        const coverPath = `${user.id}/${ts}.jpg`;
        const coverResponse = await fetch(coverUri);
        const coverBlob = await coverResponse.blob();
        const { error: coverErr } = await supabase.storage
          .from('covers')
          .upload(coverPath, coverBlob, { contentType: 'image/jpeg' });
        if (coverErr) throw coverErr;
        coverUrl = supabase.storage
          .from('covers')
          .getPublicUrl(coverPath).data.publicUrl;
      }

      const { error: insertErr } = await supabase.from('tracks').insert({
        title,
        uploader_id: user.id,
        audio_url: audioUrlData.publicUrl,
        cover_url: coverUrl,
        approved: false,
      });
      if (insertErr) throw insertErr;

      Alert.alert(
        'Uploaded 🎉',
        'Your track is in for review. It will show up once approved.'
      );
      setTitle('');
      setArtist('');
      setAudioFile(null);
      setCoverUri(null);
      if (navigation?.goBack) navigation.goBack();
    } catch (e) {
      Alert.alert('Upload failed', e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation?.goBack?.()}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Upload a Track</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Cover art */}
          <TouchableOpacity style={styles.coverPicker} onPress={pickCover}>
            {coverUri ? (
              <Image source={{ uri: coverUri }} style={styles.coverImage} />
            ) : (
              <View style={styles.coverPlaceholder}>
                <Ionicons name="image-outline" size={40} color={COLORS.textTertiary} />
                <Text style={styles.coverPlaceholderText}>
                  Add cover art
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Title input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Track Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter track title..."
              placeholderTextColor={COLORS.textTertiary}
              value={title}
              onChangeText={setTitle}
              selectionColor={COLORS.accent}
            />
          </View>

          {/* Artist input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Artist Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter artist name..."
              placeholderTextColor={COLORS.textTertiary}
              value={artist}
              onChangeText={setArtist}
              selectionColor={COLORS.accent}
            />
          </View>

          {/* Audio picker */}
          <TouchableOpacity style={styles.audioPicker} onPress={pickAudio}>
            <Ionicons
              name={audioFile ? 'musical-notes' : 'cloud-upload-outline'}
              size={24}
              color={audioFile ? COLORS.accent : COLORS.textTertiary}
            />
            <Text
              style={[
                styles.audioPickerText,
                audioFile && styles.audioPickerTextSelected,
              ]}
            >
              {audioFile ? audioFile.name : 'Choose audio file'}
            </Text>
          </TouchableOpacity>

          {/* Upload button */}
          <TouchableOpacity
            onPress={upload}
            disabled={uploading}
            activeOpacity={0.8}
            style={styles.uploadButtonWrapper}
          >
            <LinearGradient
              colors={uploading ? ['#444', '#333'] : GRADIENTS.accent}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.uploadButton}
            >
              <Text style={styles.uploadButtonText}>
                {uploading ? 'Uploading...' : 'Upload Track'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: { flex: 1 },
  scrollContent: {
    padding: SPACING.xl,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xxl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
  },
  coverPicker: {
    width: 160,
    height: 160,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: SPACING.xxl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    flex: 1,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  coverPlaceholderText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: COLORS.surface,
    color: COLORS.textPrimary,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    ...TYPOGRAPHY.body,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  audioPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    marginBottom: SPACING.xxl,
  },
  audioPickerText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textTertiary,
  },
  audioPickerTextSelected: {
    color: COLORS.accent,
  },
  uploadButtonWrapper: {
    ...SHADOWS.glow,
  },
  uploadButton: {
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  uploadButtonText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
    fontSize: 16,
  },
});
