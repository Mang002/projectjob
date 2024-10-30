import { Text, View, ScrollView } from "react-native";
import React from "react";

const AdminPage = (navigation) => {
    const localWisdomData = [
        {
            title: "Traditional Herbal Medicine",
            description: "Local communities have developed a rich knowledge of herbal medicine over generations...",
        },
        {
            title: "Handwoven Fabrics",
            description: "The art of handweaving fabric is an essential part of our cultural heritage...",
        },
        // Add more items as needed
    ];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.logo}>AdminPage</Text>
            {localWisdomData.map((item, index) => (
                <View key={index} style={styles.wisdomItem}>
                    <Text style={styles.wisdomTitle}>{item.title}</Text>
                    <Text style={styles.wisdomDescription}>{item.description}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = {
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    logo: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#C20029", // You can adjust the color as needed
    },
    wisdomItem: {
        marginBottom: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        backgroundColor: "#f9f9f9",
    },
    wisdomTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    wisdomDescription: {
        fontSize: 14,
        color: "#666",
    },
};

export default AdminPage;

// import React, { useState } from 'react';
// import { StyleSheet, View, Text, TextInput, Button, Image, ScrollView } from 'react-native';
// import { Video } from 'expo-av';
// import MapView, { Marker } from 'react-native-maps';

// const AdminPage = () => {
//   const [imageUri, setImageUri] = useState('');
//   const [textContent, setTextContent] = useState('');
//   const [videoUri, setVideoUri] = useState('');
//   const [mapRegion, setMapRegion] = useState({
//     latitude: 37.78825,
//     longitude: -122.4324,
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421,
//   });
//   const [markerCoords, setMarkerCoords] = useState({
//     latitude: 37.78825,
//     longitude: -122.4324,
//   });

//   // Function to handle adding image, text, video and map
//   const handleImageChange = (uri) => {
//     setImageUri(uri);
//   };

//   const handleVideoChange = (uri) => {
//     setVideoUri(uri);
//   };

//   const handleTextChange = (text) => {
//     setTextContent(text);
//   };

//   const handleMapChange = (latitude, longitude) => {
//     setMarkerCoords({ latitude, longitude });
//     setMapRegion({ ...mapRegion, latitude, longitude });
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {/* Image Input */}
//       <Text style={styles.label}>Add Image URL:</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter image URL"
//         onChangeText={handleImageChange}
//         value={imageUri}
//       />
//       {imageUri ? (
//         <Image source={{ uri: imageUri }} style={styles.image} />
//       ) : (
//         <Text style={styles.placeholder}>No image added</Text>
//       )}

//       {/* Text Input */}
//       <Text style={styles.label}>Add Text Content:</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter text"
//         onChangeText={handleTextChange}
//         value={textContent}
//       />
//       <Text style={styles.textContent}>{textContent || 'No text added'}</Text>

//       {/* Video Input */}
//       <Text style={styles.label}>Add Video URL:</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter video URL"
//         onChangeText={handleVideoChange}
//         value={videoUri}
//       />
//       {videoUri ? (
//         <Video
//           source={{ uri: videoUri }}
//           rate={1.0}
//           volume={1.0}
//           isMuted={false}
//           resizeMode="contain"
//           shouldPlay
//           isLooping
//           style={styles.video}
//         />
//       ) : (
//         <Text style={styles.placeholder}>No video added</Text>
//       )}

//       {/* Map Input */}
//       <Text style={styles.label}>Add Map Coordinates:</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Latitude"
//         keyboardType="numeric"
//         onChangeText={(text) => handleMapChange(parseFloat(text), markerCoords.longitude)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Longitude"
//         keyboardType="numeric"
//         onChangeText={(text) => handleMapChange(markerCoords.latitude, parseFloat(text))}
//       />
//       <MapView
//         style={styles.map}
//         region={mapRegion}
//       >
//         <Marker coordinate={markerCoords} />
//       </MapView>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   input: {
//     width: '100%',
//     padding: 10,
//     marginBottom: 20,
//     backgroundColor: '#fff',
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//   },
//   image: {
//     width: 300,
//     height: 200,
//     marginBottom: 20,
//   },
//   placeholder: {
//     fontSize: 14,
//     color: '#888',
//     marginBottom: 20,
//   },
//   textContent: {
//     fontSize: 18,
//     marginBottom: 20,
//   },
//   video: {
//     width: 300,
//     height: 200,
//     marginBottom: 20,
//   },
//   map: {
//     width: 300,
//     height: 200,
//     marginBottom: 20,
//   },
// });

// export default AdminPage;
