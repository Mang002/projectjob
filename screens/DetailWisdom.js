import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TextInput, Button, ScrollView, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

const DetailWisdom = () => {
  const [imageUri, setImageUri] = useState('https://img.youtube.com/vi/example_image_id/0.jpg');
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/embed/example_video_id');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const navigation = useNavigation(); // For navigating to MapScreen

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment]);
      setNewComment('');
    }
  };

  const handleNavigateToMap = () => {
    navigation.navigate('MapScreen'); // Link to MapScreen.js
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Image Section */}
      <View style={styles.section}>
        <TouchableOpacity onPress={() => setImageUri('https://img.youtube.com/vi/another_image_id/0.jpg')}>
          <View style={styles.imageContainer}>
            <Text style={styles.imageText}>รูปภาพ</Text>
          </View>
        </TouchableOpacity>
        <Image source={{ uri: imageUri }} style={styles.image} />
      </View>

      {/* Text Section */}
      <Text style={styles.title}>ขนมไทยโบราณ</Text>
      <Text style={styles.description}>
        ขนมไทยโบราณที่มีความหวานหอมละมุนลิ้น เอกลักษณ์และรสชาติที่ชวนหลงใหล
      </Text>

      {/* Video Section */}
      <View style={styles.section}>
        <TouchableOpacity onPress={() => setVideoUrl('https://www.youtube.com/embed/another_video_id')}>
          <View style={styles.videoContainer}>
            <Text style={styles.videoText}>วีดีโอ</Text>
          </View>
        </TouchableOpacity>
        <WebView
          style={styles.video}
          source={{ uri: videoUrl }}
          javaScriptEnabled={true}
          allowsFullscreenVideo={true}
        />
      </View>

      {/* Comments Section */}
      <View style={styles.section}>
        <Text style={styles.label}>comments:</Text>
        <TextInput
          style={styles.input}
          placeholder="add a comment"
          onChangeText={setNewComment}
          value={newComment}
        />
        <Button title="post comment" onPress={handleAddComment} />
        {comments.length > 0 && (
          <View style={styles.commentsContainer}>
            {comments.map((comment, index) => (
              <Text key={index} style={styles.comment}>{comment}</Text>
            ))}
          </View>
        )}
      </View>

      {/* Map Section */}
      <TouchableOpacity onPress={handleNavigateToMap} style={styles.mapIconContainer}>
        <Text style={styles.mapIconText}>แผนที่</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  section: {
    marginBottom: 20,
  },
  imageContainer: {
    backgroundColor: '#003366',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  imageText: {
    color: '#fff',
    fontSize: 18,
  },
  image: {
    width: 300,
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  videoContainer: {
    backgroundColor: '#003366',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  videoText: {
    color: '#fff',
    fontSize: 18,
  },
  video: {
    width: 300,
    height: 200,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  commentsContainer: {
    marginTop: 10,
    width: '100%',
  },
  comment: {
    fontSize: 14,
    padding: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginBottom: 5,
  },
  mapIconContainer: {
    backgroundColor: '#003366',
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    width: 100,
    marginTop: 20,
  },
  mapIconText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default DetailWisdom;
