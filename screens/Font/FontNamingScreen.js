import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Container from '../Container';
import axios from 'axios';
import { ActivityIndicator } from 'react-native';

const FontNamingScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { imageUri } = route.params;
  const [fontName, setFontName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async () => {
    if (!fontName.trim()) {
        Alert.alert('알림', '폰트 이름을 입력해 주세요.');
        return;
    }

    setIsLoading(true); // 로딩 시작

    const uri = imageUri;
    const name = uri.split('/').pop() || 'handwriting.png';
    const type = 'image/png';

    const formData = new FormData();
    formData.append('fontName', fontName);
    formData.append('image', {
        uri,
        name,
        type,
    });

    try {
        console.log('📤 서버로 업로드 시작');
        const res = await axios.post(
        'http://ceprj.gachon.ac.kr:60023/fonts/create',
        formData,
        {
            headers: { 'Content-Type': 'multipart/form-data' },
        }
        );

        console.log('✅ 서버 응답 수신 완료');
        console.log('📦 응답 데이터:', res.data);
        navigation.navigate('FontResult', {
            fontName: res.data.fontName,
            fontId: res.data.fontId,
            otfUrl: res.data.otfUrl,
            ttfUrl: res.data.ttfUrl,
            vectorSimilarity: res.data.vectorSimilarity,
            cellImagesPath: res.data.cellImagesPath,
            });
    } catch (err) {
        console.error('❌ 업로드 실패:', err);
        Alert.alert('오류 발생', '폰트 생성 중 문제가 발생했습니다.');
    } finally {
        setIsLoading(false); // 로딩 종료
    }
    };



    return (
    <Container title="" showBottomBar={true} hideBackButton={false}>
        <View style={styles.container}>
        <Text style={styles.title}>다음 템플릿으로{'\n'}폰트 생성을 시작합니다</Text>

        <Image source={{ uri: imageUri }} style={styles.image} />

        <Text style={styles.label}>이 폰트의 이름을 지어주세요</Text>

        <TextInput
            style={styles.input}
            placeholder="예) 폰토리체"
            value={fontName}
            onChangeText={setFontName}
            placeholderTextColor="#aaa"
        />

        <TouchableOpacity style={styles.button} onPress={handleCreate}>
            <Text style={styles.buttonText}>생성하기</Text>
        </TouchableOpacity>
        </View>

        {/* ✅ 요기에 추가하세요! */}
        {isLoading && (
        <View style={styles.loadingOverlay}>
            <View style={styles.loadingBox}>
            <Text style={{ marginBottom: 12 }}>폰트를 생성 중입니다...</Text>
            <ActivityIndicator size="large" color="#4a60f5" />
            </View>
        </View>
        )}
    </Container>
    );
};

export default FontNamingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 24,
    lineHeight: 32,
  },
  image: {
    width: 350,
    aspectRatio: 1.414, // A4 비율
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 30,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4a60f5',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  loadingOverlay: {
  position: 'absolute',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999,
},
loadingBox: {
  backgroundColor: '#fff',
  padding: 24,
  borderRadius: 12,
  alignItems: 'center',
},
});
