// screens/Board/BoardScreen.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Container from '../Container';

const DUMMY_POSTS = [
  { id: '1', user: '홍길동', text: '오늘은 필사를 했다..' },
  { id: '2', user: '김철수', text: '새로운 글을 남겨봅니다.' },
  { id: '3', user: '김철수', text: '새로운 글을 남겨봅니다.' },
  { id: '4', user: '김철수', text: '새로운 글을 남겨봅니다.' },
];

const BoardScreen = ({ navigation }) => (
  <Container
    title="Board"
    hideBackButton={true}
    showBottomBar={true}
  >
    <ScrollView contentContainerStyle={styles.wrapper}>
      {/* Quote card */}
      <View style={styles.quoteCard}>
        <Text style={styles.quoteText}>
          “존재하는 것을 변화시키는 것은 성숙하게 만드는 것이다.”
        </Text>
        <Text style={styles.quoteAuthor}>헨리 버그슨</Text>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => navigation.navigate('QuoteDetail')}
        >
          <Text style={styles.moreText}>더보기</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filtersRow}>
        <Icon name="sliders" size={20} color="#444" style={styles.filterIcon} />
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>전체</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>필사</Text>
        </TouchableOpacity>
      </View>

      {/* Post list */}
      {DUMMY_POSTS.map(post => (
        <View key={post.id} style={styles.postCard}>
          <View style={styles.postRow}>
            <View style={styles.thumbnailPlaceholder} />
            <View style={styles.postInfo}>
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
      <Icon name="edit-2" size={24} color="#fff" />
    </TouchableOpacity>
  </Container>
);

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    paddingBottom: 120, // space for bottom bar + floating button
  },
  quoteCard: {
    backgroundColor: '#eef1ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  quoteText: { fontSize: 14, color: '#333', marginBottom: 8, textAlign: 'center' },
  quoteAuthor: { fontSize: 12, color: '#666', textAlign: 'center' },
  moreButton: { position: 'absolute', bottom: 8, right: 8 },
  moreText: { fontSize: 12, color: '#0051ff' },

  filtersRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  filterIcon: { marginRight: 8 },
  filterButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  filterText: { fontSize: 12, color: '#333' },

  postCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 12,
    marginBottom: 16,
  },
  postRow: { flexDirection: 'row', alignItems: 'center' },
  thumbnailPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#ddd',
  },
  postInfo: { flex: 1, marginLeft: 12 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ccc',
    marginRight: 8,
  },
  userName: { fontSize: 14, color: '#333' },
  postText: { fontSize: 14, color: '#333', marginBottom: 8 },
  likeIcon: { position: 'absolute', right: 12, bottom: 12 },

  floatingButton: {
    position: 'absolute',
    right: 24,
    bottom: 80,
    backgroundColor: '#000',
    borderRadius: 24,
    padding: 14,
  },
});

export default BoardScreen;
