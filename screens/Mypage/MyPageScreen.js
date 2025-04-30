// /screens/Mypage/MyPageScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Container from '../Container';

const MyPageScreen = ({ navigation }) => {
  // 메뉴 항목 데이터 (onPress 에는 실제 네비 게이션 로직을 넣어주세요)
  const MENU = [
    { icon: 'star', label: '내가 만든 폰트',    onPress: () => {navigation.navigate('MyFont')} },
    { icon: 'heart', label: '관심 폰트',       onPress: () => {navigation.navigate('LikeFont')} },
    { icon: 'download', label: '다운 받은 폰트', onPress: () => {navigation.navigate('SaveFont')} },
    { icon: 'file-text', label: '내 게시물',   onPress: () => {navigation.navigate('MyBoard')} },
    { icon: 'book', label: '내 연습장',  onPress: () => {navigation.navigate('MyNoteBook')} },
    { icon: 'log-out', label: '로그아웃',      onPress: () => {navigation.navigate('Welcome')} },
  ];

  return (
    <Container
      title="My Page"
      hideBackButton={true}
      showBottomBar={true}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {/* 1. 프로필 카드 */}
        <TouchableOpacity
          style={styles.profileCard}
          onPress={() => {
            navigation.navigate('MyProfile')
          }}
        >
          <Image
            source={require('../../assets/profile.png')}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>버그찾은 구운달걀</Text>
            <Text style={styles.userEmail}>abc123@gachon.ac.kr</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#888" />
        </TouchableOpacity>

        {/* 2. 레벨 카드 */}
        <View style={styles.levelCard}>
          <Icon name="seedling" size={20} color="#3cb371" />
          <Text style={styles.levelText}>Level.1 새싹</Text>
          <TouchableOpacity style={styles.infoButton} 
            onPress={() => navigation.navigate('LevelInfo')}>
            <Icon name="info" size={16} color="#888" />
          </TouchableOpacity>
        </View>

        {/* 3. 메뉴 리스트 */}
        <View style={styles.menuCard}>
          {MENU.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.menuItem,
                idx === MENU.length - 1 && { borderBottomWidth: 0 },
              ]}
              onPress={item.onPress}
            >
              <Icon
                name={item.icon}
                size={20}
                color="#333"
                style={styles.menuIcon}
              />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Icon
                name="chevron-right"
                size={16}
                color="#888"
                style={styles.menuChevron}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 32 + 56 + 32, // 아래 탭 바 + 여유
  },

  // 프로필 카드
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 12,
    color: '#666',
  },

  // 레벨 카드
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef1ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  levelText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  infoButton: {
    padding: 4,
  },

  // 메뉴 카드
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 14,
    color: '#333',
  },
  menuChevron: {
    marginLeft: 'auto',
  },
});

export default MyPageScreen;
