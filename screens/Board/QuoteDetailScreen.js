// screens/Board/QuoteDetailScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import Container from '../Container';

const QUOTE_TEXT = '“존재하는 것을 변화시키는 것은 성숙하게 만드는 것이다.”';

const QuoteDetailScreen = ({ navigation }) => {
  // Android LayoutAnimation 활성화
  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const [previewText, setPreviewText] = useState(QUOTE_TEXT);

  const goNext = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    navigation.navigate('QuoteNotebook');  // 여기서 QuoteNotebookScreen으로 이동
  };

  return (
    <Container
      title="Quote Of The Day"
      hideBackButton={false}
      showBottomBar={true}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {/* 1) 고정된 quoteCard */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>{QUOTE_TEXT}</Text>
          <Text style={styles.quoteAuthor}>헨리 버그슨</Text>
        </View>

        {/* 2) 수정 가능한 previewCard */}
        <View style={styles.previewCard}>
          <TextInput
            style={[styles.previewText, { textAlignVertical: 'top' }]}
            value={previewText}
            onChangeText={setPreviewText}
            multiline
          />
        </View>

        {/* 3) 다음 버튼 */}
        <TouchableOpacity style={styles.nextButton} onPress={goNext}>
          <Text style={styles.nextText}>다음</Text>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 32 + 56 + 32,
  },
  quoteCard: {
    backgroundColor: '#eef1ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  quoteAuthor: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  previewCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    minHeight: 100,
  },
  previewText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
    flex: 1,
  },
  nextButton: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 40,
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuoteDetailScreen;
