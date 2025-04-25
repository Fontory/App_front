// screens/Board/BoardScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Container from '../Container';

const DUMMY_POSTS = [
  { id: '1', user: '홍길동', text: '오늘은 필사를 했다..' },
  { id: '2', user: '김철수', text: '새로운 글을 남겨봅니다.' },
  { id: '3', user: '김철수', text: '새로운 글을 남겨봅니다.' },
  { id: '4', user: '김철수', text: '새로운 글을 남겨봅니다.' },
];

const BoardScreen = ({ navigation }) => {
  return (
    <Container title="Board">
      <ScrollView contentContainerStyle={styles.wrapper}>
        {/* Quote Card */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>
            “존재하는 것을 변화시키는 것은 성숙하게 만드는 것이다.”
          </Text>
          <Text style={styles.quoteAuthor}>헨리 버그슨</Text>
          <TouchableOpacity style={styles.moreButton} onPress={() => navigation.navigate('QuoteDetail')}>
            <Text style={styles.moreText}>더보기</Text>
          </TouchableOpacity>
        </View>

        {/* Filters Row */}
        <View style={styles.filtersRow}>
          <Icon name="sliders" size={20} color="#444" style={styles.filterIcon} />
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>전체</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>필사</Text>
          </TouchableOpacity>
        </View>

        {/* Post List */}
        {DUMMY_POSTS.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postRow}>
              <View style={styles.thumbnailPlaceholder} />
              <View style={styles.postContent}>
                <View style={styles.postHeader}>
                  <View style={styles.avatarPlaceholder} />
                  <Text style={styles.userName}>{post.user}</Text>
                </View>
                <Text style={styles.postText}>{post.text}</Text>
              </View>
              <TouchableOpacity style={styles.likeIcon}>
                <Icon name="heart" size={20} color="#888" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Floating Write Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('Write')}
      >
        <Text style={styles.floatingText}>글쓰기</Text>
      </TouchableOpacity>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.tabItem}>
          <Icon name="home" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Board')} style={styles.tabItem}>
          <Icon name="list" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Fontlist')} style={styles.tabItem}>
          <Icon name="grid" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Mypage')} style={styles.tabItem}>
          <Icon name="user" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    paddingBottom: 140, // space for floating button and tab bar
  },
  quoteCard: {
    backgroundColor: '#eef1ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  quoteText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: 12,
    color: '#666',
  },
  moreButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  moreText: {
    fontSize: 12,
    color: '#0051ff',
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterIcon: {
    marginRight: 8,
  },
  filterButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  filterText: {
    fontSize: 12,
    color: '#333',
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 12,
    marginBottom: 16,
  },
  postRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnailPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#ddd',
  },
  postContent: {
    flex: 1,
    marginLeft: 12,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ccc',
    marginRight: 8,
  },
  userName: {
    fontSize: 14,
    color: '#333',
  },
  postText: {
    fontSize: 14,
    color: '#333',
  },
  likeIcon: {
    position: 'absolute',
    right: 12,
    bottom: 12,
  },
  floatingButton: {
    position: 'absolute',
    right: 24,
    bottom: 64, // above tab bar
    backgroundColor: '#000',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  floatingText: {
    color: '#fff',
    fontSize: 16,
  },
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
});

export default BoardScreen;
