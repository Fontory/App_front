import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Image,
  TouchableOpacity, ScrollView, Alert,
} from 'react-native';
import Container from '../Container';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';

const BASE_URL = 'http://ceprj.gachon.ac.kr:60023';

const FontDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { font, onLikeToggle } = route.params;

  const [liked, setLiked] = useState(font.liked ?? false);
  const [likeCount, setLikeCount] = useState(font.likeCount ?? 0);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
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

    const url = `${BASE_URL}/fonts/${font.fontId}/like?userId=${currentUser.userId}`;
    const method = liked ? 'DELETE' : 'POST';

    try {
      const res = await fetch(url, { method });
      if (res.ok) {
        const newLiked = !liked;
        setLiked(newLiked);
        setLikeCount(prev => prev + (newLiked ? 1 : -1));
        if (onLikeToggle) onLikeToggle(font.fontId, newLiked);
      } else {
        const result = await res.text();
        Alert.alert('에러', result);
      }
    } catch (err) {
      console.error('좋아요 실패:', err);
      Alert.alert('오류', '좋아요 처리 중 문제가 발생했습니다.');
    }
  };

  const handleDownload = async (type) => {
    const fileName = type === 'ttf' ? font.ttfUrl : font.otfUrl;
    const url = `${BASE_URL}/fonts/${fileName}`;
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

  const renderedDescriptionUrl = `${BASE_URL}/fonts/${font.fontId}/render?text=${encodeURIComponent(font.description)}`;

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
        <Image
          source={{ uri: renderedDescriptionUrl }}
          style={styles.descriptionImage}
          resizeMode="contain"
        />

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
  descriptionImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 4,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
  },
  sampleImage: {
    width: '100%',
    height: 320,
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
