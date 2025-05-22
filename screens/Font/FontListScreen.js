import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Container from '../Container';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://ceprj.gachon.ac.kr:60023';

const FontListScreen = () => {
  const navigation = useNavigation();
  const [fontList, setFontList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [likes, setLikes] = useState({});
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState('popular');
  const [currentUser, setCurrentUser] = useState(null);

  const getFullImageUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const loadUserFromStorage = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      }
    } catch (e) {
      console.error('❌ 유저 정보 로딩 실패:', e);
    }
  };

  const fetchFonts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/fonts`);
      const data = await response.json();
      setFontList(data);

      const likeMap = {};
      data.forEach(font => {
        if (font.fontId != null) {
          likeMap[font.fontId] = !!font.liked;
        }
      });
      setLikes(likeMap);
    } catch (err) {
      console.error('폰트 데이터를 불러오지 못했습니다:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserFromStorage();
    fetchFonts();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchFonts(); // 다시 들어올 때마다 최신 상태로 갱신
    });

    return unsubscribe;
  }, [navigation]);


  const sortedFonts = [...fontList].sort((a, b) => {
    return sortType === 'popular'
      ? b.likeCount - a.likeCount
      : new Date(b.createdAt) - new Date(a.createdAt);
  });

  const filteredFonts = sortedFonts.filter(font =>
    !searchText || font.fontName?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleLikeToggle = async (fontId) => {
    if (!currentUser?.userId) {
      Alert.alert('로그인 필요', '좋아요를 누르려면 먼저 로그인해야 합니다.');
      return;
    }

    const isLiked = likes[fontId];
    const url = `${BASE_URL}/fonts/${fontId}/like?userId=${currentUser.userId}`;
    const method = isLiked ? 'DELETE' : 'POST';

    try {
      const res = await fetch(url, { method });
      if (res.ok) {
        setLikes(prev => ({ ...prev, [fontId]: !isLiked }));
        setFontList(prev =>
          prev.map(font =>
            font.fontId === fontId
              ? { ...font, likeCount: font.likeCount + (isLiked ? -1 : 1) }
              : font
          )
        );
      } else {
        const msg = await res.text();
        Alert.alert('서버 오류', msg);
      }
    } catch (err) {
      console.error('좋아요 요청 실패:', err);
      Alert.alert('네트워크 오류', '요청 처리 중 문제가 발생했습니다.');
    }
  };

  const renderFontCard = ({ item }) => {
    const isLiked = likes[item.fontId] ?? false;
    const renderImageUri = `${BASE_URL}/fonts/${item.fontId}/render?text=${encodeURIComponent(item.description)}`;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate('FontDetail', {
            font: {
              ...item,
              liked: likes[item.fontId], // ✅ 최신 liked 상태 반영
            },
            onLikeToggle: (fontId, newLiked) => {
              setLikes(prev => ({ ...prev, [fontId]: newLiked }));
              setFontList(prev =>
                prev.map(font =>
                  font.fontId === fontId
                    ? { ...font, likeCount: font.likeCount + (newLiked ? 1 : -1) }
                    : font
                )
              );
            }
          })
        }
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Image
              source={{ uri: `${getFullImageUrl(item.creatorProfileImage)}?v=${Date.now()}` }}
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
              <Text style={{ fontSize: 18, color: isLiked ? 'red' : '#aaa' }}>
                {isLiked ? '♥' : '♡'} {item.likeCount}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Container title="Font List" hideBackButton={true} showBottomBar={true}>
      <View style={styles.topBar}>
        <View style={styles.sortToggle}>
          <TouchableOpacity
            style={[styles.sortButton, sortType === 'popular' && styles.sortSelected]}
            onPress={() => setSortType('popular')}
          >
            <Text style={sortType === 'popular' ? styles.sortTextSelected : styles.sortText}>인기순</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortType === 'latest' && styles.sortSelected]}
            onPress={() => setSortType('latest')}
          >
            <Text style={sortType === 'latest' ? styles.sortTextSelected : styles.sortText}>최신순</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="폰트를 검색해보세요"
          style={styles.searchBox}
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.uploadText}>+ 내 폰트 등록</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredFonts}
          keyExtractor={item => item.fontId.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={renderFontCard}
        />
      )}
    </Container>
  );
};

export default FontListScreen;

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  sortToggle: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#aaa',
    marginRight: 10,
  },
  sortSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  sortText: {
    color: '#555',
    fontSize: 13,
  },
  sortTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  searchBox: {
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  uploadButton: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007aff',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
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
    marginTop: 0,
    borderRadius: 6,
    alignSelf: 'flex-start',
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
    marginTop: 0,
  },
});
