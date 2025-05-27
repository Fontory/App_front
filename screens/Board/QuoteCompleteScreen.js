import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Container from '../Container';
import { captureRef } from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BASE_URL = 'http://ceprj.gachon.ac.kr:60023';
const { width } = Dimensions.get('window');
const IMAGE_WIDTH = width - 32;
const IMAGE_HEIGHT = IMAGE_WIDTH;

const IMAGES = [
  require('../../assets/notebook1.jpg'),
  require('../../assets/notebook2.jpg'),
  require('../../assets/notebook3.jpg'),
];

const QuoteCompleteScreen = ({ navigation }) => {
  const route = useRoute();
  const { previewText, fontSize, fontFamily, fontId, selectedImage } = route.params;

  const [backgroundId, setBackgroundId] = useState(null);
  const [userId, setUserId] = useState(null);
  const captureViewRef = useRef(null);

  useEffect(() => {
    // 🔍 backgroundId 계산 (이미지 인덱스 = ID 라고 가정)
    const index = IMAGES.findIndex(img => img === selectedImage);
    setBackgroundId(index + 1);

    // 🔍 AsyncStorage에서 로그인 유저 정보 가져오기
    const loadUserId = async () => {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserId(user.userId);
      } else {
        Alert.alert('로그인 필요', '로그인 후 다시 시도해주세요.');
        navigation.navigate('Login');
      }
    };

    loadUserId();
  }, []);

  const handleDownload = async () => {
    try {
      const uri = await captureRef(captureViewRef, {
        format: 'png',
        quality: 1,
      });

      const fileName = `fontory_${Date.now()}.png`;
      const destPath = Platform.select({
        android: `${RNFS.PicturesDirectoryPath}/${fileName}`,
        ios: `${RNFS.DocumentDirectoryPath}/${fileName}`,
      });

      await RNFS.copyFile(uri, destPath);
      Alert.alert('저장 완료', `이미지가 저장되었습니다.\n${destPath}`);
    } catch (error) {
      console.error(error);
      Alert.alert('저장 실패', '이미지 저장 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async () => {
    if (!userId || !fontId || backgroundId === null) {
      Alert.alert('오류', '필수 정보 누락. 다시 시도해주세요.');
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/practice-sheets`, {
        userId,
        fontId,
        backgroundId,
        phrase: previewText,
      });

      console.log('✅ 연습장 생성 성공:', res.data);
      Alert.alert('생성 완료', '연습장이 생성되었습니다!');
      navigation.navigate('MyNoteBook');
    } catch (err) {
      console.error('❌ 연습장 생성 실패:', err);
      Alert.alert('오류', '연습장 생성 중 문제가 발생했습니다.');
    }
  };

  return (
    <Container title="Quote Of The Day" hideBackButton={false} showBottomBar={true}>
      <View style={styles.inner}>
        <Text style={styles.heading}>연습장 생성 완료!</Text>
        <Text style={styles.subheading}>미리보기</Text>

        <View ref={captureViewRef} collapsable={false}>
          <ImageBackground
            source={selectedImage}
            style={styles.image}
            imageStyle={styles.imageBorder}
          >
            <Text style={[styles.overlayText, { fontSize, fontFamily }]}>
              {previewText}
            </Text>
          </ImageBackground>
        </View>

        <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
          <Text style={styles.downloadText}>PNG로 다운받기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.createButton} onPress={handleSubmit}>
          <Text style={styles.createText}>연습장 저장하기</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  inner: {
    padding: 16,
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBorder: {
    borderRadius: 8,
  },
  overlayText: {
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 40,
    includeFontPadding: false,
  },
  downloadButton: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingHorizontal: 32,
    paddingVertical: 14,
    marginBottom: 16,
  },
  downloadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  createText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuoteCompleteScreen;
