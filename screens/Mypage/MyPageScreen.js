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
import Container from '../Container';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://ceprj.gachon.ac.kr:60023';

const LEVELS = [
  { key: '1', label: '새싹', icon: 'user', minPosts: 0 },
  { key: '2', label: '연습생', icon: 'smile', minPosts: 3 },
  { key: '3', label: '필사러', icon: 'book', minPosts: 10 },
  { key: '4', label: '디자이너', icon: 'edit', minPosts: 20 },
  { key: '5', label: '마스터', icon: 'award', minPosts: 30 },
];

const MyPageScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [level, setLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoadError, setImageLoadError] = useState(false);

  const fetchProfileAndBadges = async () => {
    try {
      const [profileRes, badgeRes] = await Promise.all([
        fetch(`${BASE_URL}/api/mypage/profile`, { credentials: 'include' }),
        fetch(`${BASE_URL}/api/mypage/badges/my`, { credentials: 'include' })
      ]);

      const profileJson = await profileRes.json();
      const badgeJson = await badgeRes.json();

      console.log('📦 프로필 응답:', profileJson);
      console.log('📦 뱃지 응답:', badgeJson);

      if (profileJson.status !== 0 && profileJson.status !== 200) {
        throw new Error(`프로필 조회 실패: ${profileJson.message}`);
      }

      if (badgeJson.status !== 0 && badgeJson.status !== 200) {
        throw new Error(`뱃지 조회 실패: ${badgeJson.message}`);
      }

      const profileData = profileJson.data;
      const postCount = badgeJson.data.length;
      const currentLevel = LEVELS.slice().reverse().find(l => postCount >= l.minPosts);

      setProfile(profileData);
      setLevel(currentLevel);

      // ✅ 프로필 이미지 정보 저장
      await AsyncStorage.setItem('user_profile_image', profileData.profileImage || '');
    } catch (e) {
      console.error('❌ 데이터 로딩 에러:', e);
      Alert.alert('에러', e.message || '프로필/레벨 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndBadges();
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
              imageLoadError || !profile.profileImage
                ? require('../../assets/profile.png')
                : {
                    uri: `${BASE_URL}/profiles/${profile.profileImage.replace(/^.*[\\/]/, '')}?v=${Date.now()}`
                  }
            }
            style={styles.avatar}
            onError={() => {
              console.log('프로필 이미지 로드 실패');
              setImageLoadError(true);
            }}
            resizeMode="cover"
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{profile.nickname}</Text>
            <Text style={styles.userEmail}>{profile.email}</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#888" />
        </TouchableOpacity>

        {level && (
          <TouchableOpacity
            style={styles.levelCard}
            onPress={() => navigation.navigate('LevelInfo')}
          >
            <Icon name={level.icon} size={20} color="#3cb371" />
            <Text style={styles.levelText}>{`Level.${level.key} ${level.label}`}</Text>
            <Icon name="info" size={16} color="#888" style={styles.infoButton} />
          </TouchableOpacity>
        )}

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
  content: { padding: 16, paddingBottom: 120 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  profileInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  userEmail: { fontSize: 12, color: '#666' },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef1ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  levelText: { flex: 1, fontSize: 14, color: '#333', marginLeft: 8 },
  infoButton: { padding: 4 },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  menuIcon: { marginRight: 12 },
  menuLabel: { fontSize: 14, color: '#333' },
  menuChevron: { marginLeft: 'auto' },
});

export default MyPageScreen;
