// screens/Font/FontDetailScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import Container from '../Container';
import { useRoute } from '@react-navigation/native';

const FontDetailScreen = () => {
  const route = useRoute();
  const { font } = route.params;
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(prev => !prev);
    // TODO: 서버 좋아요 API 연결
  };

  const handleDownload = (type) => {
    const url = type === 'ttf' ? font.ttfUrl : font.otfUrl;
  
    if (!url || url === 'string') {
      Alert.alert('❌ 오류', 'URL이 올바르지 않아요.');
      return;
    }
  
    Alert.alert(
      `${type.toUpperCase()} 다운로드 주소`,
      url,
      [{ text: '확인' }]
    );
  };

  return (
    <Container title={font.name} showBottomBar={false}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.metaRow}>
          <Image
            source={require('../../assets/sampleprofile.png')}
            style={styles.profile}
          />

          <Text style={styles.nickname}>@{font.userId}</Text>
          <View style={styles.metrics}>
            <Text style={styles.metricText}>좋아요 {font.likeCount}</Text>
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
            font.originalImageUrl && font.originalImageUrl !== 'string'
              ? { uri: `http://ceprj.gachon.ac.kr:60023/handwriting/${font.originalImageUrl}` }
              : require('../../assets/sample.png')
          }
          style={styles.sampleImage}
          resizeMode="contain"
        />
        <TouchableOpacity onPress={() => handleDownload('ttf')} style={styles.downloadBtn}>
          <Text style={styles.downloadText}>TTF 다운로드</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleDownload('otf')} style={styles.downloadBtn}>
          <Text style={styles.downloadText}>OTF 다운로드</Text>
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
});
