// screens/Font/FontListScreen.js
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
} from 'react-native';
import Container from '../Container';
import { useNavigation } from '@react-navigation/native';

const FontListScreen = () => {
  const navigation = useNavigation();
  const [fontList, setFontList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [likes, setLikes] = useState({});
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState('popular'); // ⭐ 정렬 상태 추가

  // ✅ 폰트 목록 요청
  const fetchFonts = async () => {
    try {
      const response = await fetch('http://ceprj.gachon.ac.kr:60023/fonts');
      const data = await response.json();
      setFontList(data);
    } catch (err) {
      console.error('폰트 데이터를 불러오지 못했습니다:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFonts();
  }, []);

  // ✅ 정렬 적용
  const sortedFonts = [...fontList].sort((a, b) => {
    if (sortType === 'popular') {
      return b.likeCount - a.likeCount;
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const filteredFonts = sortedFonts.filter(font =>
    font.name?.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleLikeToggle = (id) => {
    setLikes(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderFontCard = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate('FontDetail', { font: item })}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <Image
            source={
              item.originalImageUrl
                ? { uri: item.originalImageUrl }
                : require('../../assets/sampleprofile.png')
            }
            style={styles.avatar}
          />
          <View style={styles.headerText}>
            <Text style={styles.fontName}>{item.name}</Text>
            <Text style={styles.nickname}>@{item.userId}</Text>
          </View>
          <TouchableOpacity style={styles.arrow}>
            <Text style={{ fontSize: 20, color: '#666' }}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.description}>{item.description}</Text>

        <TouchableOpacity
          style={styles.heart}
          onPress={() => handleLikeToggle(item.fontId)}
        >
          <Text
            style={{
              color: likes[item.fontId] ? 'red' : '#aaa',
              fontSize: 18,
            }}
          >
            {likes[item.fontId] ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

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
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 16,
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
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  heart: {
    alignSelf: 'flex-end',
    marginTop: 12,
    paddingHorizontal: 4,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    backgroundColor: '#ccc',
  },
});
