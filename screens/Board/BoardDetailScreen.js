import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import Container from '../Container';

const profileImg = require('../../assets/profile.png');
const { width } = Dimensions.get('window');
// 본문 이미지 높이를 화면 너비의 0.6배로 설정
const IMAGE_HEIGHT = width * 0.6;

// TODO: 실제 데이터 받아오기 전까지 더미
const DUMMY_POST = {
  image: null,       // 실제로는 { uri: ... } 또는 require(...)
  avatar: profileImg,      // 마찬가지로
  user: '버그찾은 구운달걀',
  text: '내용내용내용내용내용',
  date: '2025.00.00',
  usedFont: '맑은고딕체',
};

const BoardDetailScreen = () => {
  const navigation = useNavigation();
  const { image, avatar, user, text, date, usedFont } = DUMMY_POST;

  return (
    <Container
      title="Post Detail"
      hideBackButton={false}
      showBottomBar={true}
    >
      <ScrollView contentContainerStyle={styles.wrapper}>
        {/* 1. 큰 이미지 */}
        <View style={styles.imageWrapper}>
          {image
            ? <Image source={image} style={styles.postImage} />
            : <View style={styles.imagePlaceholder} />
          }
        </View>

        {/* 2. 유저 정보 + 좋아요 아이콘 */}
        <View style={styles.userRow}>
        <View style={styles.userInfo}>
            {/* 항상 로컬 프로필 이미지를 보여줍니다 */}
            <Image source={avatar} style={styles.avatar} />
            <TouchableOpacity
              onPress={() => navigation.navigate('OtherProfile', { user, avatar })}
            >
              <Text style={styles.userName}>{user}</Text>
            </TouchableOpacity>
          </View>
          <Icon name="heart" size={30} color="#888" marginRight="10"/>
        </View>

        {/* 3. 본문 텍스트 */}
        <Text style={styles.postText}>{text}</Text>

        {/* 4. 날짜 */}
        <Text style={styles.postDate}>{date}</Text>

        {/* 5. 사용된 폰트 보기 */}
        <TouchableOpacity
          style={styles.fontLink}
          onPress={() => {
            /* TODO: 사용된 폰트 상세 화면으로 네비게이트 */
          }}
        >
          <Text style={styles.fontLinkText}>
            이 글에 사용된 '{usedFont}' 보러가기
          </Text>
          <Icon name="chevron-right" size={16} color="#0051ff" />
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    paddingBottom: 32 + 56 + 32, // 탭바 높이 + 여유
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
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ddd',
    marginRight: 8,
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
