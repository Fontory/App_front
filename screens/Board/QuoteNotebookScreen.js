import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Container from '../Container';
import { useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const ACTIVE_WIDTH = width * 0.6;
const SIDE_WIDTH   = width * 0.25;

const IMAGES = [
  require('../../assets/notebook1.jpg'),
  require('../../assets/notebook2.jpg'),
  require('../../assets/notebook3.jpg'),
];

const QuoteNotebookScreen = ({ navigation }) => {
  // Android에서 LayoutAnimation 활성화
  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const route = useRoute();
  const { previewText, fontSize, fontFamily, fontId } = route.params;

  const [currentIndex, setCurrentIndex] = useState(0);
  const len = IMAGES.length;
  const prevIndex = (currentIndex + len - 1) % len;
  const nextIndex = (currentIndex + 1) % len;

  const goPrev = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCurrentIndex(prevIndex);
  };
  const goNext = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCurrentIndex(nextIndex);
  };

  const handleComplete = () => {
    navigation.navigate('QuoteComplete', {
      previewText,
      fontSize,
      fontFamily,
      fontId,
      selectedImage: IMAGES[currentIndex],
    });
  };

  return (
    <Container
      title="Quote Of The Day"
      hideBackButton={false}
      showBottomBar={true}
    >
      <Text style={styles.instruction}>
        STEP 1. 원하는 연습장 배경을 선택해 주세요
      </Text>

      <View style={styles.carouselWrapper}>
        {/* 왼쪽 화살표 */}
        <TouchableOpacity onPress={goPrev} style={styles.leftArrow}>
          <Icon name="chevron-left" size={32} color="#000" />
        </TouchableOpacity>

        {/* 이미지 3장 */}
        <View style={styles.imagesRow}>
          <Image
            source={IMAGES[prevIndex]}
            style={[styles.image, styles.sideImage]}
          />
          <Image
            source={IMAGES[currentIndex]}
            style={[styles.image, styles.activeImage]}
          />
          <Image
            source={IMAGES[nextIndex]}
            style={[styles.image, styles.sideImage]}
          />
        </View>

        {/* 오른쪽 화살표 */}
        <TouchableOpacity onPress={goNext} style={styles.rightArrow}>
          <Icon name="chevron-right" size={32} color="#000" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={handleComplete}
      >
        <Text style={styles.nextText}>다음</Text>
      </TouchableOpacity>
    </Container>
  );
};

const styles = StyleSheet.create({
  instruction: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 12,
  },
  carouselWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  leftArrow: {
    position: 'absolute',
    left: 0,
    top: '50%',
    marginTop: -16,
    zIndex: 1,
    padding: 8,
  },
  rightArrow: {
    position: 'absolute',
    right: 0,
    top: '50%',
    marginTop: -16,
    zIndex: 1,
    padding: 8,
  },
  imagesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    borderRadius: 8,
    resizeMode: 'cover',
  },
  sideImage: {
    width: SIDE_WIDTH,
    height: SIDE_WIDTH * 1.2,
    opacity: 0.6,
    marginHorizontal: 4,
  },
  activeImage: {
    width: ACTIVE_WIDTH,
    height: ACTIVE_WIDTH * 1.2,
    marginHorizontal: 8,
  },
  nextButton: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignSelf: 'center',
    marginTop: 24,
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuoteNotebookScreen;
