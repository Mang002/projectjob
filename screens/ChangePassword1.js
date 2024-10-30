import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChangePassword1 = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigation = useNavigation();

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      Alert.alert("กรุณากรอกรหัสผ่านให้ครบถ้วน!");
      return;
    }

    try {
      const userId = await AsyncStorage.getItem("id");
      if (!userId) {
        Alert.alert("ไม่พบข้อมูลผู้ใช้");
      } else {
        fetch("https://localwisdom.online/app/update_password.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: userId,
            password: oldPassword,
            newpassword: newPassword,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "success") {
              Alert.alert("รหัสผ่านถูกเปลี่ยนเรียบร้อยแล้ว!");
              navigation.goBack();
            } else {
              Alert.alert("ข้อผิดพลาด", data.message);
            }
          })
          .catch((error) => {
            console.error("Error fetching profile data:", error);
          });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      Alert.alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูล"); // Show generic error message
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>รหัสผ่านเก่า</Text>
      <TextInput
        style={styles.input}
        value={oldPassword}
        onChangeText={setOldPassword}
        secureTextEntry
        placeholder="กรอกรหัสผ่านเก่า"
      />

      <Text style={styles.label}>รหัสผ่านใหม่</Text>
      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        placeholder="กรอกรหัสผ่านใหม่"
      />

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleChangePassword}
      >
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
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

export default ChangePassword1;
