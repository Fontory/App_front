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
  Alert,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Container from '../Container';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import defaultProfile from '../../assets/profile.png';
import RNFS from 'react-native-fs';

const RegisterScreen = ({ navigation }) => {
  const [checked, setChecked] = useState(false);
  const [profileImageUri, setProfileImageUri] = useState(null);
  const [profileImageData, setProfileImageData] = useState(null);
  const [secureText, setSecureText] = useState(true);
  const [form, setForm] = useState({
    name: '',
    id: '',
    password: '',
    nickname: '',
    email: '',
    mobile: '',
  });

  // 백엔드 API 포트는 60023입니다
  const BASE_URL = Platform.OS === 'android'
    ? 'http://ceprj.gachon.ac.kr:60023'
    : 'http://ceprj.gachon.ac.kr:60023';

  const handleChoosePhoto = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.error('ImagePicker Error:', response.errorMessage);
        return;
      }
      const asset = response.assets[0];
      setProfileImageUri(asset.uri);
      setProfileImageData(asset);
    });
  };

  const handleTakePhoto = () => {
    launchCamera({ mediaType: 'photo' }, response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.error('Camera Error:', response.errorMessage);
        return;
      }
      const asset = response.assets[0];
      setProfileImageUri(asset.uri);
      setProfileImageData(asset);
    });
  };

  const handleSignUp = async () => {
    if (!checked) {
      Alert.alert('약관에 동의해주세요.');
      return;
    }
    
    let imageUrl = '';

    // 1. 이미지 업로드
    if (profileImageData) {
      const formData = new FormData();
      formData.append('image', {
        uri: Platform.OS === 'ios'
          ? profileImageData.uri.replace('file://', '')
          : profileImageData.uri,
        type: profileImageData.type || 'image/jpeg',
        name: profileImageData.fileName || 'profile.jpg',
      });

      try {
        const uploadRes = await fetch(`${BASE_URL}/users/profile-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'multipart/form-data' },
          body: formData,
        });

        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok || !uploadJson.imageUrl) {
          throw new Error(uploadJson.message || '이미지 업로드 실패');
        }

        imageUrl = uploadJson.imageUrl;
      } catch (err) {
        console.error('이미지 업로드 에러:', err);
        return Alert.alert('이미지 업로드에 실패했습니다.');
      }
    }

    // 2. 회원가입 요청
    const payload = {
      userId: form.id,
      password: form.password,
      passwordConfirm: form.password,
      name: form.name,
      phone: form.mobile,
      email: form.email,
      nickname: form.nickname,
      profileImage: imageUrl,
    };

    try {
      const res = await fetch(`${BASE_URL}/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || json.status !== 0) throw new Error(json.message || '회원가입 실패');

      Alert.alert('회원가입 성공!');
      navigation.replace('Login');
    } catch (err) {
      console.error('회원가입 에러', err);
      Alert.alert(err.message || '네트워크 요청에 실패했습니다.');
    }
  };

  return (
    <Container title="New Account">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* 프로필 이미지 + 이름 */}
          <View style={styles.profileRow}>
            <TouchableOpacity
              style={styles.profileImageWrapper}
              onPress={() =>
                Alert.alert('프로필 사진 선택', '', [
                  { text: '카메라', onPress: handleTakePhoto },
                  { text: '갤러리', onPress: handleChoosePhoto },
                  { text: '취소', style: 'cancel' },
                ])
              }
            >
              <Image
                source={
                  profileImageUri ? { uri: profileImageUri } : defaultProfile
                }
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.fullNameInput}
              placeholder="Full Name"
              placeholderTextColor="#666"
              value={form.name}
              onChangeText={text => setForm({ ...form, name: text })}
              autoCapitalize="words"
            />
          </View>

          {/* ID */}
          <TextInput
            style={styles.input}
            placeholder="ID"
            placeholderTextColor="#666"
            value={form.id}
            onChangeText={text => setForm({ ...form, id: text })}
          />

          {/* 비밀번호 */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0, backgroundColor: 'transparent' }]}
              placeholder="Password"
              secureTextEntry={secureText}
              value={form.password}
              onChangeText={text => setForm({ ...form, password: text })}
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)}>
              <Icon name={secureText ? 'eye-off' : 'eye'} size={20} color="#666" style={styles.eyeIcon} />
            </TouchableOpacity>
          </View>

          {/* 기타 입력 */}
          {['nickname', 'email', 'mobile'].map(field => (
            <TextInput
              key={field}
              style={styles.input}
              placeholder={
                field === 'nickname' ? 'Nickname' : field.charAt(0).toUpperCase() + field.slice(1)
              }
              placeholderTextColor="#666"
              value={form[field]}
              onChangeText={text => setForm({ ...form, [field]: text })}
            />
          ))}

          {/* 약관동의 */}
          <View style={styles.checkboxRow}>
            <TouchableOpacity onPress={() => setChecked(!checked)} style={styles.checkbox}>
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
              </Text>.
            </Text>
          </View>

          {/* 회원가입 버튼 */}
          <TouchableOpacity
            style={[styles.signUpButton, { opacity: checked ? 1 : 0.5 }]}
            disabled={!checked}
            onPress={handleSignUp}
          >
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>

          {/* 로그인 링크 */}
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
  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
  profileImageWrapper: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' },
  profileImage: { width: 60, height: 60, borderRadius: 30 },
  fullNameInput: { flex: 1, backgroundColor: '#eee', borderRadius: 8, padding: 14 },
  input: { backgroundColor: '#eee', borderRadius: 8, padding: 14, marginBottom: 16 },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eee', borderRadius: 8, paddingRight: 14, marginBottom: 16 },
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
