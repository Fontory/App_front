import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import Container from '../Container';
import Icon from 'react-native-vector-icons/Feather';

// 안전한 Feather 아이콘으로 모두 수정
const LEVELS = [
  { key: '1', label: '새싹', icon: 'user' },
  { key: '2', label: '연습생', icon: 'smile' },
  { key: '3', label: '필사러', icon: 'book' },
  { key: '4', label: '디자이너', icon: 'edit' },
  { key: '5', label: '마스터', icon: 'award' },
];

const LevelInfoScreen = () => {
  return (
    <Container
      title="Level Information"
      hideBackButton={false}
      showBottomBar={true}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {LEVELS.map(({ key, label, icon }) => (
          <View key={key} style={styles.card}>
            <Icon name={icon} size={24} color="#0051ff" style={styles.icon} />
            <Text style={styles.text}>{`Level.${key} ${label}`}</Text>
          </View>
        ))}
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32 + 56 + 32,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef1ff',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  icon: {
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

export default LevelInfoScreen;
