import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import Container from '../Container';
import Icon from 'react-native-vector-icons/Feather';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const BASE_URL = 'http://ceprj.gachon.ac.kr:60023';

const BoardPostScreen = ({ navigation }) => {
  const [photo, setPhoto] = useState(null);
  const [postType, setPostType] = useState('일반');
  const [body, setBody] = useState('');
  const [font, setFont] = useState('');

  const selectMedia = () => {
    launchImageLibrary(
      { mediaType: 'mixed', selectionLimit: 1 },
      (res) => {
        if (!res.didCancel && !res.errorCode && res.assets?.length) {
          setPhoto(res.assets[0]);
        }
      }
    );
  };

  const handleUpload = async () => {
    try {
      const imageUrl = photo?.uri || ''; // 이미지 없으면 빈 문자열
      const type = postType === '필사' ? 'TRANSCRIPTION' : 'GENERAL';

      let fontId = null;
      if (font === 'NanumSquare') fontId = 1;
      else if (font === 'Gothic') fontId = 2;

      const payload = {
        imageUrl,
        content: body,
        postType: type,
        fontId,
      };

      const res = await axios.post(`${BASE_URL}/api/posts`, payload, {
        headers: {
          'Content-Type' : 'application/json'
        }
      });

      if (res.data?.status === 0 || res.data?.status === 200) {
        Alert.alert('게시글 등록 완료', '게시글이 성공적으로 등록되었습니다.');
        navigation.navigate('Board');
      } else {
        Alert.alert('게시글 등록 실패', res.data?.message || '알 수 없는 오류');
      }
    } catch (error) {
      console.log('BASE_URL:', BASE_URL);
      console.log('payload:', {
        imageUrl: '',
        content: body,
        postType: postType === '필사' ? 'TRANSCRIPTION' : 'GENERAL',
        fontId: font === 'NanumSquare' ? 1 : font === 'Gothic' ? 2 : null,
      });

      console.error('게시글 등록 에러:', error);
      Alert.alert(
        '서버 오류',
        error.response?.data?.message || '게시글 등록 중 문제가 발생했습니다.'
      );
    }
  };

  return (
    <Container title="Write" hideBackButton={false} showBottomBar={true}>
      <ScrollView contentContainerStyle={styles.wrapper}>
        {/* 1. 사진/동영상 선택 */}
        <TouchableOpacity style={styles.mediaPicker} onPress={selectMedia}>
          {photo ? (
            <Image source={{ uri: photo.uri }} style={styles.previewImage} />
          ) : (
            <>
              <Icon name="camera" size={40} color="#888" />
              <Text style={styles.mediaText}>사진/동영상</Text>
            </>
          )}
        </TouchableOpacity>

        {/* 2. 게시글 유형 선택 */}
        <View style={styles.typeRow}>
          <Text style={styles.typeLabel}>게시글 유형</Text>
          <View style={styles.radioGroup}>
            {['일반', '필사'].map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.radioItem,
                  postType === type && styles.radioItemSelected,
                ]}
                onPress={() => setPostType(type)}
              >
                <View
                  style={[
                    styles.radioCircle,
                    postType === type && styles.radioCircleSelected,
                  ]}
                />
                <Text
                  style={[
                    styles.radioText,
                    postType === type && styles.radioTextSelected,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 3. 본문 입력 */}
        <TextInput
          style={styles.bodyInput}
          placeholder="입력하세요..."
          placeholderTextColor="#666"
          multiline
          textAlignVertical="top"
          value={body}
          onChangeText={setBody}
        />

        {/* 4. 사용된 폰트 선택 */}
        <View style={styles.fontRow}>
          <Text style={styles.fontLabel}>사용된 폰트</Text>
          <View style={styles.fontPickerContainer}>
            <Picker
              selectedValue={font}
              onValueChange={setFont}
              mode={Platform.OS === 'android' ? 'dialog' : 'dropdown'}
              style={styles.fontPicker}
              itemStyle={styles.fontPickerItem}
            >
              <Picker.Item label="선택 안함" value="" />
              <Picker.Item label="다운받은폰트-나눔스퀘어" value="NanumSquare" />
              <Picker.Item label="다운받은폰트-고딕" value="Gothic" />
            </Picker>
            {Platform.OS === 'ios' && (
              <Icon
                name="chevron-down"
                size={20}
                color="#666"
                style={styles.fontPickerIcon}
              />
            )}
          </View>
        </View>

        {/* 5. 업로드 버튼 */}
        <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
          <Text style={styles.uploadText}>Upload</Text>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    paddingBottom: 32 + 56 + 32,
  },
  mediaPicker: {
    height: 140,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaText: {
    marginTop: 8,
    color: '#666',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  typeLabel: {
    fontSize: 14,
    color: '#333',
    marginRight: 12,
  },
  radioGroup: {
    flexDirection: 'row',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 20,
    marginRight: 8,
  },
  radioItemSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#888',
    marginRight: 6,
  },
  radioCircleSelected: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  radioText: {
    fontSize: 14,
    color: '#444',
  },
  radioTextSelected: {
    color: '#fff',
  },
  bodyInput: {
    height: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  fontRow: {
    marginBottom: 20,
  },
  fontLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  fontPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    height: 56,
    paddingHorizontal: 12,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  fontPicker: {
    flex: 1,
    height: '100%',
    color: '#333',
  },
  fontPickerItem: {
    height: 44,
    fontSize: 14,
  },
  fontPickerIcon: {
    position: 'absolute',
    right: 12,
  },
  uploadButton: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 40,
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BoardPostScreen;
