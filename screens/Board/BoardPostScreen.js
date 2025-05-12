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
    // 1) 서버에 업로드 처리 로직 수행 (API 호출 등)
    console.log({ photo, postType, body, font });
    navigation.navigate('BoardDetail');
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

        {/* 4. 사용된 폰트 선택 (선택사항) */}
        <View style={styles.fontRow}>
          {/* 라벨 */}
          <Text style={styles.fontLabel}>사용된 폰트</Text>
          {/* 드롭다운 컨테이너 */}
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
              <Picker.Item label="다운받은폰트-고딕"     value="Gothic" />
            </Picker>
            {/* iOS에서만 커스텀 아이콘 표시 */}
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

  // 1. 미디어 픽커
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

  // 2. 게시글 유형 라디오
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

  // 3. 본문 입력
  bodyInput: {
    height: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
  },

  // 4. 사용된 폰트
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
    height: 56,           // 충분한 높이 확보
    paddingHorizontal: 12,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  fontPicker: {
    flex: 1,
    height: '100%',       // 박스를 꽉 채우도록
    color: '#333',        // selectedValue 색상(Android)
  },
  fontPickerItem: {
    height: 44,           // 드롭다운 아이템 높이
    fontSize: 14,
  },
  fontPickerIcon: {
    position: 'absolute',
    right: 12,
  },

  // 5. 업로드 버튼
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
