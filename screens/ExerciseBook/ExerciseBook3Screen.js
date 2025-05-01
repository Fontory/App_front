// screens/ExerciseBook/ExerciseBook3Screen.js
import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import Container from '../Container';
import { useRoute, useNavigation } from '@react-navigation/native'; // ✅ 추가

const ExerciseBook3Screen = () => {
  const route = useRoute();
  const navigation = useNavigation(); // ✅ 추가
  const { background, quote, fontName } = route.params;
  const viewShotRef = useRef(null);

  const handleDownload = async () => {
    try {
      const uri = await viewShotRef.current.capture();

      const filePath = `${RNFS.DocumentDirectoryPath}/${fontName}_exercise.png`;
      await RNFS.moveFile(uri, filePath);

      await Share.open({
        url: `file://${filePath}`,
        type: 'image/png',
        failOnCancel: false,
      });

      Alert.alert('✅ 저장 완료', 'PNG 이미지가 저장되었어요!', [
        {
          text: '확인',
          onPress: () => navigation.navigate('FontList'), // ✅ FontList로 이동
        },
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert('❌ 오류', '이미지 저장에 실패했어요.');
    }
  };

  return (
    <Container title="연습장 생성 완료!" showBottomBar={false}>
      <View style={styles.inner}>
        <Text style={styles.subtitle}>미리보기</Text>

        <ViewShot
          ref={viewShotRef}
          options={{ format: 'png', quality: 1.0 }}
          style={styles.captureView}
        >
          <ImageBackground
            source={background.image}
            style={styles.background}
            resizeMode="contain"
          >
            <Text style={styles.overlayText}>{quote}</Text>
          </ImageBackground>
        </ViewShot>

        <TouchableOpacity style={styles.button} onPress={handleDownload}>
          <Text style={styles.buttonText}>PNG로 다운받기</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

export default ExerciseBook3Screen;

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
  },
  captureView: {
    width: 260,
    height: 360,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  overlayText: {
    color: '#888',
    fontSize: 16,
    lineHeight: 28,
    textAlign: 'center',
    fontFamily: 'System',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
