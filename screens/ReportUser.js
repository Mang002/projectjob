import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const ReportUser = () => {
  const navigation = useNavigation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);  // State for refreshing

  const fetchData = async () => {
    try {
      const response = await fetch('https://localwisdom.online/app/report_user.php');
      const result = await response.json();
      setData(result);
      setLoading(false);
      setRefreshing(false);  // Stop refreshing when data is fetched
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
      setRefreshing(false);  // Stop refreshing in case of an error
    }
  };

  // Fetch data from API when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);  // Start the refreshing indicator
    fetchData();  // Fetch the data again
  };

  const handlePress = (item, category) => {
    switch (category) {
      case 'food':
        navigation.navigate("foodDetails", { foodId: item.id });
        break;
      case 'craft':
        navigation.navigate('CraftDetails', { craftId: item.id });
        break;
      case 'play':
        navigation.navigate('PlayDetails', { playId: item.id });
        break;
      case 'health':
        navigation.navigate('healthDetail', { healthId: item.id });
        break;
      default:
        break;
    }
  };

  const renderImagesWithNames = (items, category) => (
    <View style={styles.imageRow}>
      {items.slice(0, 3).map((item, index) => (
        <View key={index} style={styles.imageContainer}>
          <TouchableOpacity onPress={() => handlePress(item, category)}>
            <Image
              source={{ uri: 'https://localwisdom.online/admin/' + item.imageUrl }}
              style={styles.image}
            />
          </TouchableOpacity>
          <Text style={styles.imageName}>
            {index + 1}. {item.name}
          </Text>
        </View>
      ))}
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />  // Enable pull-to-refresh
      }
    >
      <Text style={styles.header}>ภูมิปัญญายอดนิยม</Text>

      <View style={styles.category}>
        <Text style={styles.categoryTitle}>ภูมิปัญญายอดนิยมด้านอาหาร</Text>
        {renderImagesWithNames(data.food, 'food')}
      </View>

      <View style={styles.category}>
        <Text style={styles.categoryTitle}>ภูมิปัญญายอดนิยมด้านหัตถกรรม</Text>
        {renderImagesWithNames(data.craft, 'craft')}
      </View>

      <View style={styles.category}>
        <Text style={styles.categoryTitle}>ภูมิปัญญายอดนิยมด้านการละเล่น</Text>
        {renderImagesWithNames(data.play, 'play')}
      </View>

      <View style={styles.category}>
        <Text style={styles.categoryTitle}>ภูมิปัญญายอดนิยมด้านประเพณี</Text>
        {renderImagesWithNames(data.health, 'health')}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  category: {
    marginBottom: 24,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#555",
  },
  imageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: "5%",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#ddd",
    marginBottom: 8,
  },
  imageName: {
    fontSize: 14,
    color: "#333",
  },
});

export default ReportUser;
