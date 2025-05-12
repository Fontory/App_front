// screens/Board/QuoteCompleteScreen.js
import React, { useRef } from 'react';
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
// ★ 추가 imports
import { captureRef } from 'react-native-view-shot';
import RNFS from 'react-native-fs';

const { width } = Dimensions.get('window');
const IMAGE_WIDTH  = width - 32;
const IMAGE_HEIGHT = IMAGE_WIDTH * 1.2;

const QuoteCompleteScreen = ({ navigation }) => {
  const route = useRoute();
  const { previewText, fontSize, fontFamily, selectedImage } = route.params;

  // ★ 캡처할 뷰 참조
  const captureViewRef = useRef(null);

  const handleDownload = async () => {
    try {
      // 1) 뷰 캡처 → 임시 파일 URI
      const uri = await captureRef(captureViewRef, {
        format: 'png',
        quality: 1,
      });

      // 2) 저장할 실제 경로 결정
      const fileName = `fontory_${Date.now()}.png`;
      const destPath = Platform.select({
        android: `${RNFS.PicturesDirectoryPath}/${fileName}`,
        ios:   `${RNFS.DocumentDirectoryPath}/${fileName}`,
      });

      // 3) 임시 파일 → 최종 경로 복사
      await RNFS.copyFile(uri, destPath);

      Alert.alert('저장 완료', `이미지가 저장되었습니다.\n${destPath}`);
    } catch (error) {
      console.error(error);
      Alert.alert('저장 실패', '이미지 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <Container
      title="Quote Of The Day"
      hideBackButton={false}
      showBottomBar={true}
    >
      <View style={styles.inner}>
        <Text style={styles.heading}>연습장 생성 완료!</Text>
        <Text style={styles.subheading}>미리보기</Text>

        {/* ★ 여기를 ref로 감싸기 (collapsable={false} 필수) */}
        <View ref={captureViewRef} collapsable={false}>
          <ImageBackground
            source={selectedImage}
            style={styles.image}
            imageStyle={styles.imageBorder}
          >
            <Text
              style={[
                styles.overlayText,
                { fontSize, fontFamily },
              ]}
            >
              {previewText}
            </Text>
          </ImageBackground>
        </View>

        <TouchableOpacity
          style={styles.downloadButton}
          onPress={handleDownload}
          activeOpacity={0.8}
        >
          <Text style={styles.downloadText}>PNG로 다운받기</Text>
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
    marginBottom: 32,
  },
  downloadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuoteCompleteScreen;
