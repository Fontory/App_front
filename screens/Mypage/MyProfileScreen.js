import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Container from '../Container';

const BASE_URL = 'http://ceprj.gachon.ac.kr:60023';

const MyProfileScreen = ({ navigation }) => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/mypage/profile`);
        const json = await res.json();
        console.log('프로필 데이터:', json);

        if (json.status !== 0 && json.status !== 200) {
          throw new Error(json.message);
        }

        const data = json.data;
        setNickname(data.nickname);
        setEmail(data.email);
        setProfileImage(data.profileImage);
        setName(data.name); 
        setPhone(data.phone);  
      } catch (err) {
        Alert.alert('프로필 조회 실패', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    try {
      const payload = {
        nickname,
        email,
        profileImage,
        name,
        phone
      };

      const res = await fetch(`${BASE_URL}/api/mypage/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.status !== 0 && json.status !== 200) {
        throw new Error(json.message);
      }

      Alert.alert('프로필이 성공적으로 수정되었습니다.');
      navigation.navigate('MyPage');
    } catch (err) {
      Alert.alert('수정 실패', err.message || '서버 오류');
    }
  };

  const handleAvatarPress = () => {
    Alert.alert('📸 아직 이미지 변경 기능은 구현되어 있지 않습니다.');
  };

  if (loading) {
    return (
      <Container title="My Profile" hideBackButton={false} showBottomBar={true}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </Container>
    );
  }

  return (
    <Container title="My Profile" hideBackButton={false} showBottomBar={true}>
      <View style={styles.inner}>
        {/* 프로필 이미지 */}
        <View style={styles.avatarWrapper}>
          <Image
            source={
              imageLoadError || !profileImage
                ? require('../../assets/profile.png')
                : {
                    uri: `${BASE_URL}${
                      profileImage.startsWith('/uploads')
                        ? profileImage
                        : `/uploads/profiles/${profileImage}`
                    }`,
                  }
            }
            style={styles.avatarPlaceholder}
            onError={(e) => {
              console.log('❌ 이미지 로딩 에러:', e.nativeEvent);
              setImageLoadError(true);
            }}
          />


          <TouchableOpacity style={styles.avatarEditButton} onPress={handleAvatarPress}>
            <Icon name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* 입력 폼 */}
        <View style={styles.form}>
          {/* 닉네임 */}
          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
            placeholder="닉네임"
          />
          {/* 이메일 */}
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="이메일"
          />
          {/* 이름 (읽기 전용) */}
          <TextInput
            style={styles.input}
            value={name}
            editable={false}
            placeholder="이름"
          />
          {/* 전화번호 (읽기 전용) */}
          <TextInput
            style={styles.input}
            value={phone}
            editable={false}
            placeholder="전화번호"
            keyboardType="phone-pad"
          />
        </View>

        {/* 제출 버튼 */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>프로필 저장</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
