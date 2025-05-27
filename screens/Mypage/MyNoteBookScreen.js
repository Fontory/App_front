// screens/Mypage/MyNoteBookScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import Container from '../Container';
import axios from 'axios';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 48) / 2;
const BASE_URL = 'http://ceprj.gachon.ac.kr:60023';

const MyNoteBookScreen = () => {
  const [notebooks, setNotebooks] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/mypage/practices`)
      .then((res) => {
        if (res.data.status === 0 || res.data.status === 200) {
          setNotebooks(res.data.data);
        } else {
          Alert.alert('불러오기 실패', res.data.message);
        }
      })
      .catch((err) => {
        console.error('❌ 연습장 조회 오류:', err.message);
        Alert.alert('에러', '연습장 데이터를 불러오지 못했습니다.');
      });
  }, []);

  return (
    <Container
      title="My NoteBook"
      hideBackButton={false}
      showBottomBar={true}
    >
      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {notebooks.map((nb) => (
          <TouchableOpacity
            key={nb.sheetId}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => {
              // TODO: 상세 페이지 네비게이션
            }}
          >
            <View style={styles.labelWrapper}>
              <Text style={styles.labelText}>{nb.phrase || '필사 문구 없음'}</Text>
            </View>
            <View style={styles.imagePlaceholder}>
              {nb.imageUrl && (
                <Image
                  source={{ uri: `${BASE_URL}${nb.imageUrl}` }}
                  style={{ width: '100%', height: '100%' }}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    paddingBottom: 32 + 56 + 16,
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE + 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  labelWrapper: {
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fafafa',
  },
  labelText: {
    fontSize: 12,
    color: '#333',
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#ddd',
  },
});

export default MyNoteBookScreen;
