import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  Alert, Platform, PermissionsAndroid, ScrollView,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import axios from 'axios';
import { unzip } from 'react-native-zip-archive';
import { useNavigation } from '@react-navigation/native';
import Container from './Container';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [savedPath, setSavedPath] = useState(null);
  const [thumbnailPaths, setThumbnailPaths] = useState([]);

  const requestStoragePermission = async () => {
    if (Platform.OS !== 'android') return true;

    try {
      const granted = await PermissionsAndroid.request(
        Platform.Version >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: '저장소 권한 요청',
          message: '템플릿 저장을 위해 권한이 필요합니다.',
          buttonPositive: '확인',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const handleDownloadTemplate = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('권한 거부됨', '템플릿 저장을 위해 권한이 필요합니다.');
      return;
    }

    try {
      const destPath = `${RNFS.DocumentDirectoryPath}/HandwritingTemplate.png`;
      await RNFS.copyFileAssets('HandwritingTemplate.png', destPath);
      setSavedPath('file://' + destPath);
      setShowModal(true);
    } catch (error) {
      console.error('❌ 다운로드 실패:', error);
      Alert.alert('오류 발생', '템플릿 다운로드 중 문제가 발생했습니다.');
    }
  };

  const handleGallery = () => {
    launchImageLibrary({ mediaType: 'photo' }, async response => {
      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        const uri = asset.uri;

        Image.getSize(uri, (width, height) => {
          if (width < 1200 || height < 900) {
            Alert.alert('이미지 오류', '정해진 템플릿 이미지를 선택해 주세요.');
            return;
          }

          navigation.navigate('FontNaming', { imageUri: uri });
        }, error => {
          Alert.alert('이미지 정보 오류', '이미지 크기를 확인할 수 없습니다.');
        });
      } else {
        Alert.alert('선택 오류', '이미지를 선택하지 않았어요.');
      }
    });
  };


  return (
    <Container hideBackButton={true} showBottomBar={true}>
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>나만의 폰트를 생성하세요!</Text>
        <Text style={styles.subtitle}>손 글씨가 잘 보이는 사진을 업로드 해 주세요</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleDownloadTemplate}>
            <Image source={require('../assets/download.png')} style={styles.icon} />
            <Text style={styles.buttonText}>손글씨 템플릿 다운로드</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleGallery}>
            <Image source={require('../assets/gallery.png')} style={styles.icon} />
            <Text style={styles.buttonText}>갤러리 선택</Text>
          </TouchableOpacity>
        </View>

        {thumbnailPaths.length > 0 && (
          <View style={{ marginTop: 40 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>썸네일 미리보기</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {thumbnailPaths.map((path, idx) => (
                <Image
                  key={idx}
                  source={{ uri: path }}
                  style={{ width: 64, height: 64, borderRadius: 4, margin: 4 }}
                />
              ))}
            </View>
          </View>
        )}

        {showModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>다운로드 완료</Text>
              <Text style={{ fontSize: 12, color: '#555', marginBottom: 10 }}>{savedPath}</Text>
              <Image
                source={{ uri: savedPath }}
                style={{ width: 250, aspectRatio: 1.414, borderRadius: 8, resizeMode: 'contain' }}
              />
              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.modalButton}>
                <Text style={{ color: 'white' }}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </Container>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  innerContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  logo: {
    width: 600,
    height: 250,
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 36,
  },
  button: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    width: 130,
    marginHorizontal: 10,
  },
  icon: {
    width: 70,
    height: 80,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    width: 300,
  },
  modalButton: {
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#333',
    borderRadius: 8,
  },
});
