// screens/Font/FontGenerationScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Container from '../Container'; // 경로는 실제 위치에 따라 조정

const FontGenerationScreen = ({ navigation, route }) => {
  const [fontName, setFontName] = useState('');
  const { imageUri } = route.params;

  const handleSubmit = () => {
    if (fontName.trim() === '') {
      Alert.alert('알림', '폰트 이름을 입력해주세요.');
      return;
    }

    navigation.navigate('FontDownload', { fontName });
  };

  return (
    <Container title="폰트 생성" showBottomBar={true} hideBackButton={false}>
      <View style={styles.inner}>
        <Text style={styles.title}>폰트 생성 완료!</Text>

        <Text style={styles.label}>폰트 미리보기</Text>
        <Image
          source={require('../../assets/samplefont.png')} // 경로 확인 필요
          style={styles.preview}
          resizeMode="contain"
        />

        <Text style={styles.inputLabel}>이 폰트의 이름을 지어주세요</Text>
        <TextInput
          style={styles.input}
          value={fontName}
          onChangeText={setFontName}
          placeholder="예) 강부장님체"
          keyboardType="default"
          autoCorrect={false}
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>다음</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

export default FontGenerationScreen;

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  preview: {
    width: '90%',
    height: 160,
    backgroundColor: '#eee',
    marginBottom: 20,
    borderRadius: 12,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    height: 48,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 999,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
