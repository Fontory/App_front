import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import Container from './Container';


const HomeScreen = () => {
  const navigation = useNavigation();

  const handleCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        saveToPhotos: true,
      },
      response => {
        if (response.didCancel) {
          console.log('사용자가 카메라를 취소했어요.');
        } else if (response.errorCode) {
          Alert.alert('카메라 오류', response.errorMessage || '');
        } else {
          console.log('📸 촬영 결과:', response);
        }
      },
    );
  };

  const handleGallery = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        if (uri) {
          navigation.navigate('FontGeneration', { imageUri: uri });
        }
      } else {
        Alert.alert('선택 오류', '이미지를 선택하지 않았어요.');
      }
    });
  };

  return (
    <Container
      hideBackButton={true}
      showBottomBar={true}
    >
      <View style={styles.innerContainer}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>나만의 폰트를 생성하세요!</Text>
        <Text style={styles.subtitle}>
          손 글씨가 잘 보이는 사진을 업로드 해 주세요
        </Text>
  
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleCamera}>
            <Image source={require('../assets/camera.png')} style={styles.icon} />
            <Text style={styles.buttonText}>촬영하기</Text>
          </TouchableOpacity>
  
          <TouchableOpacity style={styles.button} onPress={handleGallery}>
            <Image source={require('../assets/gallery.png')} style={styles.icon} />
            <Text style={styles.buttonText}>갤러리 선택</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 24,
  },
  logo: {
    width: 600,
    height: 250,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
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
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    width: 120,
    marginHorizontal: 10,
  },
  icon: {
    width: 70,
    height: 70,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
