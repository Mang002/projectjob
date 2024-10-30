import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditProfile = () => {
  const [name, setname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [types, setTypes] = useState("");

  useEffect(() => {
    // Fetch user data from the database and set the state
    const fetchData = async () => {
      try {
        const userId = await AsyncStorage.getItem("id"); // Assuming user ID is stored
        console.log(userId);
        if (userId) {
          fetch("https://localwisdom.online/app/get_profile.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: userId,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                setname(data.name);
                setPhone(data.phone);
                setEmail(data.email);
                setTypes(data.types);
              }
            })
            .catch((error) => {
              console.error("Error fetching profile data:", error);
            });
        }
      } catch (error) {
        console.error("Error loading user ID:", error);
      }
    };

    fetchData();
  }, []);

  const UpdateProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem("id"); // Assuming user ID is stored
      if (userId) {
        fetch("https://localwisdom.online/app/editprofile.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: userId,
            name: name,
            phone: phone,
            email: email,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              Alert.alert("อัปเดทโปรไฟล์สำเร็จ");
            }else{
              Alert(data.massage);
            }
          })
          .catch((error) => {
            console.error("Error fetching profile data:", error);
          });
      }
    } catch (error) {
      console.error("Error loading user ID:", error);
    }
  };

  const handleSave = () => {
    if (!name || !phone || !email) {
      Alert.alert("กรุณากรอกข้อมูลให้ครบถ้วน!");
      return;
    } else {
      UpdateProfile();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ชื่อนามสกุล</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setname}
        placeholder="ชื่อนามสกุล"
      />

      <Text style={styles.label}>เบอร์โทร</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="เบอร์โทร"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>อีเมล</Text>
      <TextInput
        style={styles.input}
        value={email}
        editable={types != 'google' ? true:false}
        onChangeText={setEmail}
        placeholder="อีเมล"
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>บันทึก</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  input: {
    height: 45,
    borderColor: "#000",
    borderWidth: 2,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#f0f0f0",
  },
  saveButton: {
    backgroundColor: "#000",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EditProfile;
