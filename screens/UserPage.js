import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ReportUser from "./ReportUser";
import ReportScreen from "./ReportScreen";
import AntDesign from "@expo/vector-icons/AntDesign";
import Notification, { getUnreadCount } from "./Notification";
import MapScreen from "./MapScreen";
import Profile from "./Profile";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();

export default function UserPage() {
  const [unreadCount, setUnreadCount] = useState(0);

  // ฟังก์ชันสำหรับดึงจำนวนการแจ้งเตือนที่ยังไม่ได้อ่าน
  const fetchUnreadCount = async () => {
    try {
      const uid = await AsyncStorage.getItem("id");
      const response = await fetch(`https://localwisdom.online/app/notifications.php?uid=${uid}`);
      const data = await response.json();
      const count = data.filter(notification => notification.is_read=='NO').length;
      setUnreadCount(count);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 1000); // เรียกทุกๆ 1 วินาที
  
    return () => clearInterval(interval); // ทำความสะอาดเมื่อ component unmount
  }, []);
  

  return (
    <Tab.Navigator
      initialRouteName="UserPage"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#e0e0e0",
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "หน้าแรก") {
            iconName = "home";
            size = 24;
          } else if (route.name === "แหล่งเรียนรู้") {
            iconName = "school";
            size = 24;
          } else if (route.name === "แผนที่") {
            iconName = "map-outline";
            size = 24;
          } else if (route.name === "รายงานผล") {
            iconName = "document";
            size = 24;
          } else if (route.name === "การแจ้งเตือน") {
            iconName = "notification";
            size = 24;
          } else if (route.name === "โปรไฟล์") {
            iconName = "person-outline";
            size = 24;
          }

          // สร้าง icon component พร้อมแบดจ์สำหรับการแจ้งเตือน
          if (route.name === "การแจ้งเตือน") {
            return (
              <View>
                <AntDesign name={iconName} size={size} color={color} />
                {unreadCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadCount}</Text>
                  </View>
                )}
              </View>
            );
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="แหล่งเรียนรู้"
        component={ReportScreen}
        options={{
          tabBarLabel: "แหล่งเรียนรู้",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#20b2aa",
          },
        }}
      />
      <Tab.Screen
        name="แผนที่"
        component={MapScreen}
        options={{
          tabBarLabel: "แผนที่",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#20b2aa",
          },
        }}
      />
      <Tab.Screen
        name="รายงานผล"
        component={ReportUser}
        options={{
          tabBarLabel: "รายงานผล",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#20b2aa",
          },
        }}
      />
      <Tab.Screen
        name="การแจ้งเตือน"
        component={Notification}
        options={{
          tabBarLabel: "การแจ้งเตือน",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#20b2aa",
          },
        }}
        listeners={{
          // อัพเดทจำนวนการแจ้งเตือนเมื่อเข้าหน้าการแจ้งเตือน
          tabPress: () => {
            fetchUnreadCount();
          },
        }}
      />
      <Tab.Screen
        name="โปรไฟล์"
        component={Profile}
        options={{
          tabBarLabel: "โปรไฟล์",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#20b2aa",
          },
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    right: -6,
    top: -3,
    backgroundColor: "red",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});