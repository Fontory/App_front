// screens/Board/OtherProfileScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Container from '../Container';

const profileImg = require('../../assets/profile.png');
const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 48) / 2;

const OtherProfileScreen = ({ navigation }) => {
  const [tab, setTab] = useState('게시물');

  return (
    <Container title="버그찾은 구운달걀 님" hideBackButton={false} showBottomBar={true}>
      <SafeAreaView style={styles.root}>
        <ScrollView contentContainerStyle={styles.wrapper}>
          {/* ───────── 프로필 아바타 & 레벨 ───────── */}
          <View style={styles.avatarWrapper}>
            <Image source={profileImg} style={styles.avatarImage} />
          </View>

          <View style={styles.levelBox}>
            <Icon name="leaf" size={20} color="#4caf50" />
            <Text style={styles.levelText}>Level.1 새싹</Text>
          </View>

          {/* ───────── 탭 (게시물 / 폰트) ───────── */}
          <View style={styles.tabRow}>
            {['게시물', '폰트'].map((label) => (
              <TouchableOpacity
                key={label}
                style={[
                  styles.tabButton,
                  tab === label && styles.tabButtonActive,
                ]}
                onPress={() => setTab(label)}
              >
                <Text
                  style={[
                    styles.tabText,
                    tab === label && styles.tabTextActive,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ───────── 탭별 콘텐츠 ───────── */}
          <View style={styles.contentGrid}>
            {tab === '게시물'
              ? Array.from({ length: 4 }).map((_, i) => (
                  <View key={i} style={styles.cardPlaceholder} />
                ))
              : Array.from({ length: 4 }).map((_, i) => (
                  <View key={i} style={styles.cardPlaceholder} />
                ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Container>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  wrapper: { padding: 16, paddingBottom: 100 },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 12,
},
    avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: 'cover',
  },
  levelBox: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#eef1ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  levelText: { marginLeft: 6, fontSize: 14, color: '#333' },
  tabRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 16,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
  },
  tabButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  tabText: { fontSize: 14, color: '#666' },
  tabTextActive: { color: '#fff' },
  contentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardPlaceholder: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginBottom: 16,
  },
});

export default OtherProfileScreen;
