import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Dimensions, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native"; // นำเข้า useNavigation

// ดึงขนาดของหน้าจอ
const { width } = Dimensions.get("window");

const MapScreen = () => {
  const [wisdomLocations, setWisdomLocations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // เก็บประเภทที่ถูกเลือก
  const [pressCount, setPressCount] = useState({}); // ตัวนับการกดแต่ละหมุด
  const [initialRegion, setInitialRegion] = useState({
    latitude: 6.4264, // Default latitude
    longitude: 101.8234, // Default longitude
    latitudeDelta: 0.7,
    longitudeDelta: 0.7,
  });

  const navigation = useNavigation(); // เรียกใช้งาน useNavigation

  useEffect(() => {
    fetchWisdomLocations();
  }, []);

  const fetchWisdomLocations = async () => {
    try {
      const response = await fetch("https://localwisdom.online/app/map.php");
      const data = await response.json();
      const combinedData = [
        ...data.food.map((item) => ({ ...item, type: "FoodWisdom" })),
        ...data.play.map((item) => ({ ...item, type: "PlayWisdom" })),
        ...data.craft.map((item) => ({ ...item, type: "CraftWisdom" })),
        ...data.health.map((item) => ({ ...item, type: "TraditionWisdom" })),
      ];
      setWisdomLocations(combinedData);

      if (combinedData.length > 0) {
        const totalLat = combinedData.reduce((sum, location) => sum + parseFloat(location.latitude), 0);
        const totalLng = combinedData.reduce((sum, location) => sum + parseFloat(location.longitude), 0);
        const avgLat = totalLat / combinedData.length;
        const avgLng = totalLng / combinedData.length;

        setInitialRegion({
          latitude: avgLat,
          longitude: avgLng,
          latitudeDelta: calculateLatitudeDelta(combinedData),
          longitudeDelta: calculateLongitudeDelta(combinedData),
        });
      }
    } catch (error) {
      console.error("Error fetching wisdom locations:", error);
    }
  };

  const calculateLatitudeDelta = (locations) => {
    const latitudes = locations.map(location => parseFloat(location.latitude));
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    return (maxLat - minLat) * 1.2;
  };

  const calculateLongitudeDelta = (locations) => {
    const longitudes = locations.map(location => parseFloat(location.longitude));
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);
    return (maxLng - minLng) * 1.2;
  };

 const getMarkerColor = (type) => {
  if (selectedCategory === null || selectedCategory === type) {
    switch (type) {
      case "FoodWisdom":
        return "yellow";
      case "CraftWisdom":
        return "blue";
      case "PlayWisdom":
        return "green";
      case "TraditionWisdom":
        return "orange";
      default:
        return "gray";
    }
  } else {
    return "gray"; // หากหมุดไม่อยู่ในประเภทที่เลือก ให้เป็นสีเทา
  }
};


const getMarkerStyle = (type) => {
  let color = "gray";
  let opacity = 0; // เริ่มต้นเป็นโปร่งแสง

  if (type === "FoodWisdom") {
    color = "red";
  } else if (type === "CraftWisdom") {
    color = "blue";
  } else if (type === "PlayWisdom") {
    color = "green";
  } else if (type === "TraditionWisdom") {
    color = "orange";
  }

  // เพิ่มความชัดเจนให้หมุดที่ตรงกับประเภทที่เลือก
  if (selectedCategory === null || selectedCategory === type) {
    opacity = 1.0;
  }

  return { color, opacity };
};



  const handleMarkerPress = (type, id) => {
    setPressCount((prev) => {
      const newPressCount = { ...prev, [id]: (prev[id] || 0) + 1 };

      if (newPressCount[id] === 2) {
        navigateToPage(type, id);
        newPressCount[id] = 0;
      }

      return newPressCount;
    });
  };

  const navigateToPage = (type, id) => {
    switch (type) {
      case "FoodWisdom":
        navigation.navigate("foodDetails", { foodId: id });
        break;
      case "CraftWisdom":
        navigation.navigate("CraftDetails", { craftId: id });
        break;
      case "PlayWisdom":
        navigation.navigate("PlayDetails", { playId: id });
        break;
      case "TraditionWisdom":
        navigation.navigate("healthDetail", { healthId: id });
        break;
      default:
        break;
    }
  };

  const handleLegendPress = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  

  const filteredLocations = selectedCategory
    ? wisdomLocations.filter((location) => location.type === selectedCategory)
    : wisdomLocations;

    console.log(filteredLocations);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
  {wisdomLocations.map((location, index) => {
    const { color, opacity } = getMarkerStyle(location.type);
    return (
      <Marker
        key={index}
        coordinate={{
          latitude: parseFloat(location.latitude),
          longitude: parseFloat(location.longitude),
        }}
        pinColor={color}
        style={{ opacity }} // ใช้ความโปร่งใสจาก getMarkerStyle
        title={location.name}
        onPress={() => handleMarkerPress(location.type, location.id)}
      />
    );
  })}
</MapView>


      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>ตำแหน่งภูมิปัญญาท้องถิ่น:</Text>
        <TouchableOpacity
          style={[
            styles.legendItem,
            selectedCategory === "FoodWisdom" && styles.selectedLegendItem,
          ]}
          onPress={() => handleLegendPress("FoodWisdom")}
        >
          <View style={[styles.colorBox, { backgroundColor: "red" }]} />
          <Text style={styles.legendText}>ด้านอาหาร</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.legendItem,
            selectedCategory === "CraftWisdom" && styles.selectedLegendItem,
          ]}
          onPress={() => handleLegendPress("CraftWisdom")}
        >
          <View style={[styles.colorBox, { backgroundColor: "blue" }]} />
          <Text style={styles.legendText}>ด้านหัตกรรม</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.legendItem,
            selectedCategory === "PlayWisdom" && styles.selectedLegendItem,
          ]}
          onPress={() => handleLegendPress("PlayWisdom")}
        >
          <View style={[styles.colorBox, { backgroundColor: "green" }]} />
          <Text style={styles.legendText}>ด้านการละเล่น</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.legendItem,
            selectedCategory === "TraditionWisdom" && styles.selectedLegendItem,
          ]}
          onPress={() => handleLegendPress("TraditionWisdom")}
        >
          <View style={[styles.colorBox, { backgroundColor: "orange" }]} />
          <Text style={styles.legendText}>ด้านการประเพณี</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  legendContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderRadius: 8,
    elevation: 4,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  selectedLegendItem: {
    backgroundColor: "rgba(0,0,0,0.1)", // เพิ่มสีเมื่อกดเลือก
  },
  colorBox: {
    width: 20,
    height: 20,
    marginRight: 10,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 14,
    color: "#333",
  },
});

export default MapScreen;
