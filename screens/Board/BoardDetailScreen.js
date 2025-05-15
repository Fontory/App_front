import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import Container from '../Container';
import axios from 'axios';

const BASE_URL = 'http://ceprj.gachon.ac.kr:60023';
const profileImg = require('../../assets/profile.png');
const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = width * 0.6;

const BoardDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { postId } = route.params;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/posts/${postId}`)
      .then(res => {
        if (res.data.status === 0 || res.data.status === 200) {
          setPost(res.data.data);
        } else {
          Alert.alert('불러오기 실패', res.data.message);
        }
      })
      .catch(err => {
        console.error('게시글 상세 조회 실패:', err);
        Alert.alert('오류', '게시글을 불러오는 중 오류가 발생했습니다.');
      })
      .finally(() => setLoading(false));
  }, [postId]);

  if (loading) {
    return (
      <Container title="Post Detail" hideBackButton={false} showBottomBar={true}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </Container>
    );
  }

  if (!post) return null;

  return (
    <Container title="Post Detail" hideBackButton={false} showBottomBar={true}>
      <ScrollView contentContainerStyle={styles.wrapper}>
        {/* 1. 큰 이미지 */}
        <View style={styles.imageWrapper}>
          {post.imageUrl ? (
            <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
          ) : (
            <View style={styles.imagePlaceholder} />
          )}
        </View>

        {/* 2. 유저 정보 + 좋아요 아이콘 */}
        <View style={styles.userRow}>
          <View style={styles.userInfo}>
            <Image source={profileImg} style={styles.avatar} />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('OtherProfile', {
                  user: post.nickname,
                  avatar: profileImg,
                })
              }
            >
              <Text style={styles.userName}>{post.nickname}</Text>
            </TouchableOpacity>
          </View>
          <Icon name="heart" size={30} color="#888" />
        </View>

        {/* 3. 본문 텍스트 */}
        <Text style={styles.postText}>{post.content}</Text>

        {/* 4. 날짜 */}
        <Text style={styles.postDate}>
          {new Date(post.createdAt).toLocaleDateString('ko-KR')}
        </Text>

        {/* 5. 사용된 폰트 보기 (API에 없으므로 임시 비활성화) */}
        {/* 추후 post.fontName 등 추가되면 활성화 */}
        {/* <TouchableOpacity style={styles.fontLink}>
          <Text style={styles.fontLinkText}>이 글에 사용된 '폰트명' 보러가기</Text>
          <Icon name="chevron-right" size={16} color="#0051ff" />
        </TouchableOpacity> */}
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    paddingBottom: 32 + 56 + 32,
  },
  imageWrapper: {
    width: '100%',
    height: IMAGE_HEIGHT,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#eee',
    marginBottom: 16,
  },
  postImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#ccc',
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 20,
  },
  userName: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  postText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 30,
    lineHeight: 20,
    paddingHorizontal: 15,
  },
  postDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
    paddingHorizontal: 15,
  },
  fontLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  fontLinkText: {
    fontSize: 14,
    color: '#0051ff',
    marginRight: 4,
  },
});

export default BoardDetailScreen;
