// screens/Mypage/MyPageScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Container from '../Container';

const MyPageScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 앱 내에 저장된 로그인 사용자 정보(테스트용)
  const loadLocalProfile = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const userObj = JSON.parse(userStr);
        setProfile({
          nickname: userObj.nickname,
          email: userObj.email,
          profileImage: userObj.profileImage,
        });
        return true;
      }
      return false;
    } catch (e) {
      console.error('로컬 프로필 로드 에러', e);
      return false;
    }
  };

  // 서버에서 프로필 조회 (userId 파라미터 기반) - 백엔드 미구현 시 주석 처리 가능
  const fetchRemoteProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('사용자 정보가 없어 프로필을 불러올 수 없습니다.');

      const BASE_URL = 'http://ceprj.gachon.ac.kr:60023';
      const res = await fetch(`${BASE_URL}/api/mypage/profile?userId=${encodeURIComponent(userId)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || '프로필 조회 실패');
      setProfile(json.data);
    } catch (e) {
      console.error('원격 프로필 조회 에러', e);
      Alert.alert('Error', e.message);
    }
  };

  useEffect(() => {
    (async () => {
      const localLoaded = await loadLocalProfile();
      if (!localLoaded) {
        await fetchRemoteProfile();
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <Container title="My Page" hideBackButton showBottomBar>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container title="My Page" hideBackButton showBottomBar>
        <View style={styles.loaderContainer}>
          <Text>프로필 정보가 없습니다.</Text>
        </View>
      </Container>
    );
  }

  return (
    <Container title="My Page" hideBackButton showBottomBar>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity
          style={styles.profileCard}
          onPress={() => navigation.navigate('MyProfile')}
        >
          <Image
            source={
              profile.profileImage
                ? { uri: profile.profileImage }
                : require('../../assets/profile.png')
            }
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{profile.nickname}</Text>
            <Text style={styles.userEmail}>{profile.email}</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#888" />
        </TouchableOpacity>

        <View style={styles.levelCard}>
          <Icon name="seedling" size={20} color="#3cb371" />
          <Text style={styles.levelText}>Level.1 새싹</Text>
          <TouchableOpacity style={styles.infoButton} onPress={() => navigation.navigate('LevelInfo')}>
            <Icon name="info" size={16} color="#888" />
          </TouchableOpacity>
        </View>

        <View style={styles.menuCard}>
          {[
            { icon: 'star', label: '내가 만든 폰트', onPress: () => navigation.navigate('MyFont') },
            { icon: 'heart', label: '관심 폰트', onPress: () => navigation.navigate('LikeFont') },
            { icon: 'download', label: '다운 받은 폰트', onPress: () => navigation.navigate('SaveFont') },
            { icon: 'file-text', label: '내 게시물', onPress: () => navigation.navigate('MyBoard') },
            { icon: 'book', label: '내 연습장', onPress: () => navigation.navigate('MyNoteBook') },
            { icon: 'log-out', label: '로그아웃', onPress: () => navigation.navigate('Welcome') },
          ].map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.menuItem, idx === 5 && { borderBottomWidth: 0 }]}
              onPress={item.onPress}
            >
              <Icon name={item.icon} size={20} color="#333" style={styles.menuIcon} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Icon name="chevron-right" size={16} color="#888" style={styles.menuChevron} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 16, paddingBottom: 32 + 56 + 32 },
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eee', borderRadius: 8, padding: 16, marginBottom: 16 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  profileInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  userEmail: { fontSize: 12, color: '#666' },
  levelCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eef1ff', borderRadius: 8, padding: 16, marginBottom: 16 },
  levelText: { flex: 1, fontSize: 14, color: '#333', marginLeft: 8 },
  infoButton: { padding: 4 },
  menuCard: { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#eee' },
  menuIcon: { marginRight: 12 },
  menuLabel: { fontSize: 14, color: '#333' },
  menuChevron: { marginLeft: 'auto' },
});

export default MyPageScreen;
