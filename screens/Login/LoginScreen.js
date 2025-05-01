// screens/Login/LoginScreen.js
import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import Container from '../Container';

const LoginScreen = ({ navigation }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  return (
    <Container title="Log In">
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
          <Text style={styles.subText}>나의 손글씨를 다양하게 사용해봐요</Text>

          <TextInput
            style={styles.input}
            placeholder="ID"
            placeholderTextColor="#666"
            value={id}
            onChangeText={setId}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0, backgroundColor: 'transparent' }]}
              placeholder="Password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureText}
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)}>
              <Icon
                name={secureText ? 'eye-off' : 'eye'}
                size={20}
                color="#666"
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('SetPassword')}
            style={{ alignSelf: 'flex-end', marginBottom: 30 }}
          >
            <Text style={styles.linkText}>Forget Password</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.loginText}>Log In</Text>
        </TouchableOpacity>

        <Text style={styles.signupText}>
          Don’t have an account?
          <Text
            style={styles.signUpLink}
            onPress={() => navigation.navigate('Register')}
          >
            {' '}Sign Up
          </Text>
        </Text>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: 20 },
  welcome: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  subText: { fontSize: 13, color: '#666', marginBottom: 30 },
  input: { backgroundColor: '#eee', borderRadius: 8, padding: 14, marginBottom: 20 },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingRight: 14,
    marginBottom: 10,
  },
  eyeIcon: { marginLeft: 10 },
  linkText: { color: '#000', fontSize: 12 },
  footer: { paddingHorizontal: 20, paddingBottom: 30 },
  loginButton: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  loginText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  signupText: { fontSize: 12, alignSelf: 'center' },
  signUpLink: { color: 'blue' },
});

export default LoginScreen;
