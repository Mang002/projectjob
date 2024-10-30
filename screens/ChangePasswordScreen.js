import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const ChangePasswordScreen = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params; // Receive email from OTP screen

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("กรุณากรอกทั้งรหัสผ่านใหม่และยืนยันรหัสผ่าน!");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน!");
      return;
    }

    try {
      // Send data to the server to change the password
      fetch("https://localwisdom.online/app/change-password.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: newPassword,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            Alert.alert("Success", data.message);
            navigation.replace("LoginScreen");
          } else {
            Alert.alert(data.message);
          }
        })
        .catch((error) => {
          Alert.alert("Error", "Failed to request password reset.");
          console.error("Change Password Error:", error);
        });
    } catch (error) {
      console.error(error);
      Alert.alert("เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>เปลี่ยนรหัสผ่านของคุณ</Text>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="รหัสผ่านใหม่"
          placeholderTextColor="#000"
          onChangeText={setNewPassword}
          value={newPassword}
          secureTextEntry
          accessibilityLabel="New password input"
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="ยืนยันรหัสผ่าน"
          placeholderTextColor="#000"
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          secureTextEntry
          accessibilityLabel="Confirm password input"
        />
      </View>

      <TouchableOpacity style={styles.changeBtn} onPress={handleChangePassword}>
        <Text style={styles.changeText}>เปลี่ยนรหัสผ่าน</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // White background for the container
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#000", // Black for title
  },
  inputView: {
    width: "80%",
    backgroundColor: "#fff", // White background for inputs
    borderRadius: 10,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#000", // Black border
  },
  inputText: {
    height: 50,
    color: "#000", // Black text
    fontSize: 18,
    paddingHorizontal: 10,
  },
  changeBtn: {
    width: "80%",
    backgroundColor: "#000", // White background for button
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#000", // Black border for button
  },
  changeText: {
    color: "#fff", // Black text
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ChangePasswordScreen;
