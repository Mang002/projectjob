import React, { useState, useEffect,useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
  Platform
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const navigation = useNavigation();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState();
  const [notification, setNotification] = useState();
  const notificationListener = useRef();
  const responseListener = useRef();

  

  const [userInfo, setUserInfo] = useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "415140992955-u23h6asio8pp4303ggr8f2cmbo8lq0mt.apps.googleusercontent.com",
    expoClientId:
      "415140992955-8b2gp8s2ium8k19amuqvh3qo6n4m3blv.apps.googleusercontent.com",
  });

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
 
  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      handleGoogleSignIn(response.authentication.accessToken); 
    }
  }, [response]);

  const checkIfLoggedIn = async () => {
    try {
      const storedId = await AsyncStorage.getItem("id");
      if (storedId) {
        navigation.replace("UserPage");
      }
    } catch (error) {
      console.error("Error checking stored id:", error);
    }
  };

  const handleGoogleSignIn = async (token) => {
    if (!token) return;
    try {
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await res.json();

      const response = await fetch(
        "https://localwisdom.online/app/saveUser.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            googleId: user.sub,
            email: user.email,
            name: user.name,
            notification:expoPushToken
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        await AsyncStorage.setItem("id", data.id.toString());
        navigation.replace("UserPage");
      } else {
        Alert.alert(data.message);
      }
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      Alert.alert("เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google");
    }
  };

  const handleLogin = async () => {
    if (!email || !password ) {
      Alert.alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      const response = await fetch("https://localwisdom.online/app/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, phone }),
      });

      const data = await response.json();

      if (data.success) {
        await AsyncStorage.setItem("id", data.user.id.toString());
        navigation.replace("UserPage");
      } else {
        Alert.alert(data.message);
      }
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.tinyLogo}
        source={require("../assets/Image/pro1.jpg")}
      />

      <Text style={styles.logo}>
        แหล่งเรียนรู้ภูมิปัญญาท้องถิ่นจังหวัดนราธิวาส
      </Text>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="อีเมล"
          placeholderTextColor="#003f5c"
          onChangeText={setEmail}
          value={email}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="รหัสผ่าน"
          placeholderTextColor="#003f5c"
          onChangeText={setPassword}
          secureTextEntry
          value={password}
        />
      </View>

      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>เข้าสู่ระบบ</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => promptAsync()}
        style={styles.googleLoginBtn}
      >
        <Image
          source={require("../assets/Image/google-icon.png")}
          style={styles.googleIcon}
        />
        {/* <Text style={styles.googleLoginText}>Sign in with Google</Text> */}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassemail")}>
        <Text style={styles.forgotText}>ลืมรหัสผ่าน?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.registerText}>สมัครสมาชิก</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0f7fa", // เพิ่มการไล่สีพื้นหลัง
    padding: 20,
  },
  logo: {
    color: "#00796b",
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 30,
    marginHorizontal: 10,
  },
  tinyLogo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 30,
    borderColor: "#00796b", // เพิ่มเส้นขอบรอบรูปภาพ
    borderWidth: 2,
  },
  inputView: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 15,
    borderColor: "#00796b",
    borderWidth: 2, // เปลี่ยนสีเส้นขอบให้เข้ากับธีม
  },
  inputText: {
    height: 50,
    color: "#333",
    fontSize: 16,
  },
  loginBtn: {
    width: "85%",
    backgroundColor: "#00796b",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  loginText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  googleLoginBtn: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  googleIcon: {
    width: 100, // ลดขนาดของไอคอน Google ให้พอดี
    height: 100,
    marginRight: 10,
  },
  forgotText: {
    color: "#d32f2f", // ใช้สีแดงสำหรับลิงก์ลืมรหัสผ่าน
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  registerText: {
    color: "#007bff",
    fontSize: 16,
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  // linkText: {
  //   color: "#1e90ff",
  //   fontSize: 16,
  //   fontWeight: "bold",
  //   textDecorationLine: "underline",
  // },
});

export default LoginScreen;
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

