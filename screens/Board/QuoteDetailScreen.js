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
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import Container from '../Container';

const BASE_URL = 'http://ceprj.gachon.ac.kr:60023';
const FONT_SIZES = [12, 14, 16, 18, 20, 24];
const FONT_FAMILIES = Platform.select({
  ios: ['System', 'Courier New', 'Georgia'],
  android: ['sans-serif', 'serif', 'monospace'],
});

const { width } = Dimensions.get('window');
const PICKER_WIDTH = (width - 48) / 2;

const QuoteDetailScreen = ({ navigation }) => {
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const [quoteText, setQuoteText] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState(FONT_FAMILIES[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/quotes/today`)
      .then(res => {
        if (res.data?.content) {
          setQuoteText(res.data.content);
          setPreviewText(res.data.content);
        } else {
          setQuoteText('오늘의 명언이 없습니다.');
          setPreviewText('오늘의 명언이 없습니다.');
        }
      })
      .catch(err => {
        console.error('명언 불러오기 실패:', err);
        setQuoteText('명언을 불러오는 중 오류가 발생했습니다.');
        setPreviewText('명언을 불러오는 중 오류가 발생했습니다.');
      })
      .finally(() => setLoading(false));
  }, []);

  const goNext = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    navigation.navigate('QuoteNotebook', {
      previewText,
      fontSize,
      fontFamily,
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
        {/* 1) 서버에서 받아온 quoteCard */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>{quoteText}</Text>
        </View>

        {/* 2) 크기 & 글씨체 선택 */}
        <View style={styles.pickerRow}>
          <View style={[styles.pickerWrapper, { width: PICKER_WIDTH }]}>
            <Text style={styles.pickerLabel}>크기</Text>
            <Picker
              selectedValue={fontSize}
              onValueChange={setFontSize}
              mode="dropdown"
              itemStyle={{ fontSize: 14, height: 48 }}
              style={styles.picker}
            >
              {FONT_SIZES.map(size => (
                <Picker.Item key={size} label={`${size} pt`} value={size} color="#000" />
              ))}
            </Picker>
          </View>

          <View style={[styles.pickerWrapper, { width: PICKER_WIDTH }]}>
            <Text style={styles.pickerLabel}>글씨체</Text>
            <Picker
              selectedValue={fontFamily}
              onValueChange={setFontFamily}
              mode="dropdown"
              itemStyle={{ fontSize: 14, height: 48 }}
              style={styles.picker}
            >
              {FONT_FAMILIES.map(family => (
                <Picker.Item key={family} label={family} value={family} color="#000" />
              ))}
            </Picker>
          </View>
        </View>

        {/* 3) preview 영역 */}
        <View style={styles.previewCard}>
          <TextInput
            style={[
              styles.previewText,
              {
                fontSize,
                fontFamily,
                textAlignVertical: 'top',
              },
            ]}
            value={previewText}
            onChangeText={setPreviewText}
            multiline
          />
        </View>

        {/* 4) 다음 버튼 */}
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
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    height: 56,
    justifyContent: 'center',
  },
  pickerLabel: {
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 8,
    paddingTop: 10,
  },
  picker: {
    width: '100%',
    height: 50,
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
