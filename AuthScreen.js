import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '../lib/supabase';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) return Alert.alert('Enter email and password');
    setLoading(true);
    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) Alert.alert('Error', error.message);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Moon</Text>
      <Text style={styles.subtitle}>{isSignUp ? 'Create an account' : 'Welcome back'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#666"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Please wait...' : isSignUp ? 'Sign up' : 'Log in'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={styles.toggle}>
          {isSignUp ? 'Already have an account? Log in' : "New here? Sign up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', padding: 24 },
  title: { color: '#fff', fontSize: 40, fontWeight: '700', textAlign: 'center', marginBottom: 4 },
  subtitle: { color: '#999', fontSize: 15, textAlign: 'center', marginBottom: 32 },
  input: {
    backgroundColor: '#111', color: '#fff', borderRadius: 10, padding: 14,
    marginBottom: 12, borderWidth: 1, borderColor: '#222',
  },
  button: { backgroundColor: '#8b5cf6', borderRadius: 10, padding: 15, marginTop: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600', fontSize: 16 },
  toggle: { color: '#888', textAlign: 'center', marginTop: 20 },
});
