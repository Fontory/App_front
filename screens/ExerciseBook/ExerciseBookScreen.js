// screens/ExerciseBook/ExerciseBookScreen.js
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Container from '../Container';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.6;
const SPACER_WIDTH = (width - ITEM_WIDTH) / 2;
const BASE_URL = 'http://ceprj.gachon.ac.kr:60023';

const ExerciseBookScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { fontId, fontName, quote: initialQuote } = route.params || {};
  
  const [backgrounds, setBackgrounds] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [quote, setQuote] = useState(initialQuote || '');
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);

  useEffect(() => {
    const fetchBackgrounds = async () => {
      try {
        const res = await fetch(`${BASE_URL}/backgrounds`);
        const json = await res.json();
        setBackgrounds(json);
      } catch (err) {
        console.error('배경 이미지 로드 실패:', err);
        Alert.alert('오류', '배경 이미지를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchBackgrounds();
  }, []);

  const handleScroll = (direction) => {
    const nextIndex = direction === 'left' ? selectedIndex - 1 : selectedIndex + 1;
    if (nextIndex >= 0 && nextIndex < backgrounds.length) {
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }
  };

  const onMomentumScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (ITEM_WIDTH + 20));
    setSelectedIndex(index);
  };

  const handleNext = () => {
  if (!quote.trim()) {
    alert('글귀를 입력해주세요.');
    return;
  }

  const selected = backgrounds[selectedIndex];

  console.log('👉 보낼 fontId:', fontId); // 이거 꼭 추가
  console.log('👉 보낼 backgroundId:', selected?.backgroundId);

  navigation.navigate('ExerciseBook2', {
    background: selected,
    fontId,          // 이 값이 있어야 함!
    fontName,
    quote,
  });
};


  if (loading) {
    return (
      <Container title="연습장 생성" showBottomBar={false}>
        <View style={styles.loader}><ActivityIndicator size="large" color="#000" /></View>
      </Container>
    );
  }

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
            data={backgrounds}
            keyExtractor={(item) => item.backgroundId.toString()}
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
                <Image
                  source={{ uri: `${BASE_URL}${item.imageUrl}` }}
                  style={styles.previewImage}
                  resizeMode="contain"
                />
              </View>
            )}
          />

          <TouchableOpacity style={[styles.overlayArrow, { right: 0 }]} onPress={() => handleScroll('right')}>
            <Text style={styles.arrow}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.step, { marginTop: 20 }]}>STEP 2. 글귀를 입력해주세요</Text>
        <TextInput
          style={styles.input}
          placeholder="예) 지나온 길을 돌아볼 땐 필요한 건 후회가 아닌 평가이고..."
          placeholderTextColor="#999"
          value={quote}
          onChangeText={setQuote}
          multiline
        />

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
    marginBottom: 20,
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
  input: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    backgroundColor: '#eee',
    padding: 16,
    fontSize: 14,
    textAlignVertical: 'top',
    marginBottom: 20,
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
