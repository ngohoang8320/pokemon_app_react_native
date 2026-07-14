import { useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Details() {
  const { title, image, imageBack } = useLocalSearchParams<{
    title: string;
    image: string;
    imageBack: string;
  }>();

  return (
    <ScrollView
      contentContainerStyle={{
        gap: 16,
        padding: 16
      }}
    >
      <Text style={styles.title}>{title}</Text>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        <Image
          source={{ uri: imageBack }}
          style={{ width: 200, height: 200 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 800,
    textAlign: 'center'
  }
});
