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

const DownloadedFontScreen = () => {
  const navigation = useNavigation();
  const [fonts, setFonts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getFullImageUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `${BASE_URL}/profiles/${url.replace(/^\/+/, '')}`;
  };

  const fetchDownloadedFonts = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      const user = JSON.parse(userStr);
      const userId = user?.userId;

      if (!userId) return;

      const res = await fetch(`${BASE_URL}/api/mypage/fonts/downloads?userId=${userId}`);
      const data = await res.json();

      console.log('📥 다운로드 폰트 응답:', data);

      if (data.status === 200) {
        setFonts(data.data);
      } else {
        Alert.alert('오류', '폰트 데이터를 불러오지 못했습니다.');
      }
    } catch (err) {
      console.error('❌ 다운로드 폰트 로딩 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloadedFonts();
    const unsubscribe = navigation.addListener('focus', fetchDownloadedFonts);
    return unsubscribe;
  }, [navigation]);

  const renderFontCard = ({ item }) => {
    const renderImageUri = `${BASE_URL}/fonts/${item.fontId}/render?text=${encodeURIComponent(item.description || '이 폰트에 대한 설명입니다.')}`;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate('FontDetail', {
            font: {
              ...item,
              fontName: item.name, // ✅ 필드 이름 통일
              creatorNickname: item.creatorNickname || '', // ✅ 안전하게 처리
              creatorProfileImage: item.creatorProfileImage?.startsWith('/profiles/')
                ? item.creatorProfileImage
                : `/profiles/${item.creatorProfileImage}`,
              liked: false,
            },
            onLikeToggle: () => {}, // ✅ 좋아요 없음 처리
          })
        }


      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Image
              source={
                item.creatorProfileImage
                  ? { uri: `${BASE_URL}/profiles/${item.creatorProfileImage}` }
                  : require('../../assets/sampleprofile.png')
              }
              style={styles.avatar}
            />
            <View style={styles.headerText}>
            <Text style={styles.fontName}>{item.name}</Text>
            <Text style={styles.nickname}>@{item.creatorId}</Text>
            </View>
            <View style={styles.arrow}><Text style={{ fontSize: 20, color: '#666' }}>{'>'}</Text></View>
          </View>

          <Image
            source={{ uri: renderImageUri }}
            style={styles.descriptionImage}
            resizeMode="contain"
          />

          <View style={styles.likeRow}>
            <Text style={{ fontSize: 18, color: 'red' }}>
              ♥ {item.likeCount}  ↓ {item.downloadCount}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Container title="다운로드한 폰트" hideBackButton={false} showBottomBar={true}>
      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={fonts}
          keyExtractor={item => item.fontId.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={renderFontCard}
        />
      )}
    </Container>
  );
};

export default DownloadedFontScreen;

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
    backgroundColor: '#eee',
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
