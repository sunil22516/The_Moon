import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';

export default function UploadScreen() {
  const [title, setTitle] = useState('');
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
    if (!title || !audioFile) return Alert.alert('Add a title and pick an audio file');
    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const ts = Date.now();

      // upload audio
      const audioExt = audioFile.name.split('.').pop();
      const audioPath = `${user.id}/${ts}.${audioExt}`;
      const audioResponse = await fetch(audioFile.uri);
      const audioBlob = await audioResponse.blob();
      const { error: audioErr } = await supabase.storage.from('audio').upload(audioPath, audioBlob, {
        contentType: audioFile.mimeType || 'audio/mpeg',
      });
      if (audioErr) throw audioErr;
      const { data: audioUrlData } = supabase.storage.from('audio').getPublicUrl(audioPath);

      // upload cover (optional)
      let coverUrl = null;
      if (coverUri) {
        const coverPath = `${user.id}/${ts}.jpg`;
        const coverResponse = await fetch(coverUri);
        const coverBlob = await coverResponse.blob();
        const { error: coverErr } = await supabase.storage.from('covers').upload(coverPath, coverBlob, {
          contentType: 'image/jpeg',
        });
        if (coverErr) throw coverErr;
        coverUrl = supabase.storage.from('covers').getPublicUrl(coverPath).data.publicUrl;
      }

      // insert row - starts unapproved until you review it
      const { error: insertErr } = await supabase.from('tracks').insert({
        title,
        uploader_id: user.id,
        audio_url: audioUrlData.publicUrl,
        cover_url: coverUrl,
        approved: false,
      });
      if (insertErr) throw insertErr;

      Alert.alert('Uploaded', 'Your track is in for review, it will show up in the feed once approved.');
      setTitle('');
      setAudioFile(null);
      setCoverUri(null);
    } catch (e) {
      Alert.alert('Upload failed', e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upload a track</Text>

      <TextInput
        style={styles.input}
        placeholder="Track title"
        placeholderTextColor="#666"
        value={title}
        onChangeText={setTitle}
      />

      <TouchableOpacity style={styles.pickButton} onPress={pickAudio}>
        <Text style={styles.pickText}>{audioFile ? audioFile.name : 'Choose audio file'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.pickButton} onPress={pickCover}>
        <Text style={styles.pickText}>{coverUri ? 'Cover selected' : 'Choose cover art (optional)'}</Text>
      </TouchableOpacity>
      {coverUri && <Image source={{ uri: coverUri }} style={styles.preview} />}

      <TouchableOpacity style={styles.uploadButton} onPress={upload} disabled={uploading}>
        <Text style={styles.uploadText}>{uploading ? 'Uploading...' : 'Upload'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 24, paddingTop: 60 },
  header: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 24 },
  input: {
    backgroundColor: '#111', color: '#fff', borderRadius: 10, padding: 14,
    marginBottom: 12, borderWidth: 1, borderColor: '#222',
  },
  pickButton: {
    backgroundColor: '#111', borderRadius: 10, padding: 14, marginBottom: 12,
    borderWidth: 1, borderColor: '#222',
  },
  pickText: { color: '#ccc' },
  preview: { width: 80, height: 80, borderRadius: 8, marginBottom: 12 },
  uploadButton: { backgroundColor: '#8b5cf6', borderRadius: 10, padding: 15, marginTop: 12 },
  uploadText: { color: '#fff', textAlign: 'center', fontWeight: '600', fontSize: 16 },
});
