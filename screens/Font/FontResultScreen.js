import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const BASE_URL = 'http://ceprj.gachon.ac.kr:60023';

const FontResultScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {
    fontName,
    cellImagesPath,
    fontId,
    otfUrl,
    ttfUrl,
    vectorSimilarity,
  } = route.params;

  const characters = [
    "갓", "같", "걓", "곬", "깼", "꺡", "낥", "냥", "넊", "넋", "녊", "놊", "닫", "닭", "덎", "덳", "돳", "땛", "략", "렠", "롅",
    "뢅", "룅", "몃", "몉", "몮", "뫮", "묮", "밟", "볘", "볲", "뵗", "뺐", "뽈", "솨", "솩", "쇩", "쐐", "쐒", "쑒", "앉", "않",
    "얘", "얾", "왻", "욻", "융", "죡", "죤", "줤", "즉", "쭍", "쮜", "춰", "춶", "췶", "츄", "츶", "칛", "칸", "퀟", "퀭", "큟",
    "킞", "탡", "튈", "틈", "틔", "팈", "팥", "퍊", "퓱", "픱", "핥", "핀", "햎", "햳", "훟", "흚", "힚"
  ];

  const [images, setImages] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const imgList = characters.map(char => ({
      uri: `${BASE_URL}${cellImagesPath}/${char}.png`,
      label: char
    }));
    setImages(imgList);
  }, [cellImagesPath]);

  const displayedImages = showAll ? images : images.slice(0, 20);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>셀 추출 결과</Text>

      <View style={styles.previewBox}>
        <View style={styles.gridContainer}>
          {displayedImages.map((item, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image
                source={{ uri: item.uri }}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.imageLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {!showAll && (
          <TouchableOpacity style={styles.smallButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.smallButtonText}>전체 보기</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate('FontDownload', {
          fontName,
          cellImagesPath,
          fontId,
          otfUrl: otfUrl.replace('/fonts/', ''),
          ttfUrl: ttfUrl.replace('/fonts/', ''),  
          vectorSimilarity
        })}
      >
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>전체 글자 보기</Text>
          <View style={styles.gridContainer}>
            {images.map((item, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image
                  source={{ uri: item.uri }}
                  style={styles.image}
                  resizeMode="contain"
                />
                <Text style={styles.imageLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>닫기</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </ScrollView>
  );
};

export default FontResultScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    color: '#222'
  },
  previewBox: {
    backgroundColor: '#f2f2f2',
    borderRadius: 16,
    padding: 12,
    marginBottom: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  imageWrapper: {
    width: 70,
    height: 90,
    margin: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 2,
    backgroundColor: '#f8f8f8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3
  },
  image: {
    width: 60,
    height: 60,
    marginBottom: 4,
    borderRadius: 4
  },
  imageLabel: {
    fontSize: 12,
    color: '#333'
  },
  smallButton: {
    marginTop: 8,
    marginRight: 0,
    alignSelf: 'flex-end',
    backgroundColor: '#4a60f5',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6
  },
  smallButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  nextButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  modalContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20
  },
  button: {
    backgroundColor: '#4a60f5',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
