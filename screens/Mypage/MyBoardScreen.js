import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import Container from '../Container';
import axios from 'axios';

const BASE_URL = 'http://ceprj.gachon.ac.kr:60023';
const { width } = Dimensions.get('window');
const CARD_HEIGHT = 100;
const IMAGE_SIZE = CARD_HEIGHT - 16;

const MyBoardScreen = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/mypage/posts`, { withCredentials: true })
      .then(res => {
        if (res.data.status === 0 || res.data.status === 200) {
          setPosts(res.data.data);
        } else {
          console.warn('⚠️ 게시글 조회 실패:', res.data.message);
        }
      })
      .catch(err => {
        console.error('❌ 게시글 요청 실패:', err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Container title="My Board" hideBackButton={false} showBottomBar={true}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </Container>
    );
  }

  return (
    <Container title="My Board" hideBackButton={false} showBottomBar={true}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {posts.map((post) => {
          const imageUrl = post.imageUrl ? `${BASE_URL}${post.imageUrl.replace('/uploads', '')}` : null;

          return (
            <TouchableOpacity
              key={post.postId}
              style={styles.card}
              onPress={() => navigation.navigate('BoardDetail', { postId: post.postId })}
            >
              {/* 이미지 썸네일 */}
              <View style={styles.thumbWrapper}>
                {imageUrl ? (
                  <Image source={{ uri: encodeURI(imageUrl) }} style={styles.thumb} />
                ) : (
                  <View style={styles.thumbPlaceholder} />
                )}
              </View>

              {/* 본문 텍스트 */}
              <Text style={styles.text} numberOfLines={2}>
                {post.content}
              </Text>
            </TouchableOpacity>
          );
        })}

      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  scroll: {
    padding: 16,
    paddingBottom: 32 + 56 + 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    height: CARD_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 16,
    padding: 8,
    position: 'relative',
  },
  thumbWrapper: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 8,
    backgroundColor: '#ddd',
    overflow: 'hidden',
    marginRight: 12,
  },
  thumb: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  thumbPlaceholder: {
    flex: 1,
    backgroundColor: '#ccc',
  },
  text: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  editButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
  },
});

export default MyBoardScreen;
