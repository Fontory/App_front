// screens/Login/SetPasswordScreen.js
import React, { useState, useRef } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import Container from '../Container';

const SetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const emailAnim = useRef(new Animated.Value(30)).current;

  const handleSendEmail = () => {
    if (!sent) {
      setSent(true);
      Animated.timing(emailAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      navigation.navigate('ResetPassword');
    }
  };

  return (
    <Container title="Set Password">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.welcome}>Welcome</Text>
          <Text style={styles.subText}>소개소개소개</Text>

          <Animated.View style={{ transform: [{ translateY: emailAnim }] }}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
            />
          </Animated.View>

          {sent && (
            <TextInput
              style={[styles.input, { marginTop: 20 }]}
              placeholder="Verification Code"
              placeholderTextColor="#666"
              value={code}
              onChangeText={setCode}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={handleSendEmail} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>{sent ? 'Next' : 'Send Email'}</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 20 },
  welcome: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  subText: { fontSize: 13, color: '#666', marginBottom: 30 },
  input: { backgroundColor: '#eee', borderRadius: 8, padding: 14, marginBottom: 10 },
  footer: { paddingHorizontal: 20, paddingBottom: 30 },
  sendButton: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
  },
  sendButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default SetPasswordScreen;
