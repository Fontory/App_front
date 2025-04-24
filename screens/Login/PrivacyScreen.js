// screens/Login/PrivacyScreen.js
import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import Container from '../Container';

const PrivacyScreen = ({ navigation }) => (
  <Container title="Privacy Policy">
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.box}>
        <Text style={styles.boxText}>제작 : 앗넵금지</Text>
      </View>

      <Text style={styles.policyTitle}>Privacy Policy</Text>

      <View style={styles.policyList}>
        <Text style={styles.policyItem}>1. 정책</Text>
        <Text style={styles.policyItem}>2. 정책</Text>
        <Text style={styles.policyItem}>3. 정책</Text>
        <Text style={styles.policyItem}>4. 정책정책</Text>
      </View>
    </ScrollView>
  </Container>
);

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  box: {
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
  },
  boxText: {
    color: '#444',
  },
  policyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0051ff',
    marginBottom: 12,
  },
  policyList: {
    paddingLeft: 10,
  },
  policyItem: {
    fontSize: 14,
    marginBottom: 8,
  },
});

export default PrivacyScreen;
