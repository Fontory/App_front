// screens/ExerciseBook/ExerciseBook2Screen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Container from '../Container';

const ExerciseBook2Screen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { background, fontName } = route.params;

  const [quote, setQuote] = useState('');

  const handleNext = () => {
    if (!quote.trim()) {
      alert('글귀를 입력해주세요.');
      return;
    }

    navigation.navigate('ExerciseBook3', {
      background,
      fontName,
      quote,
    });
  };

  return (
    <Container title="연습장 생성" showBottomBar={false}>
      <View style={styles.inner}>
        <Text style={styles.subtitle}>
          STEP 2. 연습장에 적을 글귀를 입력해주세요
        </Text>

        <TextInput
          style={styles.input}
          placeholder="예) 지나온 길을 돌아볼 땐 필요한 건 후회가 아닌 평가이고..."
          placeholderTextColor="#999"
          value={quote}
          onChangeText={setQuote}
          multiline
        />

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>다음</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

export default ExerciseBook2Screen;

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'flex-start',
    color: '#333',
  },
  input: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    backgroundColor: '#eee',
    padding: 16,
    fontSize: 14,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 10,
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
  },
});
