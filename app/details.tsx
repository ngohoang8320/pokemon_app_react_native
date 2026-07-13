import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';

export default function Details() {
  const params = useLocalSearchParams();

  console.log(params);

  return (
    <ScrollView
      contentContainerStyle={{
        gap: 16,
        padding: 16
      }}
    >
      <Text style={styles.title}>{params.name}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
