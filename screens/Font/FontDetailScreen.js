import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Container from '../Container';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';

const BASE_URL = 'http://ceprj.gachon.ac.kr:60023';

const FontDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { font } = route.params;
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(font.likeCount || 0);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        setCurrentUser(JSON.parse(userStr));
      }
    };
    loadUser();
  }, []);

  const getFullUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `${BASE_URL}/${url.replace(/^\/?/, '')}`;
  };

  const handleLike = async () => {
    if (!currentUser?.userId) {
      Alert.alert('로그인 필요', '좋아요를 누르려면 먼저 로그인하세요.');
      return;
    }

    if (liked) {
      setLiked(false);
      setLikeCount(prev => prev - 1);
    } else {
      try {
        const res = await fetch(
          `${BASE_URL}/fonts/${font.fontId}/like?userId=${currentUser.userId}`,
          { method: 'POST' }
        );
        if (res.ok) {
          setLiked(true);
          setLikeCount(prev => prev + 1);
        } else {
          const result = await res.text();
          Alert.alert('에러', result);
        }
      } catch (err) {
        console.error('좋아요 실패:', err);
        Alert.alert('오류', '좋아요 중 문제가 발생했습니다.');
      }
    }
  };

  const handleDownload = async (type) => {
    const fileName = type === 'ttf' ? font.ttfUrl : font.otfUrl;
    const url = `${BASE_URL}/fonts/${fileName}`;

    if (!fileName || !url) {
      Alert.alert('❌ 오류', 'URL이 올바르지 않아요.');
      return;
    }

    const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    try {
      const result = await RNFS.downloadFile({
        fromUrl: url,
        toFile: path,
      }).promise;

      if (result.statusCode === 200) {
        Alert.alert('✅ 다운로드 완료', `폰트가 저장되었습니다:\n${path}`);
      } else {
        Alert.alert('❌ 다운로드 실패', `statusCode: ${result.statusCode}`);
      }
    } catch (error) {
      console.error('다운로드 오류:', error);
      Alert.alert('❌ 오류', '다운로드 중 문제가 발생했습니다.');
    }
  };

  const handleCreateExerciseBook = () => {
    navigation.navigate('ExerciseBook', {
    fontId: font.fontId,
    fontName: font.fontName,
});

  };

  return (
    <Container title={font.fontName} showBottomBar={false}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.metaRow}>
          <Image
            source={
              font.creatorProfileImage
                ? { uri: `${getFullUrl(font.creatorProfileImage)}?v=${Date.now()}` }
                : require('../../assets/sampleprofile.png')
            }
            style={styles.profile}
          />

          <Text style={styles.nickname}>@{font.creatorId}</Text>

          <View style={styles.metrics}>
            <Text style={styles.metricText}>좋아요 {likeCount}</Text>
            <Text style={styles.metricText}>다운로드 {font.downloadCount}</Text>
          </View>

          <TouchableOpacity onPress={handleLike}>
            <Text style={{ fontSize: 18, color: liked ? 'red' : '#aaa' }}>
              {liked ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>설명</Text>
        <Text style={styles.description}>{font.description}</Text>

        <Text style={styles.sectionTitle}>샘플 이미지</Text>
        <Image
          source={
            font.originalImageUrl
              ? { uri: getFullUrl(`handwriting/${font.originalImageUrl}`) }
              : require('../../assets/sample.png')
          }
          style={styles.sampleImage}
          resizeMode="contain"
        />

        <TouchableOpacity onPress={() => handleDownload('ttf')} style={styles.downloadBtn}>
          <Text style={styles.downloadText}>TTF로 다운받기</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleDownload('otf')} style={styles.downloadBtn}>
          <Text style={styles.downloadText}>OTF로 다운받기</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCreateExerciseBook} style={styles.exerciseBtn}>
          <Text style={styles.exerciseText}>연습장 만들기</Text>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
};

export default FontDetailScreen;

const styles = StyleSheet.create({
  container: { padding: 20 },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
    flexWrap: 'wrap',
  },
  profile: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ccc',
  },
  nickname: {
    fontSize: 14,
    fontWeight: '500',
  },
  metrics: {
    flexDirection: 'row',
    gap: 12,
    marginLeft: 'auto',
  },
  metricText: {
    fontSize: 12,
    color: '#444',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  sampleImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#eee',
  },
  downloadBtn: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  downloadText: {
    color: '#fff',
    fontSize: 16,
  },
  exerciseBtn: {
    backgroundColor: '#4A64FF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  exerciseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
