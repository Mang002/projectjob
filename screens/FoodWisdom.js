import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";

const API_URL = "https://localwisdom.online/app"; // Replace with actual API URL

const FoodWisdom = ({ navigation }) => {
  const [wisdomData, setWisdomData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query
  const [filteredData, setFilteredData] = useState([]); // State for filtered data

  useEffect(() => {
    fetchWisdomData();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredData(wisdomData);
    } else {
      handleSearch(searchQuery);
    }
  }, [searchQuery, wisdomData]);

  const fetchWisdomData = async () => {
    try {
      const response = await fetch(`${API_URL}/wisdom.php`);
      const data = await response.json();
      setWisdomData(data); // Assuming data is an array of wisdom
      setFilteredData(data); // Initialize with all data
      setLoading(false);
    } catch (error) {
      Alert.alert("Error", "Failed to load data");
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    const filtered = wisdomData.filter((wisdom) =>
      wisdom.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="ค้นหาภูมิปัญญาด้านอาหาร..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {filteredData.map((wisdom) => (
          <TouchableOpacity
            key={wisdom.id}
            style={styles.wisdomBox}
            onPress={() =>
              navigation.navigate("foodDetails", { foodId: wisdom.id })
            }
          >
            <Image source={{ uri:'https://localwisdom.online/admin/'+ wisdom.imageUri }} style={styles.wisdomImage} />
            <View style={styles.textContainer}>
              <Text style={styles.wisdomText}>{wisdom.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E8F0F2", // Light blue for a calming background
  },
  scrollContainer: {
    flexGrow: 1,
  },
  searchBar: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 30, // Softer border radius for modern look
    paddingLeft: 20,
    marginBottom: 20, // Spacing for search bar
    marginTop: 20, // Adjust top margin
    backgroundColor: "#fff",
    width: '100%',
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, // Softer shadow
    shadowRadius: 6,
    elevation: 5,
  },
  wisdomBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20, // Softer corners for the cards
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 }, // Slightly larger shadow for depth
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10, // Higher elevation for more depth
  },
  wisdomImage: {
    width: 100,
    height: 100,
    borderRadius: 20, // Rounder images for a softer feel
    marginRight: 15,
    borderWidth: 2,
    borderColor: "#ddd",
    resizeMode: "cover", // Ensures image fits nicely in the space
  },
  textContainer: {
    flex: 1,
  },
  wisdomText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333", // Slightly darker text for readability
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FoodWisdom;
