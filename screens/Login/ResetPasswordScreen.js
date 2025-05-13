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
import Container from '../Container';

const BASE_URL = 'http://ceprj.gachon.ac.kr:60023';

const ResetPasswordScreen = ({ route, navigation }) => {
  const { email, userId } = route.params;

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [secure1, setSecure1] = useState(true);
  const [secure2, setSecure2] = useState(true);

  const handleSubmit = async () => {
    if (!password || !confirm) {
      return Alert.alert('비밀번호를 모두 입력해주세요.');
    }
    if (password !== confirm) {
      return Alert.alert('비밀번호가 일치하지 않습니다.');
    }

    try {
      const res = await fetch(`${BASE_URL}/users/findPassword`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          email,
          newPassword: password,
        }),
      });

      const json = await res.json();
      console.log('서버 응답:', json);

      if (!res.ok) {
        throw new Error('서버 연결에 실패했습니다.');
      }

      if (json.status !== 0 && !json.message?.includes('성공')) {
        throw new Error(json.message || '비밀번호 재설정 실패');
      }

      Alert.alert('비밀번호가 성공적으로 변경되었습니다.');
      navigation.replace('Login');
    } catch (err) {
      console.error('비밀번호 재설정 실패:', err);
      Alert.alert(err.message || '서버 오류');
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
          <Text style={styles.welcome}>비밀번호 재설정</Text>
          <Text style={styles.subText}>새 비밀번호를 입력하고 확인해주세요.</Text>

          {/* New Password */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0, backgroundColor: 'transparent' }]}
              placeholder="Password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secure1}
            />
            <TouchableOpacity onPress={() => setSecure1(!secure1)}>
              <Icon
                name={secure1 ? 'eye-off' : 'eye'}
                size={20}
                color="#666"
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0, backgroundColor: 'transparent' }]}
              placeholder="Confirm Password"
              placeholderTextColor="#666"
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry={secure2}
            />
            <TouchableOpacity onPress={() => setSecure2(!secure2)}>
              <Icon
                name={secure2 ? 'eye-off' : 'eye'}
                size={20}
                color="#666"
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>비밀번호 재설정</Text>
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
  input: { backgroundColor: '#eee', borderRadius: 8, padding: 14, marginBottom: 20 },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingRight: 14,
    marginBottom: 20,
  },
  eyeIcon: { marginLeft: 10 },
  footer: { paddingHorizontal: 20, paddingBottom: 30 },
  button: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default ResetPasswordScreen;
