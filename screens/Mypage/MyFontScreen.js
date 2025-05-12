// screens/Mypage/MyFontScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Container from '../Container';

const DUMMY_FONTS = [
  { id: '1', name: '성실체', preview: '폰트 미리보기 입니다', likes: 5, isPublic: true },
  { id: '2', name: '성실체', preview: '폰트 미리보기 입니다', likes: 0, isPublic: false },
  { id: '3', name: '성실체', preview: '폰트 미리보기 입니다', likes: 5, isPublic: true },
  { id: '4', name: '성실체', preview: '폰트 미리보기 입니다', likes: 5, isPublic: true },
];

const MyFontScreen = ({ navigation }) => {
  return (
    <Container
      title="My Font"
      hideBackButton={false}
      showBottomBar={true}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        {DUMMY_FONTS.map((font) => (
          <TouchableOpacity
            key={font.id}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => {
              /* 좋아요 눌렀을 때 상세로 이동하거나, 편집 모달 띄우기 등 */
            }}
          >
            {/* 헤더: 폰트 이름 + 우측 아이콘 */}
            <View style={styles.cardHeader}>
              <Text style={styles.fontName}>{font.name}</Text>
              {font.isPublic ? (
                <View style={styles.likeBadge}>
                  <Icon name="heart" size={14} color="#D0021B" />
                  <Text style={styles.likeText}>{font.likes}</Text>
                </View>
              ) : (
                <View style={styles.privateBadge}>
                  <Text style={styles.privateText}>비공개</Text>
                </View>
              )}
            </View>
            {/* 미리보기 텍스트 */}
            <Text style={styles.previewText}>{font.preview}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  scroll: {
    padding: 16,
    paddingBottom: 32 + 56 + 32, // 하단 바 + 마진
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fontName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  likeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEEEEE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  likeText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#D0021B',
    fontWeight: '600',
  },
  privateBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#888',
  },
  privateText: {
    fontSize: 12,
    color: '#888',
  },
  previewText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

export default MyFontScreen;
