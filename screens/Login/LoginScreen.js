import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const LoginScreen = ({ navigation }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 고정: 뒤로가기 + 제목 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-left" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Log In</Text>
      </View>

      {/* 입력 영역 */}
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

      {/* 하단 고정 버튼 */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginText}>Log In</Text>
        </TouchableOpacity>

        <Text style={styles.signupText}>
          Don’t have an account?
          <Text
            style={styles.signUpLink}
            onPress={() => navigation.navigate('Register')}>
            {' '}Sign Up
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 20,
  },
  welcome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingRight: 14,
    marginBottom: 10,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  loginButton: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#000',
    fontSize: 12,
  },
  signupText: {
    fontSize: 12,
    alignSelf: 'center',
  },
  signUpLink: {
    color: 'blue',
  },
});

export default LoginScreen;
