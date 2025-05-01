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
} from 'react-native';
import RNFS from 'react-native-fs';
import Container from '../Container'; // 경로 주의

const FontDetailScreen = ({ route, navigation }) => {
  const { font } = route.params;
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(prev => !prev);
    // 서버 좋아요 POST 요청 예정
  };

  const handleDownload = async (ext) => {
    try {
      const filename = `${font.name}.${ext}`;
      const destPath = `${RNFS.DocumentDirectoryPath}/${filename}`;

      await RNFS.copyFileAssets('samplefont.ttf', destPath);

      Alert.alert('다운로드 완료', `${filename} 이 저장되었습니다.`);
    } catch (err) {
      Alert.alert('오류', '폰트 저장에 실패했어요.');
      console.error(err);
    }
  };

  return (

    <Container title="폰트 상세페이지" showBottomBar={true} hideBackButton={false}>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{font.name}</Text>

        <View style={styles.metaRow}>
          <Image source={font.profile} style={styles.profile} />
          <Text style={styles.nickname}>{font.nickname}</Text>

          <View style={styles.metrics}>
            <Text style={styles.metricText}>좋아요 232</Text>
            <Text style={styles.metricText}>다운로드 82</Text>
          </View>

          <TouchableOpacity onPress={handleLike}>
            <Text style={{ fontSize: 18, color: liked ? 'red' : '#aaa' }}>
              {liked ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>미리보기</Text>
        <Text style={styles.previewText}>{font.description}</Text>

        <Text style={styles.sectionTitle}>필체 사진</Text>
        <Image
          source={require('../../assets/sample.png')}
          style={styles.sampleImage}
          resizeMode="contain"
        />

        <TouchableOpacity style={styles.downloadBtn} onPress={() => handleDownload('ttf')}>
          <Text style={styles.downloadText}>TTF로 다운받기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.downloadBtn} onPress={() => handleDownload('otf')}>
          <Text style={styles.downloadText}>OTF로 다운받기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.exerciseBtn}
          onPress={() =>
            navigation.navigate('ExerciseBook', { fontName: font.name })
          }
        >
          <Text style={styles.exerciseText}>연습장 만들기</Text>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
};

export default FontDetailScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  profile: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
  previewText: {
    fontSize: 16,
    marginBottom: 12,
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
    backgroundColor: '#4F80FF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
  },
  exerciseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
