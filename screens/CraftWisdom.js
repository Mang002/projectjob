import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput, Button } from 'react-native';

const API_URL = "https://localwisdom.online/app"; // Replace with the actual API URL

const CraftWisdom = ({ navigation }) => {
  const [wisdomData, setWisdomData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

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
      const response = await fetch(`${API_URL}/wisdomcraft.php`);
      const data = await response.json();
      setWisdomData(data);
      setFilteredData(data);
      setLoading(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
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
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="ค้นหาภูมิปัญญาด้านหัตถกรรม..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        {/* <Button title="ค้นหา" onPress={() => handleSearch(searchQuery)} /> */}
      </View>

      {/* Craft Wisdom List */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {filteredData.map((wisdom) => (
          <TouchableOpacity
            key={wisdom.id}
            style={styles.wisdomBox}
            onPress={() => navigation.navigate('CraftDetails', { craftId: wisdom.id })}
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
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  searchBar: {
    flex: 1,
    height: 45,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: 15,
    marginRight: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  wisdomBox: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  wisdomImage: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginRight: 15,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  textContainer: {
    flex: 1,
  },
  wisdomText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CraftWisdom;
