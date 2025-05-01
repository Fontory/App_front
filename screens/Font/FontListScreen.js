// screens/Font/FontListScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Container from '../Container';
import { useNavigation } from '@react-navigation/native';

const sampleFonts = [
  {
    id: '1',
    name: '강부장님체',
    nickname: '강부장',
    profile: require('../../assets/sampleprofile.png'),
    description: '오랫동안 사무실에서 일해 온 강부장의 손글씨입니다.',
  },
  {
    id: '2',
    name: '하루체',
    nickname: '하루',
    profile: require('../../assets/sampleprofile.png'),
    description: '매일 일기를 쓰는 하루의 글씨예요.',
  },
  {
    id: '3',
    name: '윤지체',
    nickname: '윤지',
    profile: require('../../assets/sampleprofile.png'),
    description: '붓펜으로 쓰는 걸 좋아하는 윤지의 손글씨입니다.',
  },
];

const FontListScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [likes, setLikes] = useState({});

  const filteredFonts = sampleFonts.filter(font =>
    font.name.includes(searchText),
  );

  const handleLikeToggle = (id) => {
    setLikes(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
<<<<<<< HEAD
    <Container showBottomBar={true}>
=======
    <Container title="Font List" hideBackButton={true} showBottomBar={true}>
>>>>>>> 785f332 (Initial commit)
      <View style={styles.topBar}>
        <View style={styles.sortToggle}>
          <TouchableOpacity style={[styles.sortButton, styles.sortSelected]}>
            <Text style={styles.sortTextSelected}>인기순</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sortButton}>
            <Text style={styles.sortText}>최신순</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="폰트를 검색해보세요"
          style={styles.searchBox}
          value={searchText}
          onChangeText={setSearchText}
        />
<<<<<<< HEAD
        <TouchableOpacity style={styles.uploadButton}>
=======
        <TouchableOpacity style={styles.uploadButton} onPress={() => navigation.navigate('MyFont')}>
>>>>>>> 785f332 (Initial commit)
          <Text style={styles.uploadText}>+ 내 폰트 등록</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredFonts}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('FontDetail', { font: item })}
          >
            <View style={styles.card}>
              <View style={styles.header}>
                <Image source={item.profile} style={styles.avatar} />
                <View style={styles.headerText}>
                  <Text style={styles.fontName}>{item.name}</Text>
                  <Text style={styles.nickname}>@{item.nickname}</Text>
                </View>
                <TouchableOpacity style={styles.arrow}>
                  <Text style={{ fontSize: 20, color: '#666' }}>{'>'}</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.description}>{item.description}</Text>

              <TouchableOpacity
                style={styles.heart}
                onPress={() => handleLikeToggle(item.id)}
              >
                <Text
                  style={{
                    color: likes[item.id] ? 'red' : '#aaa',
                    fontSize: 18,
                  }}
                >
                  {likes[item.id] ? '♥' : '♡'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
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
