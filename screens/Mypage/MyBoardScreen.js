// screens/Mypage/MyBoardScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import Container from '../Container';

const { width } = Dimensions.get('window');
const CARD_HEIGHT = 100;
const IMAGE_SIZE = CARD_HEIGHT - 16;

const DUMMY_MY_POSTS = [
  { id: '1', text: '오늘은 필사를 했다..', image: null },
  { id: '2', text: '새로운 연습장을 완성했어요.', image: null },
];

const MyBoardScreen = () => {
  const navigation = useNavigation();

  return (
    <Container
      title="My Board"
      hideBackButton={false}
      showBottomBar={true}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        {DUMMY_MY_POSTS.map((post) => (
          <View key={post.id} style={styles.card}>
            {/* 이미지 썸네일 */}
            <View style={styles.thumbWrapper}>
              {post.image ? (
                <Image source={post.image} style={styles.thumb} />
              ) : (
                <View style={styles.thumbPlaceholder} />
              )}
            </View>

            {/* 본문 텍스트 */}
            <Text style={styles.text} numberOfLines={2}>
              {post.text}
            </Text>

            {/* 연필 아이콘 (편집) */}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('BoardEdit')}
            >
              <Icon name="edit-2" size={20} color="#888" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  scroll: {
    padding: 16,
    paddingBottom: 32 + 56 + 16, // 탭바 + 여유
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
