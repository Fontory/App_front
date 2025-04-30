// screens/Board/BoardPostScreen.js
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
} from 'react-native';
import Container from '../Container';
import Icon from 'react-native-vector-icons/Feather';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';

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

  const handleUpload = () => {
    // TODO: 업로드 로직
    console.log({ photo, postType, body, font });
  };

  return (
    <Container
      title="Write"
      hideBackButton={false}
      showBottomBar={true}
    >
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

        {/* 2. 게시글 유형 라디오 */}
        <View style={styles.typeRow}>
          {['일반', '필사'].map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.radioButton,
                postType === type && styles.radioButtonSelected
              ]}
              onPress={() => setPostType(type)}
            >
              <Text
                style={[
                  styles.radioText,
                  postType === type && styles.radioTextSelected
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
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

        {/* 4. 사용된 폰트 선택 (선택사항) */}
        <View style={styles.pickerWrapper}>
          <Text style={styles.pickerLabel}>사용된 폰트</Text>
          <Picker
            selectedValue={font}
            onValueChange={setFont}
            style={styles.picker}
            mode="dropdown"
          >
            <Picker.Item label="선택 안함" value="" />
            <Picker.Item label="다운받은폰트-나눔스퀘어" value="NanumSquare" />
            <Picker.Item label="다운받은폰트-고딕" value="Gothic" />
          </Picker>
        </View>

        {/* 5. Upload 버튼 */}
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
    paddingBottom: 32 + 56 + 32, // 아래 바 + 여유
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
    marginBottom: 20,
  },
  radioButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 20,
    paddingVertical: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  radioText: {
    color: '#444',
    fontSize: 14,
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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 30,
    overflow: 'hidden',
  },
  pickerLabel: {
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 8 : 4,
  },
  picker: {
    width: '100%',
    height: Platform.OS === 'ios' ? 180 : 50,
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
