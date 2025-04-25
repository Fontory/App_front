// screens/Board/QuoteDetailScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Container from '../Container';

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36];

const QuoteDetailScreen = ({ navigation }) => {
  const [fontSize, setFontSize] = useState(16);
  const [fontName, setFontName] = useState('');
  const [previewText, setPreviewText] = useState(
    '“존재하는 것을 변화시키는 것은 성숙하게 만드는 것이다.”'
  );

  return (
    <Container
      title="Quote Of The Day"
      hideBackButton={false}
      showBottomBar={true}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Quote Card */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>{previewText}</Text>
          <Text style={styles.quoteAuthor}>헨리 버그슨</Text>
        </View>

        {/* Font‐Size Select + Font Name Input */}
        <View style={styles.settingsRow}>
          <View style={styles.pickerWrapper}>
            <Picker
              mode="dropdown"
              selectedValue={fontSize}
              onValueChange={(val) => setFontSize(val)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {FONT_SIZES.map((size) => (
                <Picker.Item
                  key={size}
                  label={`${size} pt`}
                  value={size}
                />
              ))}
            </Picker>
          </View>

          <TextInput
            style={styles.fontInput}
            placeholder="폰트 이름"
            placeholderTextColor="#888"
            value={fontName}
            onChangeText={setFontName}
          />
        </View>

        {/* Editable Preview Card */}
        <View style={styles.previewCard}>
          <TextInput
            style={[
              styles.previewText,
              {
                fontSize,
                color: '#999',
                lineHeight: fontSize * 1.4,
                minHeight: fontSize * 3,
                textAlignVertical: 'top',
              },
            ]}
            value={previewText}
            onChangeText={setPreviewText}
            multiline
          />
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Board')}
        >
          <Text style={styles.buttonText}>다음</Text>
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
    justifyContent: 'center',
  },
  quoteText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  quoteAuthor: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },

  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
    width: 80,
    height: 40,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: '100%',
    color: '#333',           // 선택된 텍스트 색
  },
  pickerItem: {
    fontSize: 14,
    height: 40,
  },
  fontInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 8 : 6,
    fontSize: 14,
    color: '#333',
  },

  previewCard: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  previewText: {
    // lineHeight, minHeight 등은 인라인으로 적용
  },

  button: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 32,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuoteDetailScreen;
