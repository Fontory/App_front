// screens/Mypage/LikeFontScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Container from '../Container';

const DUMMY_LIKED_FONTS = [
  { id: '1', name: '성실체', preview: '폰트 미리보기입니다' },
  { id: '2', name: '버그찾은 글씨체', preview: '예시 텍스트입니다' },
];

const LikeFontScreen = () => {
  return (
    <Container title="Like Font" hideBackButton={false} showBottomBar={true}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {DUMMY_LIKED_FONTS.map((font) => (
          <View key={font.id} style={styles.card}>
            {/* 1. 폰트 이름 라인 + 하트 아이콘 */}
            <View style={styles.headerRow}>
              {/* 읽기 전용 TextInput 대신 Text를 써도 됩니다. */}
              <Text style={styles.fontName}>{font.name}</Text>
              <TouchableOpacity style={styles.heartButton}>
                <Icon name="heart" size={18} color="#888" />
              </TouchableOpacity>
            </View>

            {/* 2. 폰트 미리보기 */}
            <TextInput
              style={[styles.previewText, { fontFamily: font.name }]}
              value={font.preview}
              editable={false}
              multiline
            />
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
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fontName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  heartButton: {
    padding: 4,
  },
  previewText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default LikeFontScreen;
