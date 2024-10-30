import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const navigation = useNavigation();

  // State to store profile data
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState([]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("id");
      navigation.navigate("LoginScreen");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      "Log out",
      "คุณต้องการออกจากระบบหรือไม่?",
      [
        {
          text: "ยกเลิก",
          style: "cancel",
        },
        {
          text: "ออกจากระบบ",
          onPress: handleLogout,
        },
      ],
      { cancelable: true }
    );
  };

  const fetchProfileData = async (userId) => {
    try {
      const response = await fetch(
        `https://localwisdom.online/app/profile.php?id=${userId}`
      );
      const data = await response.json();
      setProfileImage(data.profileImage); // Assuming the API returns 'profileImage'
      setUsername(data.username);
      setProfile(data); // Assuming the API returns 'username'
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const getUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem("id");
      if (userId) {
        fetchProfileData(userId);
      }
    } catch (error) {
      console.error("Error getting user ID:", error);
    }
  };

  useEffect(() => {
    getUserId();
  }, []);

  return (
    <View style={profileStyles.container}>
      <Image style={profileStyles.backgroundImage} />
      <View style={profileStyles.content}>
        {/* Dynamically load profile image */}
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : require("../assets/Image/pro1.jpg")
          }
          style={profileStyles.avatar}
        />

        {/* Dynamically load username */}
        <Text style={profileStyles.username}>{profile?.name}</Text>

        <TouchableOpacity
          style={profileStyles.infoButton}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Text style={profileStyles.infoButtonText}>ข้อมูลส่วนตัว</Text>
        </TouchableOpacity>
        {profile?.types != "google" ? (
          <TouchableOpacity
            style={profileStyles.changePasswordButton}
            onPress={() => navigation.navigate("ChangePassword1")}
          >
            <Text style={profileStyles.changePasswordButtonText}>
              เปลี่ยนรหัสผ่าน
            </Text>
          </TouchableOpacity>
        ) : (
          ""
        )}
      </View>

      {/* ปุ่มล็อกเอาท์อยู่ด้านล่างสุด */}
      <View style={profileStyles.footer}>
        <TouchableOpacity
          style={profileStyles.logoutButton}
          onPress={confirmLogout}
        >
          <Text style={profileStyles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundImage: "white",
  },
  content: {
    flex: 1, // ใช้ flex 1 เพื่อให้ส่วน content ขยายได้เต็มหน้าจอ
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 10,
    margin: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  infoButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoButtonText: {
    fontSize: 18,
    color: "#000",
  },
  changePasswordButton: {
    backgroundColor: "#007b",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  changePasswordButtonText: {
    fontSize: 18,
    color: "#fff",
  },
  footer: {
    padding: 20,
    justifyContent: "flex-end", // จัดปุ่มให้อยู่ด้านล่างสุด
  },
  logoutButton: {
    backgroundColor: "#C20029",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  logoutButtonText: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
  },
});

export default Profile;
