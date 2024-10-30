import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Button,
  Alert,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const ReportScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(true); // Set initial visibility of modal to true

  const allResults = [
    "ภูมิปัญญาด้านอาหาร",
    "ภูมิปัญญาด้านการละเล่น",
    "ภูมิปัญญาด้านหัตกรรม",
    // "ภูมิปัญญาด้านการรักษาโรค",
    "ภูมิปัญญาด้านประเพณี", // Added new category
  ];

  const [filteredResults, setFilteredResults] = useState(allResults);

  const screenMapping = {
    ภูมิปัญญาด้านอาหาร: "FoodWisdom",
    ภูมิปัญญาด้านการละเล่น: "PlayWisdom",
    ภูมิปัญญาด้านหัตกรรม: "CraftWisdom",
    // "ภูมิปัญญาด้านการรักษาโรค": "HealthWisdom",
    ภูมิปัญญาด้านประเพณี: "TraditionWisdom", // New screen mapping
  };

  const imagesMapping = {
    ภูมิปัญญาด้านอาหาร: require("../assets/Image/food_wisdom.jpg"),
    ภูมิปัญญาด้านการละเล่น: require("../assets/Image/play_wisdom.jpg"),
    ภูมิปัญญาด้านหัตกรรม: require("../assets/Image/craft_wisdom.jpg"),
    // "ภูมิปัญญาด้านการรักษาโรค": require("../assets/Image/health_wisdom.jpg"),
    ภูมิปัญญาด้านประเพณี: require("../assets/Image/health_wisdom.jpg"),
  };

  const handleSearch = () => {
    if (searchQuery === "") {
      setFilteredResults(allResults);
    } else {
      setFilteredResults(
        allResults.filter((item) =>
          item.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  };

  const handleBoxPress = (item) => {
    const screen = screenMapping[item];
    if (screen) {
      navigation.navigate(screen);
    } else {
      Alert.alert("Error", `No screen found for: ${item}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Welcome Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              ยินดีต้อนรับเข้าสู่แหล่งเรียนรู้ภูมิปัญญาท้องถิ่นจังหวัดนราธิวาส!
            </Text>
            <Button title="ปิด" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {filteredResults.map((heading, index) => (
          <TouchableOpacity
            key={index}
            style={styles.box}
            onPress={() => handleBoxPress(heading)}
          >
            {/* Use ImageBackground to set the background image */}
            <ImageBackground
              source={imagesMapping[heading]}
              style={styles.imageBackground}
              imageStyle={{ borderRadius: 10 }} 
            >
              <Text style={styles.heading}>{heading}</Text>
            </ImageBackground>
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
  contentContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  box: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    flex: 1,
  },
  imageBackground: {
    width: "100%",
    height: 180, // Set the height of the background image box
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff", // Text color to contrast with background image
    textAlign: "center",
    fontFamily: "sans-serif-medium",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // To make the text more readable with a background overlay
    padding: 5,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
  },
  welcomeImage: {
    width: 250,
    height: 150,
    resizeMode: "cover",
    marginVertical: 10,
  },
});

export default ReportScreen;
