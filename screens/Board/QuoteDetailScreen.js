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
  Alert,
  ActivityIndicator,
} from 'react-native';
import Container from '../Container';
import { Picker } from '@react-native-picker/picker';

const BASE_URL = 'http://ceprj.gachon.ac.kr:60023';

const QuoteDetailScreen = ({ navigation }) => {
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const [quoteText, setQuoteText] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [fontList, setFontList] = useState([]);
  const [selectedFontId, setSelectedFontId] = useState(null);
  const [selectedFontName, setSelectedFontName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuoteAndFonts = async () => {
      try {
        const [quoteRes, fontsRes] = await Promise.all([
          fetch(`${BASE_URL}/quotes/today`),
          fetch(`${BASE_URL}/fonts`)
        ]);

        const quoteJson = await quoteRes.json();
        const fontsJson = await fontsRes.json();

        setQuoteText(quoteJson?.content || '오늘의 명언이 없습니다.');
        setPreviewText(quoteJson?.content || '오늘의 명언이 없습니다.');
        setFontList(fontsJson || []);

        // 기본 선택값 설정
        if (fontsJson.length > 0) {
          setSelectedFontId(fontsJson[0].fontId);
          setSelectedFontName(fontsJson[0].fontName);
        }

      } catch (err) {
        console.error('데이터 로딩 실패:', err);
        Alert.alert('오류', '명언 또는 폰트를 불러오는 중 문제가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuoteAndFonts();
  }, []);

  const goNext = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    navigation.navigate('ExerciseBook', {
      quote: previewText,
      fontId: selectedFontId,
      fontName: selectedFontName,
    });
  };

  if (loading) {
    return (
      <Container title="Quote Of The Day" hideBackButton={false} showBottomBar={true}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </Container>
    );
  }

  return (
    <Container title="Quote Of The Day" hideBackButton={false} showBottomBar={true}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* 명언 카드 */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>{quoteText}</Text>
        </View>

        {/* 글귀 입력 */}
        <View style={styles.previewCard}>
          <TextInput
            style={styles.previewText}
            value={previewText}
            onChangeText={setPreviewText}
            multiline
          />
        </View>

        {/* 폰트 선택 (드롭다운) */}
        <View style={styles.fontSelector}>
          <Text style={styles.fontSelectorLabel}>폰트 선택</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedFontId}
              onValueChange={(itemValue, itemIndex) => {
                const selectedFont = fontList.find(f => f.fontId === itemValue);
                setSelectedFontId(itemValue);
                setSelectedFontName(selectedFont?.fontName || '');
              }}
              style={styles.picker}
              dropdownIconColor="#000"
            >
              {fontList.map((font) => (
                <Picker.Item
                  key={font.fontId}
                  label={font.fontName}
                  value={font.fontId}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* 다음 버튼 */}
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
    paddingBottom: 100,
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
    color: '#444',
    fontSize: 16,
    textAlignVertical: 'top',
    flex: 1,
  },
  fontSelector: {
    marginBottom: 24,
  },
  fontSelectorLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  fontOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  selectedFontOption: {
    backgroundColor: '#eee',
  },
  nextButton: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    height: 55,
    width: '100%',
  },

});

export default QuoteDetailScreen;
