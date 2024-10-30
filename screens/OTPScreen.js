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

const OTPScreen = ({ navigation }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const route = useRoute();
  const { email } = route.params; // Receive email from the previous screen

  const handleVerifyOTP = async () => {
    try {
      if (otp.join("").length < 6) {
        Alert.alert("กรุณากรอก OTP ทั้งหมด!");
      } else {
        // Send OTP to the server for verification
        fetch("https://localwisdom.online/app/otp.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            otp: otp.join(""),
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data === "success") {
              Alert.alert("Success", "");
              navigation.replace("ChangePasswordScreen", { email: email });
            } else {
              Alert.alert(data);
            }
          })
          .catch((error) => {
            Alert.alert("Error", "Failed to request password reset.");
            console.error("Forgot Password Error:", error);
          });
      }
    } catch (error) {
      console.error(error);
      Alert.alert("เกิดข้อผิดพลาดในการตรวจสอบ OTP");
    }
  };

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to the next input field if text is entered
    if (text && index < otp.length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyPress = (e, index) => {
    // Move to the previous input field if backspace is pressed
    if (e.nativeEvent.key === "Backspace" && index > 0) {
      focusInput(index - 1);
    }
  };

  const focusInput = (index) => {
    if (index >= 0 && index < otp.length) {
      inputs[index].focus();
    }
  };

  let inputs = [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>กรอก OTP ที่ส่งไปยังอีเมลของคุณ</Text>

      <View style={styles.inputContainer}>
        {otp.map((value, index) => (
          <TextInput
            key={index}
            style={styles.inputText}
            placeholder="0"
            placeholderTextColor="#000" // Black for placeholder text
            value={value}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="numeric"
            maxLength={1}
            ref={(ref) => (inputs[index] = ref)}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.verifyBtn} onPress={handleVerifyOTP}>
        <Text style={styles.verifyText}>ยืนยัน OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // White background
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#000", // Black for title
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 30,
  },
  inputText: {
    width: 40,
    height: 50,
    backgroundColor: "#fff", // White background for inputs
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000", // Black border
    textAlign: "center",
    fontSize: 24, // Larger font size
    color: "#000", // Black text
    marginHorizontal: 8,
    elevation: 2, // Light shadow for input fields
  },
  verifyBtn: {
    width: "80%",
    backgroundColor: "#fff", // White background for button
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#000", // Black border for button
    shadowColor: "#000", // Shadow for button
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  verifyText: {
    color: "#000", // Black text
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default OTPScreen;
