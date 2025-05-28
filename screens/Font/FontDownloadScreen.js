import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import RNFS from 'react-native-fs';
import Container from '../Container';

const BASE_URL = 'http://ceprj.gachon.ac.kr:60023';

const FontDownloadScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {
    fontName,
    fontId,
    vectorSimilarity,
    otfUrl,
    ttfUrl,
    cellImagesPath
  } = route.params;

  const [previewImage, setPreviewImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [downloadExt, setDownloadExt] = useState(null);

  useEffect(() => {
    const trimmedTtfFilename = ttfUrl?.replace(/^\/?.?fonts\//, '');
    const fetchPreviewImage = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/fonts/${fontId}/render`, {
          params: {
            text: `하늘은 오늘도 맑고 푸르다.\n내 마음엔 바람이 분다.\n긴 시간을 지나 여기까지 왔다.\n글자는 나의 이야기를 품고\n너에게 닿기를 바란다.\n손끝에 남은 감정들을 모아\n하나하나 정성껏 써 내려간다.\n지워지지 않는 기억처럼\n이 글도 너의 마음에 남기를.\n오늘도, 그리고 내일도\n나는 너를 생각하며 글을 쓴다.`,
            size: 35,
            ttf: trimmedTtfFilename,
          },
          responseType: 'blob',
        });

        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result;
          if (typeof result === 'string') {
            setPreviewImage(result);
          }
        };
        reader.readAsDataURL(res.data);
      } catch (error) {
        console.error('❌ 미리보기 이미지 요청 실패:', error);
      }
    };
    fetchPreviewImage();
  }, [fontId]);

  const handleDownload = (ext) => {
    setDownloadExt(ext);
    setModalVisible(true);
  };

  const handleConfirmRating = async () => {
    if (!selectedRating) {
      Alert.alert('⚠️ 평가 필요', '다운로드 전에 별점을 선택해주세요.');
      return;
    }

    try {
      // ⭐️ 별점 제출 API 호출
      const ratingRes = await axios.post(
        `${BASE_URL}/fonts/${fontId}/rating`,
        { rating: selectedRating },
        { withCredentials: true } // ✅ 세션 기반 인증용
      );

      if (ratingRes.data.status !== 'success') {
        throw new Error(ratingRes.data.message || '별점 등록 실패');
      }

      // ✅ 폰트 다운로드
      const fileName = `${fontName}.${downloadExt}`;
      const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      const downloadRes = await RNFS.downloadFile({
        fromUrl: `${BASE_URL}/fonts/딸에게 엄마가.ttf`, // 나중에 fromUrl: `${BASE_URL}/fonts/${fileName}`로 수정
        toFile: destPath,
      }).promise;

      if (downloadRes.statusCode === 200) {
        Alert.alert('✅ 다운로드 완료', `${fileName} 이 저장되었습니다.`);
      } else {
        throw new Error(`다운로드 실패: status ${downloadRes.statusCode}`);
      }

      setModalVisible(false);
      navigation.navigate('Home');
    } catch (err) {
      console.error('❌ 오류:', err);
      Alert.alert('다운로드 실패', err.message || '별점 제출 또는 저장 중 문제가 발생했습니다.');
    }
  };



  const renderStars = () => [1, 2, 3, 4, 5].map(num => (
    <TouchableOpacity key={num} onPress={() => setSelectedRating(num)}>
      <Text style={styles.star}>{selectedRating >= num ? '⭐' : '☆'}</Text>
    </TouchableOpacity>
  ));

  return (
    <Container title="" showBottomBar={true} hideBackButton={true}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>폰트 생성 완료!</Text>
        <Text style={styles.fontName}>{fontName}.ttf</Text>

        <View style={styles.previewBox}>
          {previewImage ? (
            <Image source={{ uri: previewImage }} style={styles.previewImage} resizeMode="contain" />
          ) : (
            <Text style={styles.previewPlaceholder}>미리보기 이미지를 불러오는 중...</Text>
          )}
        </View>

        <Text style={styles.accuracyText}>정확도: {(vectorSimilarity * 100).toFixed(1)}%</Text>

        <TouchableOpacity style={styles.downloadBtn} onPress={() => handleDownload('ttf')}>
          <Text style={styles.btnText}>TTF로 다운받기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.downloadBtn} onPress={() => handleDownload('otf')}>
          <Text style={styles.btnText}>OTF로 다운받기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.navigate('Home')}>
          <Text style={[styles.btnText, { color: '#000' }]}>나중에 받을게요</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>평가하기</Text>
              <Text style={styles.modalSub}>폰트가 실제 필체랑 얼마나 비슷한가요?</Text>
              <View style={styles.starRow}>{renderStars()}</View>

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalConfirmBtn} onPress={handleConfirmRating}>
                  <Text style={styles.modalBtnText}>확인</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setModalVisible(false)}>
                  <Text style={[styles.modalBtnText, { color: '#000' }]}>취소</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </Container>
  );
};

export default FontDownloadScreen;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  fontName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  previewBox: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
  },
  previewImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
  },
  previewPlaceholder: {
    fontSize: 16,
    color: '#aaa',
  },
  accuracyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007aff',
    marginBottom: 24,
  },
  downloadBtn: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#eee',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  modalSub: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  starRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  star: {
    fontSize: 32,
    marginHorizontal: 4,
    lineHeight: 36,
    textAlign: 'center',
    includeFontPadding: false,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  modalConfirmBtn: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  modalCancelBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#aaa',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  modalBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});
