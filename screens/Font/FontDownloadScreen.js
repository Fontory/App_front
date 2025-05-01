// screens/Font/FontDownloadScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
} from 'react-native';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import Container from '../Container'; // 경로는 실제 구조에 맞게 조정

const FontDownloadScreen = ({ route, navigation }) => {
  const { fontName } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [downloadExt, setDownloadExt] = useState(null);

  const handleDownload = (ext) => {
    setDownloadExt(ext);
    setModalVisible(true); // 별점 모달 열기
  };

  const handleConfirmRating = async () => {
    if (!selectedRating) {
      Alert.alert('⚠️ 평가 필요', '다운로드 전에 별점을 선택해주세요.');
      return;
    }

    try {
      const fileName = `${fontName}.${downloadExt}`;
      const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      await RNFS.copyFileAssets('samplefont.ttf', destPath); // 샘플 파일
      Alert.alert('✅ 다운로드 완료', `${fileName} 이 저장되었습니다.`);
      setModalVisible(false);
      navigation.navigate('Home');

    } catch (err) {
      console.error('❌ 오류:', err);
      Alert.alert('다운로드 실패', '평가 전송 또는 저장에 실패했어요.');
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map(num => (
      <TouchableOpacity key={num} onPress={() => setSelectedRating(num)}>
        <Text style={styles.star}>{selectedRating >= num ? '⭐' : '☆'}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <Container showBottomBar={false} hideBackButton={false}>
      <View style={styles.container}>
        <Text style={styles.title}>폰트 생성 완료!</Text>
        <Text style={styles.fontName}>{fontName}.ttf</Text>

        <Image
          source={require('../../assets/samplefont.png')}
          style={styles.previewImage}
          resizeMode="contain"
        />

        <TouchableOpacity style={styles.downloadBtn} onPress={() => handleDownload('ttf')}>
          <Text style={styles.btnText}>TTF로 다운받기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.downloadBtn} onPress={() => handleDownload('otf')}>
          <Text style={styles.btnText}>OTF로 다운받기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.navigate('Home')}>
          <Text style={[styles.btnText, { color: '#000' }]}>나중에 받을게요</Text>
        </TouchableOpacity>

        {/* 별점 평가 모달 */}
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
      </View>
    </Container>
  );
};

export default FontDownloadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  fontName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  previewImage: {
    width: '100%',
    height: 160,
    marginBottom: 24,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
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
