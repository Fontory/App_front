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
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Container from '../Container';
import axios from 'axios'; // ✅ 추가

const BASE_URL = 'http://ceprj.gachon.ac.kr:60023';

const LoginScreen = ({ navigation }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!id || !password) {
      return Alert.alert('ID와 비밀번호를 모두 입력해주세요.');
    }

    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/users/login`, {
        userId: id,
        password,
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true, // ✅ 세션 쿠키 저장
      });

      console.log('서버 응답:', res.data);

      if (res.status !== 200 || !res.data.user) {
        const msg = res.data.message || '로그인에 실패했습니다.';
        throw new Error(msg);
      }

      await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
      Alert.alert('로그인 성공!');
      navigation.replace('Home');

    } catch (err) {
      console.error('로그인 에러:', err);
      Alert.alert(err.message || '네트워크 요청에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

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
            <Text style={styles.linkText}>Forget Password?</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.loginButton, loading && { opacity: 0.6 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginText}>{loading ? '로그인 중...' : 'Log In'}</Text>
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
