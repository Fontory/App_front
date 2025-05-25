import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Modal,
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
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [font, setFont] = useState(null);
  const [isImageModalVisible, setImageModalVisible] = useState(false);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/posts/${postId}`)
      .then(res => {
        if (res.data.status === 0 || res.data.status === 200) {
          const postData = res.data.data;
          setPost(postData);
          setLikeCount(postData.likeCount);
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

  useEffect(() => {
    if (post?.fontId) {
      axios.get(`${BASE_URL}/api/fonts/${post.fontId}`)
        .then(res => {
          if (res.data.status === 0 || res.data.status === 200) {
            setFont(res.data.data);
          }
        })
        .catch(err => {
          console.error('폰트 정보 조회 실패:', err.message);
        });
    }
  }, [post]);

  const handleLike = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/posts/${postId}/like`, null, {
        withCredentials: true,
      });
      console.log('✅ 좋아요 응답:', res.data);
      setLiked(prev => {
        const newLiked = !prev;
        setLikeCount(prev ? likeCount - 1 : likeCount + 1);
        return newLiked;
      });
    } catch (err) {
      console.error('❌ 좋아요 실패:', err.message);
      Alert.alert('오류', '좋아요 처리 중 오류가 발생했습니다.');
    }
  };

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

  const postImageUrl = post?.imageUrl
    ? `${BASE_URL}${post.imageUrl.replace('/uploads', '')}`
    : null;

  const avatarUrl = post?.profileImage?.includes('/uploads/')
    ? `${BASE_URL}${post.profileImage}`
    : `${BASE_URL}/profiles/${post.profileImage}`;

  return (
    <Container title="Post Detail" hideBackButton={false} showBottomBar={true}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* 이미지 */}
        <TouchableOpacity onPress={() => setImageModalVisible(true)}>
          <View style={{ width: '100%', height: IMAGE_HEIGHT, borderRadius: 8, overflow: 'hidden', backgroundColor: '#eee', marginBottom: 16 }}>
            {postImageUrl ? (
              <Image source={{ uri: encodeURI(postImageUrl) }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
            ) : (
              <View style={{ flex: 1, backgroundColor: '#ccc' }} />
            )}
          </View>
        </TouchableOpacity>

        {/* 유저 정보 + 좋아요 */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={avatarUrl ? { uri: encodeURI(avatarUrl) } : profileImg} style={{ width: 36, height: 36, borderRadius: 18, marginRight: 12 }} />
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>{post.nickname}</Text>
          </View>
          <TouchableOpacity onPress={handleLike} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="heart" size={30} color={liked ? 'red' : '#888'} />
            <Text style={{ marginLeft: 6, color: '#888' }}>{likeCount}</Text>
          </TouchableOpacity>
        </View>

        {/* 본문 텍스트 */}
        <Text style={{ fontSize: 14, color: '#333', marginBottom: 20, lineHeight: 20 }}>
          {post.content}
        </Text>

        {/* 날짜 */}
        <Text style={{ fontSize: 12, color: '#666', marginBottom: 16 }}>
          {new Date(post.createdAt).toLocaleDateString('ko-KR')}
        </Text>

        {/* 사용된 폰트 정보 */}
        {font && (
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}
            onPress={() => navigation.navigate('FontDetail', { fontId: font.fontId })}
          >
            <Text style={{ fontSize: 14, color: '#0051ff' }}>
              이 글에 사용된 '{font.name}' 보러가기
            </Text>
            <Icon name="chevron-right" size={16} color="#0051ff" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* 전체 이미지 보기 모달 */}
      {postImageUrl && (
        <Modal
          visible={isImageModalVisible}
          transparent={true}
          onRequestClose={() => setImageModalVisible(false)}
        >
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' }}
            activeOpacity={1}
            onPressOut={() => setImageModalVisible(false)}
          >
            <Image source={{ uri: encodeURI(postImageUrl) }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
          </TouchableOpacity>
        </Modal>
      )}
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    height: '100%',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
});

export default BoardDetailScreen;
