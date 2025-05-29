import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import Container from '../Container';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://ceprj.gachon.ac.kr:60023';

const FontUploadScreen = () => {
  const navigation = useNavigation();
  const [fonts, setFonts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFontId, setSelectedFontId] = useState(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userStr = await AsyncStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setCurrentUser(user);

          const response = await fetch(`${BASE_URL}/api/mypage/fonts/my`, {
            credentials: 'include',
          });

          const result = await response.json();

          if (result.status === 200 && result.data) {
            console.log('📦 서버에서 받은 폰트 리스트:', result.data);
            setFonts(result.data);
          } else {
            Alert.alert('에러', result.message || '폰트 불러오기 실패');
          }
        }
      } catch (e) {
        console.error('❌ 폰트 불러오기 오류:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderImageUri = (fontId, description) => {
    return `${BASE_URL}/fonts/${fontId}/render?text=${encodeURIComponent(description)}`;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  const handleUpload = async () => {
    try {
      const response = await fetch(`${BASE_URL}/fonts/${selectedFontId}/publish`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ description }),
      });

      if (response.ok) {
        Alert.alert('성공', '폰트 등록이 완료 되었습니다.');
        setModalVisible(false);
        setDescription('');
        setSelectedFontId(null);
        // reload
        const userStr = await AsyncStorage.getItem('user');
        const user = JSON.parse(userStr);
        const newResponse = await fetch(`${BASE_URL}/api/mypage/fonts/my`, {
          credentials: 'include',
        });
        const result = await newResponse.json();
        setFonts(result.data);
      } else {
        Alert.alert('에러', '폰트 등록에 실패했습니다.');
      }
    } catch (e) {
      console.error('❌ 업로드 실패:', e);
      Alert.alert('에러', '오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <Container title="내 폰트 등록" hideBackButton={false} showBottomBar={true}>
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 40 }} />
      </Container>
    );
  }

  return (
    <Container title="내 폰트 등록" hideBackButton={false} showBottomBar={true}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {fonts.map((font) => {
          const isUploaded = font.isPublic === 'Y';

          return (
            <View key={font.fontId} style={styles.card}>
              <View style={styles.headerRow}>
                <Text style={styles.fontName}>{font.fontName || font.name}</Text>
                <View style={styles.statusGroup}>
                  <Text style={styles.statText}>♥ {font.likeCount}</Text>
                  <Text style={styles.statText}>📥 {font.downloadCount}</Text>
                  {isUploaded ? (
                    <View style={styles.publicBadge}>
                      <Text style={styles.publicText}>공개됨</Text>
                    </View>
                  ) : (
                    <View style={styles.privateBadge}>
                      <Text style={styles.privateText}>비공개</Text>
                    </View>
                  )}
                </View>
              </View>

              <Image
                source={{ uri: renderImageUri(font.fontId, font.description) }}
                style={styles.previewImage}
                resizeMode="contain"
              />

              <View style={styles.footerRow}>
                <Text style={styles.dateText}>{formatDate(font.createdAt)}</Text>
                <TouchableOpacity
                  style={[styles.uploadButton, isUploaded && styles.uploadButtonDisabled]}
                  onPress={() => {
                    if (!isUploaded) {
                      setSelectedFontId(font.fontId);
                      setModalVisible(true);
                    }
                  }}
                  disabled={isUploaded}
                >
                  <Text style={[styles.uploadText, isUploaded && styles.uploadTextDisabled]}>
                    {isUploaded ? '업로드 완료' : '업로드 하기'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>설명글을 작성해 주세요</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder='다른 사람에게 보여줄 소개글을 작성해 주세요!'
              style={styles.modalInput}
              multiline
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleUpload}>
              <Text style={styles.modalButtonText}>업로드</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancelText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Container>
  );
};

export default FontUploadScreen;

const styles = StyleSheet.create({
  scroll: {
    padding: 16,
    paddingBottom: 120,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fontName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#555',
    marginHorizontal: 4,
  },
  publicBadge: {
    backgroundColor: '#e6f0e6',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  publicText: {
    fontSize: 12,
    color: '#2e7d32',
    fontWeight: '600',
  },
  privateBadge: {
    backgroundColor: '#eee',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  privateText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  previewImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  uploadButton: {
    backgroundColor: '#007aff',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  uploadButtonDisabled: {
    backgroundColor: '#ccc',
  },
  uploadText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  uploadTextDisabled: {
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  modalButton: {
    backgroundColor: '#007aff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginBottom: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalCancelText: {
    color: '#007aff',
    fontWeight: 'bold',
  },
});
