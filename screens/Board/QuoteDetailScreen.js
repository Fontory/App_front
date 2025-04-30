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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Container from '../Container';

const QUOTE_TEXT = '“존재하는 것을 변화시키는 것은 성숙하게 만드는 것이다.”';
const FONT_SIZES = [12, 14, 16, 18, 20, 24];
const FONT_FAMILIES = Platform.select({
  ios: ['System', 'Courier New', 'Georgia'],
  android: ['sans-serif', 'serif', 'monospace'],
});

const { width } = Dimensions.get('window');
const PICKER_WIDTH = (width - 48) / 2;

const QuoteDetailScreen = ({ navigation }) => {
  // Android 에서 LayoutAnimation 활성화
  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const [previewText, setPreviewText] = useState(QUOTE_TEXT);
  const [fontSize, setFontSize]     = useState(16);
  const [fontFamily, setFontFamily] = useState(FONT_FAMILIES[0]);

  const goNext = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    navigation.navigate('QuoteNotebook', {
      previewText,
      fontSize,
      fontFamily,
    });
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

        {/* 3) 수정 가능한 previewCard */}
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
