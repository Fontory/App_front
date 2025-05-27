// screens/ExerciseBook/ExerciseBook2Screen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Container from '../Container';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://ceprj.gachon.ac.kr:60023';

const ExerciseBook2Screen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { background, fontId, fontName, quote } = route.params;

  const [currentUser, setCurrentUser] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndCreateSheet = async () => {
      try {
        const userStr = await AsyncStorage.getItem('user');
        if (!userStr) {
          Alert.alert('로그인 필요', '로그인 정보를 찾을 수 없습니다.');
          return;
        }

        const user = JSON.parse(userStr);
        setCurrentUser(user);

        console.log('🧾 보낼 데이터:', {
          userId: user.userId,
          fontId,
          backgroundId: background?.backgroundId,
          phrase: quote,
        });

        const response = await fetch(`${BASE_URL}/practice-sheets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.userId,
            fontId,
            backgroundId: background?.backgroundId,
            phrase: quote,
          }),
        });

        if (!response.ok) {
          throw new Error('서버 연습장 생성 실패');
        }

        const result = await response.json();
        setImageUrl(`${BASE_URL}${result.imageUrl}`);
      } catch (err) {
        console.error('❌ 연습장 생성 오류:', err);
        Alert.alert('❌ 오류', '연습장 생성 중 문제가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndCreateSheet();
  }, []);

  const handleDownload = async () => {
    if (!imageUrl) {
      Alert.alert('❌ 오류', '이미지 URL이 없습니다.');
      return;
    }

    try {
      const filename = imageUrl.split('/').pop();
      const localPath = `${RNFS.DocumentDirectoryPath}/${filename}`;

      const res = await RNFS.downloadFile({
        fromUrl: imageUrl,
        toFile: localPath,
      }).promise;

      if (res.statusCode === 200) {
        await Share.open({
          url: `file://${localPath}`,
          type: 'image/png',
          failOnCancel: false,
        })
          .then(() => {
            Alert.alert('✅ 저장 완료', '이미지가 공유 또는 저장되었어요!');
          })
          .catch(err => {
            if (err && err.message !== 'User did not share') {
              console.error('❌ 다운로드 오류:', err);
              Alert.alert('❌ 오류', '다운로드 중 문제가 발생했습니다.');
            }
          });
      }
    } catch (err) {
      console.error('❌ 다운로드 오류:', err);
      Alert.alert('❌ 오류', '다운로드 중 문제가 발생했습니다.');
    }
  };

  return (
    <Container title="연습장 생성 완료!" showBottomBar={false}>
      <View style={styles.inner}>
        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : imageUrl ? (
          <>
            <Image
              source={{ uri: imageUrl }}
              style={styles.previewImage}
              resizeMode="contain"
              onError={() => Alert.alert('이미지를 불러오지 못했습니다.')}
            />

            <TouchableOpacity style={styles.button} onPress={handleDownload}>
              <Text style={styles.buttonText}>PNG로 다운받기</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.errorText}>이미지를 불러오지 못했습니다.</Text>
        )}
      </View>
    </Container>
  );
};

export default ExerciseBook2Screen;

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: 260,
    height: 360,
    borderRadius: 12,
    backgroundColor: '#eee',
    marginBottom: 24,
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
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 16,
  },
});
