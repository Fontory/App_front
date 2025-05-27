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
  Alert,
} from 'react-native';
import Container from '../Container';

const BASE_URL = 'http://ceprj.gachon.ac.kr:60023';

const SetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const emailAnim = useRef(new Animated.Value(30)).current;
  const [step, setStep] = useState(0); // 0: email, 1: id 입력

  const handleNext = async () => {
    if (step === 0) {
      if (!email) return Alert.alert('이메일을 입력해주세요.');
      setStep(1);
      Animated.timing(emailAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      if (!userId) return Alert.alert('사용자 ID를 입력해주세요.');

      try {
        const res = await fetch(`${BASE_URL}/users/findId`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const json = await res.json();

        if (json.userId !== userId) {
          throw new Error('입력한 이메일과 ID가 일치하지 않습니다.');
        }

        // 검증 성공 → 비밀번호 재설정 화면으로 이동
        navigation.navigate('ResetPassword', { email, userId });
      } catch (err) {
        console.error('검증 실패:', err);
        Alert.alert(err.message || '서버 오류');
      }
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
        >
          <Text style={styles.welcome}>비밀번호 재설정</Text>
          <Text style={styles.subText}>가입 시 입력한 이메일과 ID를 입력해주세요.</Text>

          <Animated.View style={{ transform: [{ translateY: emailAnim }] }}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </Animated.View>

          {step >= 1 && (
            <TextInput
              style={styles.input}
              placeholder="User ID"
              placeholderTextColor="#666"
              value={userId}
              onChangeText={setUserId}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={handleNext} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>{step === 0 ? 'Next' : '확인'}</Text>
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
