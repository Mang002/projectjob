import React, { useState, useRef, useEffect } from "react";
import { Text, View, TextInput, Alert, TouchableOpacity, StyleSheet, Platform, KeyboardAvoidingView, ScrollView } from "react-native";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Register = ({ navigation }) => {
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState(""); // New state for confirm password
  const [Phone, setPhone] = useState("");
  const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState();
  const [notification, setNotification] = useState();
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
    }

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const isEmailValid = (Email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(Email).toLowerCase());
  };

  const isPhoneValid = (Phone) => {
    const re = /^[0-9]{10}$/; // Validate for 10 digits phone number
    return re.test(Phone);
  };

  const handlePress = () => {
    if (!Name) {
      Alert.alert("กรุณากรอกชื่อ-สกุล!");
    } else if (Name.length < 6) {
      Alert.alert("กรุณากรอกชื่อ-นามสกุลจริง!");
    } else if (!Email) {
      Alert.alert("กรุณากรอกอีเมล!");
    } else if (!isEmailValid(Email)) {
      Alert.alert("รูปแบบอีเมลไม่ถูกต้อง!");
    } else if (!Password) {
      Alert.alert("กรุณากรอกรหัสผ่าน!");
    } else if (Password.length < 6) {
      Alert.alert("กรุณากรอกรหัสผ่าน 6ตัวขึ้นไป!");
    } else if (Password !== ConfirmPassword) {
      Alert.alert("รหัสผ่านไม่ตรงกัน!");
    } else if (!Phone) {
      Alert.alert("กรุณากรอกเบอร์โทรศัพท์!");
    } else if (!isPhoneValid(Phone)) {
      Alert.alert("รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง!");
    } else {
      fetch("https://localwisdom.online/app/register.php", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: Name,
          email: Email,
          password: Password,
          phone: Phone,
          notification: expoPushToken,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          // แสดงการแจ้งเตือนหลังจากสมัครสมาชิกเสร็จแล้ว
          schedulePushNotification();
          // ส่งการแจ้งเตือนไปยังหน้าแจ้งเตือนในแอป
          fetch("https://localwisdom.online/app/addNotification.php", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: "การสมัครสมาชิกเสร็จสมบูรณ์",
              user_id: responseJson.user_id,
            }),
          });

          Alert.alert("สมัครสมาชิกเรียบร้อยแล้ว");
          navigation.replace("LoginScreen");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.logo}>สมัครสมาชิก</Text>

        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="ชื่อ-สกุล"
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="อีเมล"
            onChangeText={setEmail}
            autoCompleteType="email"
            keyboardType="email-address"
            textContentType="emailAddress"
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="รหัสผ่าน"
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="ยืนยันรหัสผ่าน" // Confirm Password field
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="เบอร์โทรศัพท์"
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={handlePress}>
          <Text style={styles.loginText}>สมัครสมาชิก</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  logo: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  inputView: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    paddingLeft: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  inputText: {
    height: 50,
    color: "#333",
  },
  loginBtn: {
    width: "85%",
    backgroundColor: "#6200ea",
    borderRadius: 25,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    shadowColor: "#6200ea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 10,
  },
  loginText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default Register;

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "สมัครสมาชิกสำเร็จ!",
      body: 'ยินดีต้อนรับสู่ระบบ',
    },
    trigger: { seconds: 2 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(token);
    } catch (e) {
      console.error('Error fetching token', e);
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}
