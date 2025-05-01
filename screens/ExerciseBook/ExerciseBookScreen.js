// screens/ExerciseBook/ExerciseBookScreen.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import Container from '../Container';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.6;
const SPACER_WIDTH = (width - ITEM_WIDTH) / 2;

const rawBackgrounds = [
  {
    id: '1',
    name: 'BackgroundSample1',
    image: require('../../assets/BackgroundSample1.png'),
  },
  {
    id: '2',
    name: 'BackgroundSample2',
    image: require('../../assets/BackgroundSample2.png'),
  },
  {
    id: '3',
    name: 'BackgroundSample3',
    image: require('../../assets/BackgroundSample3.png'),
  },
];

const ExerciseBookScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { fontName } = route.params;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleNext = () => {
    const selected = rawBackgrounds[selectedIndex];
    navigation.navigate('ExerciseBook2', {
      background: selected,
      fontName,
      quote: '', // 다음 화면에서 quote 입력
    });
  };

  const handleScroll = (direction) => {
    const nextIndex = direction === 'left' ? selectedIndex - 1 : selectedIndex + 1;
    if (nextIndex >= 0 && nextIndex < rawBackgrounds.length) {
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }
  };

  const onMomentumScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (ITEM_WIDTH + 20));
    setSelectedIndex(index);
  };

  return (
    <Container title="연습장 생성" showBottomBar={false}>
      <View style={styles.inner}>
        <Text style={styles.subtitle}>폰트의 글씨체가 마음에 드셨나요?</Text>
        <Text style={styles.subtitle}>내가 원하는 폰트를 따라 쓸 수 있는 연습장을 생성합니다!</Text>

        <View style={styles.separator} />
        <Text style={styles.step}>STEP 1. 원하는 배경을 선택해 주세요</Text>

        <View style={styles.carouselWrapper}>
          <TouchableOpacity style={[styles.overlayArrow, { left: 0 }]} onPress={() => handleScroll('left')}>
            <Text style={styles.arrow}>{'<'}</Text>
          </TouchableOpacity>

          <FlatList
            ref={flatListRef}
            horizontal
            data={rawBackgrounds}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            snapToInterval={ITEM_WIDTH + 20}
            decelerationRate="fast"
            bounces={false}
            contentContainerStyle={{ paddingHorizontal: SPACER_WIDTH }}
            getItemLayout={(_, index) => ({
              length: ITEM_WIDTH + 20,
              offset: (ITEM_WIDTH + 20) * index,
              index,
            })}
            onMomentumScrollEnd={onMomentumScrollEnd}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.previewImage} resizeMode="contain" />
              </View>
            )}
          />

          <TouchableOpacity style={[styles.overlayArrow, { right: 0 }]} onPress={() => handleScroll('right')}>
            <Text style={styles.arrow}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>다음</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

export default ExerciseBookScreen;

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  step: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  carouselWrapper: {
    width: '100%',
    height: ITEM_WIDTH * 1.3,
    marginBottom: 40,
    justifyContent: 'center',
  },
  overlayArrow: {
    position: 'absolute',
    top: '40%',
    zIndex: 10,
    padding: 10,
  },
  arrow: {
    fontSize: 28,
    color: '#333',
  },
  imageContainer: {
    width: ITEM_WIDTH,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: ITEM_WIDTH * 1.3,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  nextButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 10,
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
  },
});
