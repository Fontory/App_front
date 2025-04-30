// screens/Mypage/MyNoteBookScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import Container from '../Container';

const { width } = Dimensions.get('window');
// 카드 사이 여백 16*3 = 48을 제외한 실 셀 너비
const CARD_SIZE = (width - 48) / 2;

const DUMMY_NOTEBOOKS = [
  { id: '1', font: '맑은고딕체', image: null },
  { id: '2', font: '맑은고딕체', image: null },
  { id: '3', font: '맑은고딕체', image: null },
  { id: '4', font: '맑은고딕체', image: null },
];

const MyNoteBookScreen = () => {
  return (
    <Container
      title="My NoteBook"
      hideBackButton={false}
      showBottomBar={true}
    >
      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {DUMMY_NOTEBOOKS.map((nb) => (
          <TouchableOpacity
            key={nb.id}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => {
              /* TODO: 상세보기로 네비게이트 */
            }}
          >
            {/* 상단 라벨 */}
            <View style={styles.labelWrapper}>
              <Text style={styles.labelText}>{`'${nb.font}' 사용`}</Text>
            </View>

            {/* 이미지 영역 */}
            <View style={styles.imagePlaceholder} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    paddingBottom: 32 + 56 + 16, // 탭바 + 여유
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE + 24, // 라벨 높이(24) + 이미지 영역
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  labelWrapper: {
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fafafa',
  },
  labelText: {
    fontSize: 12,
    color: '#333',
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#ddd',
  },
});

export default MyNoteBookScreen;
