import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
// import ReportScreen from './ReportScreen';

const DetailScreen = ({ route, navigation }) => {
  const { title, content, imageUrl } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{content}</Text>
      <TouchableOpacity style={styles.mapButton} onPress={() => navigation.navigate('MapScreen')}>
        <Text style={styles.mapButtonText}>ดูแผนที่</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  mapButton: {
    backgroundColor: '#20b2aa',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default DetailScreen;
