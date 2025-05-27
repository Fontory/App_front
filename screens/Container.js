// screens/Container.js
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ICON_SIZE = 24;
const HEADER_HEIGHT = 70;
const STATUS_BAR_PADDING = Platform.OS === 'android' ? 24 : 0;
const BOTTOM_BAR_HEIGHT = 56;
const BOTTOM_BAR_MARGIN = 32;
const SIDE_MARGIN = 30;

const Container = ({
  title,
  children,
  hideBackButton = false,
  showBottomBar = false,
}) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ✅ title이 있을 때만 header 영역 렌더링 */}
      {title && (
        <View style={[styles.header, { paddingTop: STATUS_BAR_PADDING }]}>
          {!hideBackButton && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Icon name="chevron-left" size={ICON_SIZE} />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
      )}

      {/* 콘텐츠 영역 */}
      <View style={styles.content}>{children}</View>

      {/* 하단 여백 (탭바가 위로 뜨기 때문에 공간 확보용) */}
      {showBottomBar && <View style={{ height: BOTTOM_BAR_HEIGHT + BOTTOM_BAR_MARGIN }} />}

      {/* 하단 탭바 */}
      {showBottomBar && (
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => navigation.navigate('Home')}
          >
            <Icon name="home" size={ICON_SIZE} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => navigation.navigate('FontList')}
          >
            <Icon name="list" size={ICON_SIZE} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => navigation.navigate('Board')}
          >
            <Icon name="grid" size={ICON_SIZE} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => navigation.navigate('MyPage')}
          >
            <Icon name="user" size={ICON_SIZE} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: STATUS_BAR_PADDING + HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
    paddingHorizontal: SIDE_MARGIN,
  },
  backButton: {
    position: 'absolute',
    left: SIDE_MARGIN,
    top: STATUS_BAR_PADDING + (HEADER_HEIGHT - ICON_SIZE) / 2,
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    position: 'absolute',
    bottom: BOTTOM_BAR_MARGIN,
    left: SIDE_MARGIN,
    right: SIDE_MARGIN,
    height: BOTTOM_BAR_HEIGHT,
    flexDirection: 'row',
    backgroundColor: '#000',
    borderRadius: BOTTOM_BAR_HEIGHT / 2,
    overflow: 'hidden',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    width: SCREEN_WIDTH - SIDE_MARGIN * 2,
    alignSelf: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
});

export default Container;
