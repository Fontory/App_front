// screens/Mypage/SaveFontScreen.js
import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import Container from '../Container';

const DUMMY_SAVED_FONTS = [
  { id: '1', name: '성실체', preview: '폰트 미리보기입니다' },
  { id: '2', name: '버그찾은 글씨체', preview: '폰트 예시 텍스트' },
];

const SaveFontScreen = () => {
  return (
    <Container title="Save Font" hideBackButton={false} showBottomBar={true}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {DUMMY_SAVED_FONTS.map((font) => (
          <View key={font.id} style={styles.fontCard}>
            <TextInput
              style={styles.fontName}
              value={font.name}
              editable={false}
            />
            <TextInput
              style={[styles.fontPreview, { fontFamily: font.name }]}
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
    paddingBottom: 32 + 56 + 16, // 아래 탭바 + 여유
  },
  fontCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  fontName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  fontPreview: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default SaveFontScreen;
