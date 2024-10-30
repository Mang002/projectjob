import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ForgotPassemail = () => {
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const navigation = useNavigation();

  const isEmailValid = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const isPhoneValid = (phone) => {
    const re = /^[0-9]{10}$/; // Simple validation for a 10-digit phone number
    return re.test(phone);
  };

  const handleSendResetLink = async () => {
    if (!Email) {
      Alert.alert("กรุณากรอกอีเมล!");
      return;
    } else if (!isEmailValid(Email)) {
      Alert.alert("รูปแบบอีเมลไม่ถูกต้อง!");
      return;
    }

    if (!Phone) {
      Alert.alert("กรุณากรอกเบอร์โทรศัพท์!");
      return;
    } else if (!isPhoneValid(Phone)) {
      Alert.alert("รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง!");
      return;
    } else {
      try {
        fetch('https://localwisdom.online/app/forgot.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: Email,
            phone: Phone
          }),
        })
          .then(response => response.json())
          .then(data => {
            if (data === 'success') {
              Alert.alert('Success', 'Please check your email/phone for further instructions.');
              navigation.replace('OTPScreen', { email: Email });
            } else {
              Alert.alert('Error', data.message || 'Something went wrong.');
            }
          })
          .catch(error => {
            Alert.alert('Error', 'Failed to request password reset.');
            console.error('Forgot Password Error:', error);
          });

      } catch (error) {
        console.error(error);
        Alert.alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ลืมรหัสผ่าน</Text>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="อีเมล"
          placeholderTextColor="#000" // Dark purple for placeholder text
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="เบอร์โทรศัพท์"
          placeholderTextColor="#000" // Dark purple for placeholder text
          onChangeText={(text) => setPhone(text)}
          keyboardType="phone-pad"
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity style={styles.resetBtn} onPress={handleSendResetLink}>
        <Text style={styles.resetText}>ส่งลิงก์รีเซ็ตรหัสผ่าน</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#000", // Dark purple for title
  },
  inputView: {
    width: "100%",
    marginBottom: 20,
  },
  inputText: {
    height: 50,
    backgroundColor: "#fff", // Light purple for input background
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000", // Dark purple border
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
  },
  resetBtn: {
    width: "100%",
    backgroundColor: "#000", // Dark purple button
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  resetText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ForgotPassemail;
