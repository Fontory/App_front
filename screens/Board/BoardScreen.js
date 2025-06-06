import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import axios from 'axios';
import Container from '../Container';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const BASE_URL = 'http://ceprj.gachon.ac.kr:60023';

const BoardScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [quote, setQuote] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const truncate = (text, limit) =>
    text.length > limit ? text.substring(0, limit) + '...' : text;

  useFocusEffect(
    useCallback(() => {
      // 명언 불러오기
      axios.get(`${BASE_URL}/quotes/today`)
        .then(res => {
          console.log('📥 명언 응답:', res.data);
          setQuote(res.data.content || '오늘의 명언이 없습니다.');
        })
        .catch(err => {
          console.error('명언 가져오기 실패:', err);
          setQuote('오늘의 명언이 없습니다.');
        });

      // 게시글 불러오기
      axios.get(`${BASE_URL}/api/posts?sort=latest`)
        .then(res => {
          console.log('📥 게시글 응답:', res.data);
          if ((res.data.status === 0 || res.data.status === 200) && Array.isArray(res.data.data.posts)) {
            setPosts(res.data.data.posts);
          } else {
            console.warn('⚠️ 게시글 상태값 이상:', res.data.message);
          }
        })
        .catch(err => {
          console.error('❌ 게시글 호출 에러:', err.message);
          if (err.response) {
            console.log('📤 서버 응답:', err.response.status, err.response.data);
          } else {
            console.log('❌ 서버 응답 없음 (Network Error)');
          }
        });
    }, [])
  );

  const filteredPosts = filterType === 'ALL'
    ? posts
    : posts.filter(post => post.postType === 'TRANSCRIPTION');

  return (
    <Container title="Board" hideBackButton={true} showBottomBar={true}>
      <ScrollView contentContainerStyle={styles.wrapper}>
        {/* 명언 카드 */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>{truncate(quote, 20)}</Text>
          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => navigation.navigate('QuoteDetail')}
          >
            <Text style={styles.moreText}>더보기</Text>
          </TouchableOpacity>
        </View>

        {/* 필터 */}
        <View style={styles.filtersRow}>
          <Icon name="sliders" size={20} color="#444" style={styles.filterIcon} />
          <TouchableOpacity style={styles.filterButton} onPress={() => setFilterType('ALL')}>
            <Text style={styles.filterText}>전체</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} onPress={() => setFilterType('TRANSCRIPTION')}>
            <Text style={styles.filterText}>필사</Text>
          </TouchableOpacity>
        </View>

        {/* 게시글 목록 */}
        {filteredPosts.map(post => {
          const avatarUrl = post.profileImage
            ? post.profileImage.startsWith('/')
              ? `${BASE_URL}${post.profileImage.replace('/uploads', '')}`
              : `${BASE_URL}/profiles/${post.profileImage}`
            : null;
          const postImageUrl = post.imageUrl?.replace('/uploads', '') 
            ? `${BASE_URL}${post.imageUrl.replace('/uploads', '')}`
            : null;
          return (
            <TouchableOpacity
              key={post.postId}
              style={styles.postCard}
              onPress={() => navigation.navigate('BoardDetail', { postId: post.postId })}
            >
              <View style={styles.postRow}>
                {post.imageUrl ? (
                  <Image
                    source={{ uri: postImageUrl }}
                    style={styles.thumbnailImage}
                  />
                ) : (
                  <View style={styles.thumbnailPlaceholder} />
                )}
                <View style={styles.postInfo}>
                  <View style={styles.postHeader}>
                    {post.profileImage ? (
                      <Image
                        source={{ uri: avatarUrl }}
                        style={styles.avatarImage}
                      />
                    ) : (
                      <View style={styles.avatarPlaceholder} />
                    )}
                    <Text style={styles.userName}>{post.nickname}</Text>
                  </View>
                  <Text style={styles.postText}numberOfLines={2}>{post.content}</Text>
                </View>
                <TouchableOpacity style={styles.likeIcon}>
                  <Icon name="heart" size={20} color="#888" />
                  <Text style={{ fontSize: 12, color: '#888' }}>{post.likeCount}</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 글쓰기 버튼 */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('BoardPost')}
      >
        <Icon name="edit-2" size={24} color="#fff" />
      </TouchableOpacity>
    </Container>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    paddingBottom: 120,
  },
  quoteCard: {
    backgroundColor: '#eef1ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
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
  thumbnailImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  postInfo: {
    flexShrink: 1,
    marginLeft: 12,
    flexGrow: 1,
    paddingRight: 40,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ccc',
    marginRight: 8,
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    resizeMode: 'cover',
    marginRight: 8,
  },
  userName: {
    fontSize: 14,
    color: '#333',
  },
  postText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  likeIcon: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    alignItems: 'center',
  },
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
