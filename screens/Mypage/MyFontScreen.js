import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Container from '../Container';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://ceprj.gachon.ac.kr:60023';

const MyFontScreen = () => {
  const navigation = useNavigation();
  const [fonts, setFonts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userStr = await AsyncStorage.getItem('user');
        const image = await AsyncStorage.getItem('user_profile_image'); // ✅ 프로필 이미지 불러오기

        if (userStr) {
          const user = JSON.parse(userStr);
          setCurrentUser({ ...user, profileImage: image || null }); // ✅ profileImage 포함 저장

          const response = await fetch(`${BASE_URL}/api/mypage/fonts/my`, {
            credentials: 'include',
          });
          const result = await response.json();

          if (result.status === 200 && result.data) {
            setFonts(result.data);
          } else {
            Alert.alert('에러', result.message || '폰트 불러오기 실패');
          }
        }
      } catch (e) {
        console.error('폰트 불러오기 오류', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getFullUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const renderImageUri = (fontId, description) => {
    return `${BASE_URL}/fonts/${fontId}/render?text=${encodeURIComponent(description)}`;
  };

  if (loading) {
    return (
      <Container title="My Font" hideBackButton showBottomBar>
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 40 }} />
      </Container>
    );
  }

  return (
    <Container title="My Font" hideBackButton={false} showBottomBar={true}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {fonts.map((font) => (
          <TouchableOpacity
            key={font.fontId}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate('FontDetail', {
                font: {
                  ...font,
                  fontName: font.fontName || font.name,
                  creatorId: currentUser?.userId ?? '',
                  creatorProfileImage: currentUser?.profileImage
                    ? `profiles/${currentUser.profileImage}`
                    : null,
                  // ✅ 포함
                }
              });
            }}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.fontName}>{font.fontName || font.name}</Text>
              {font.isPublic === 'Y' ? (
                <View style={styles.likeBadge}>
                  <Icon name="heart" size={14} color="#D0021B" />
                  <Text style={styles.likeText}>{font.likeCount}</Text>
                </View>
              ) : (
                <View style={styles.privateBadge}>
                  <Text style={styles.privateText}>비공개</Text>
                </View>
              )}
            </View>

            <Image
              source={{ uri: renderImageUri(font.fontId, font.description) }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  scroll: {
    padding: 16,
    paddingBottom: 32 + 56 + 32, // 하단 바 + 마진
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fontName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  likeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEEEEE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  likeText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#D0021B',
    fontWeight: '600',
  },
  privateBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#888',
  },
  privateText: {
    fontSize: 12,
    color: '#888',
  },
  previewImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
});

export default MyFontScreen;
