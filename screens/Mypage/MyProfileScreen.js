// /screens/Mypage/MyProfileScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Container from '../Container';

const MyProfileScreen = ({ navigation }) => {
  // 예시로 상태관리. 실제로는 context나 redux, 서버 데이터로 채우시면 됩니다.
  const [id, setId] = useState('abcabc');
  const [nickname, setNickname] = useState('버그찾은 구운달걀');
  const [email, setEmail] = useState('abc123@gachon.ac.kr');
  const [phone, setPhone] = useState('010-0000-0000');

  const handleAvatarPress = () => {
    // TODO: 프로필 이미지 변경 로직
    console.log('Change avatar');
  };

  const handleSubmit = () => {
    // TODO: 서버에 수정된 프로필 정보 전송
    console.log({ id, nickname, email, phone });
    navigation.navigate('MyPage');
  };

  return (
    <Container
      title="홍길동 님"
      hideBackButton={false}
      showBottomBar={true}
    >
      <View style={styles.inner}>
        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          {/* 실제로는 <Image source={{ uri: ... }} style={styles.avatar} /> */}
          <View style={styles.avatarPlaceholder} />
          <TouchableOpacity
            style={styles.avatarEditButton}
            onPress={handleAvatarPress}
          >
            <Icon name="paperclip" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Inputs */}
        <View style={styles.form}>
          {/* ID (읽기전용) */}
          <TextInput
            style={styles.input}
            value={id}
            onChangeText={setId}
            editable={false}
          />
          {/* Nickname (수정 가능) */}
          <TextInput
            style={[styles.input, { color: '#666' }]}
            value={nickname}
            onChangeText={setNickname}
            
          />
          {/* Email (읽기전용) */}
          <TextInput
            style={styles.input}
            value={email}
            keyboardType="email-address"
            onChangeText={setEmail}
            editable={false}
          />
          {/* Phone (읽기전용) */}
          <TextInput
            style={styles.input}
            value={phone}
            keyboardType="phone-pad"
            onChangeText={setPhone}
            editable={false}
          />
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  avatarWrapper: {
    marginTop: 24,
    marginBottom: 32,
    position: 'relative',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ddd',
  },
  avatarEditButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    width: '100%',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 60,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyProfileScreen;
