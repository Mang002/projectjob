import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://localwisdom.online/app/notifications.php";

// สร้างฟังก์ชันสำหรับนับการแจ้งเตือนที่ยังไม่ได้อ่าน
export const getUnreadCount = (notifications) => {
  return notifications.filter((notification) => !notification.is_read).length;
};

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const uid = await AsyncStorage.getItem("id");
      const response = await fetch(`${API_URL}?uid=${uid}`);
      const data = await response.json();
      setNotifications(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("ไม่สามารถโหลดการแจ้งเตือนได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // useEffect(() => {
  //   fetchNotifications();
  // }, [fetchNotifications]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
    }, 1000); // เรียกทุกๆ 1 วินาที
  
    return () => clearInterval(interval); // ทำความสะอาดเมื่อ component unmount
  }, []);


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (id) => {
    try {
      const uid = await AsyncStorage.getItem("id");
      const response = await fetch(`${API_URL}?uid=${uid}&action=mark_read&id=${id}`);
      const data = await response.json();
      fetchNotifications();

      // อัพเดทจำนวนการแจ้งเตือนที่ยังไม่ได้อ่านหลังจากกดอ่าน
     

      
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, []);

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          item.is_read =='YES'? styles.read : styles.unread,
        ]}
        onPress={() => item.is_read =='NO' && markAsRead(item.id)}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`การแจ้งเตือน: ${item.message}. เวลา: ${
          item.created_at
        }. ${item.is_read ? "YES" : "NO"}`}
      >
        <View style={styles.messageContainer}>
          <Text style={styles.message}>{item.message}</Text>
          {item.is_read =='NO' && <View style={styles.unreadIndicator} />}
        </View>
        <Text style={styles.date}>{item.created_at}</Text>
      </TouchableOpacity>
    ),
    [markAsRead]
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>กำลังโหลดการแจ้งเตือน...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (notifications.length === 0) {
    return (
      <View style={styles.container}>
        <Text>ไม่มีการแจ้งเตือน</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#E8F5FE",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationItem: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#FFF",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  message: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: "#888",
    marginTop: 8,
  },
  read: {
    backgroundColor: "#F9F9F9",
  },
  unread: {
    backgroundColor: "#E3F2FD",
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF0000",
    marginLeft: 8,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});

export default Notification;
