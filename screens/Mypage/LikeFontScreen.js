import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Container from '../Container';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://ceprj.gachon.ac.kr:60023';

const LikeFontScreen = () => {
  const navigation = useNavigation();
  const [likedFonts, setLikedFonts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getFullImageUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `${BASE_URL}/${url.replace(/^\/+/, '')}`;
  };

  const fetchFonts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/fonts`);
      const data = await response.json();

      const likedOnly = data.filter(font => font.liked === true);
      setLikedFonts(likedOnly);
    } catch (err) {
      console.error('폰트 데이터를 불러오지 못했습니다:', err);
      Alert.alert('오류', '좋아요한 폰트를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

const handleLikeToggle = async (fontId) => {
  try {
    const userStr = await AsyncStorage.getItem('user');
    const user = JSON.parse(userStr);
    const userId = user?.userId;

    if (!userId) {
      Alert.alert('에러', '로그인 정보가 없습니다.');
      return;
    }

    const url = `${BASE_URL}/fonts/${fontId}/like?userId=${userId}`;
    const res = await fetch(url, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (res.ok) {
      setLikedFonts(prev => prev.filter(f => f.fontId !== fontId));
    } else {
      const msg = await res.text();
      Alert.alert('에러', msg);
    }
  } catch (err) {
    console.error('좋아요 해제 오류:', err);
    Alert.alert('에러', '좋아요 해제 중 문제가 발생했습니다.');
  }
};



  useEffect(() => {
    fetchFonts();
    const unsubscribe = navigation.addListener('focus', fetchFonts);
    return unsubscribe;
  }, [navigation]);

  const renderFontCard = ({ item }) => {
    const renderImageUri = `${BASE_URL}/fonts/${item.fontId}/render?text=${encodeURIComponent(item.description)}`;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          navigation.navigate('FontDetail', {
            fontId: item.fontId, // ✅ 올바른 변수명
          });
        }}

      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Image
              source={
                item.creatorProfileImage
                  ? { uri: `${getFullImageUrl(item.creatorProfileImage)}?v=${Date.now()}` }
                  : require('../../assets/sampleprofile.png')
              }
              style={styles.avatar}
            />
            <View style={styles.headerText}>
              <Text style={styles.fontName}>{item.fontName}</Text>
              <Text style={styles.nickname}>@{item.creatorId}</Text>
            </View>
            <TouchableOpacity style={styles.arrow}>
              <Text style={{ fontSize: 20, color: '#666' }}>{'>'}</Text>
            </TouchableOpacity>
          </View>

          <Image
            source={{ uri: renderImageUri }}
            style={styles.descriptionImage}
            resizeMode="contain"
          />

          <View style={styles.likeRow}>
            <TouchableOpacity onPress={() => handleLikeToggle(item.fontId)}>
              <Text style={{ fontSize: 18, color: 'red' }}>
                ♥ {item.likeCount}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Container title="관심 폰트" hideBackButton={false} showBottomBar={true}>
      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={likedFonts}
          keyExtractor={item => item.fontId.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={renderFontCard}
        />
      )}
    </Container>
  );
};

export default LikeFontScreen;

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: { flex: 1 },
  fontName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  nickname: {
    fontSize: 13,
    color: '#777',
  },
  arrow: {
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  descriptionImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 4,
    borderRadius: 6,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    backgroundColor: '#ccc',
  },
  likeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
});
