// screens/Login/RegisterScreen.js
import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  View,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import Container from '../Container';

const RegisterScreen = ({ navigation }) => {
  const [checked, setChecked] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [secureText, setSecureText] = useState(true);
  const [form, setForm] = useState({ name: '', id: '', password: '', nickname: '', email: '', mobile: '' });

  return (
    <Container title="New Account">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Profile Image + Full Name (이미지 선택 기능은 제외) */}
          <View style={styles.profileRow}>
            <TouchableOpacity style={styles.profileImageWrapper} onPress={() => { /* 이미지 선택 제거 */ }}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <Icon name="user" size={40} color="#aaa" />
              )}
            </TouchableOpacity>

            <TextInput
              style={styles.fullNameInput}
              placeholder="Full Name"
              placeholderTextColor="#666"
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
            />
          </View>

          {/* ID 입력 */}
          <TextInput
            style={styles.input}
            placeholder="ID"
            placeholderTextColor="#666"
            value={form.id}
            onChangeText={(text) => setForm({ ...form, id: text })}
          />

          {/* Password 입력 */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0, backgroundColor: 'transparent' }]}
              placeholder="Password"
              placeholderTextColor="#666"
              secureTextEntry={secureText}
              value={form.password}
              onChangeText={(text) => setForm({ ...form, password: text })}
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

          {/* 나머지 입력 필드 */}
          {['nickname', 'email', 'mobile'].map((field) => (
            <TextInput
              key={field}
              style={styles.input}
              placeholder={
                field === 'nickname'
                  ? '닉네임'
                  : field.charAt(0).toUpperCase() + field.slice(1)
              }
              placeholderTextColor="#666"
              value={form[field]}
              onChangeText={(text) => setForm({ ...form, [field]: text })}
            />
          ))}

          {/* 약관 동의 */}
          <View style={styles.checkboxRow}>
            <TouchableOpacity
              onPress={() => setChecked(!checked)}
              style={styles.checkbox}
            >
              {checked && <View style={styles.checked} />}
            </TouchableOpacity>
            <Text style={styles.agreeText}>
              By continuing, you agree to{' '}
              <Text style={styles.link} onPress={() => navigation.navigate('Privacy')}>
                Terms of Use
              </Text>{' '}
              and{' '}
              <Text style={styles.link} onPress={() => navigation.navigate('Privacy')}>
                Privacy Policy
              </Text>
              .
            </Text>
          </View>

          {/* 회원가입 버튼 */}
          <TouchableOpacity
            style={[styles.signUpButton, { opacity: checked ? 1 : 0.5 }]}
            disabled={!checked}
            onPress={() => {
              // 회원가입 처리 로직
            }}
          >
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>

          {/* 로그인 이동 링크 */}
          <Text style={styles.bottomText}>
            already have an account?{' '}
            <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
              Log in
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  profileImageWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  fullNameInput: {
    flex: 1,
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 14,
  },
  input: { backgroundColor: '#eee', borderRadius: 8, padding: 14, marginBottom: 16 },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingRight: 14,
    marginBottom: 16,
  },
  eyeIcon: { marginLeft: 10 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: '#aaa', marginRight: 8, alignItems: 'center', justifyContent: 'center' },
  checked: { width: 12, height: 12, backgroundColor: '#000' },
  agreeText: { fontSize: 12, flexShrink: 1, color: '#444' },
  link: { color: '#007bff', textDecorationLine: 'underline' },
  signUpButton: { backgroundColor: '#000', borderRadius: 30, paddingVertical: 14, alignItems: 'center', marginBottom: 20 },
  signUpText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  bottomText: { fontSize: 12, alignSelf: 'center' },
  loginLink: { color: 'blue' },
});

export default RegisterScreen;
