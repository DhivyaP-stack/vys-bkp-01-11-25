import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MatchingScoreDetails = ({ route }) => {
  const { score } = route.params; // Get the score from route params

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matching Score Details</Text>
      <Text style={styles.score}>Your Matching Score: {score}%</Text>
      {/* Add more details or components as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 20,
    marginTop: 10,
  },
});

export default MatchingScoreDetails; 