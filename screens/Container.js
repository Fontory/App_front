// screens/Container.js
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

// 기본 헤더 높이 및 상단 여백
const HEADER_HEIGHT = 70;
const ICON_SIZE = 24;
const HEADER_TOP_PADDING = Platform.OS === 'android' ? 24 : 0;
// 하단 여유 공간
const BOTTOM_PADDING = -10;

const Container = ({ title, children }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: HEADER_TOP_PADDING, height: HEADER_HEIGHT + HEADER_TOP_PADDING },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[
            styles.backButton,
            { top: HEADER_TOP_PADDING + (HEADER_HEIGHT - ICON_SIZE) / 2 },
          ]}
        >
          <Icon name="chevron-left" size={ICON_SIZE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>{children}</View>

      {/* Bottom spacer */}
      <View style={{ height: HEADER_HEIGHT + HEADER_TOP_PADDING + BOTTOM_PADDING }} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
    paddingHorizontal: 16,
  },
  backButton: {
    position: 'absolute',
    left: 16,
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default Container;
