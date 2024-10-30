import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Linking,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";

const API_URL = "https://localwisdom.online/app";

const PlayDetails = ({ route }) => {
  const { playId } = route.params;
  const [foodData, setFoodData] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0); // เพิ่มสถานะสำหรับจำนวนถูกใจ
  const [views, setViews] = useState(0); // เพิ่มสถานะสำหรับจำนวนยอดวิว

  useEffect(() => {
    fetchFoodData();
    fetchComments();
    fetchLikes();
    updateViews("play", playId);
  }, []);

  const updateViews = async (table, id) => {
    try {
      const response = await fetch(
        "https://localwisdom.online/app/Updateview.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            table: table,
            id: id,
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        setViews(result.views); // อัปเดตจำนวนยอดวิว
      } else {
        console.log("Failed to update views:", result.message);
      }
    } catch (error) {
      console.error("Error updating views:", error);
    }
  };

  console.log(playId);

  const fetchFoodData = async () => {
    try {
      const response = await fetch(`${API_URL}/play.php?id=${playId}`);
      const data = await response.json();
      setFoodData(data);
      setViews(data.views); // ตั้งค่าจำนวนยอดวิวจาก API
    } catch (error) {
      Alert.alert("Error", "Failed to fetch food data");
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`${API_URL}/comments_play.php?id=${playId}`);
      const data = await response.json();
      setComments(data);
      // แสดง Alert เมื่อแอดมินตอบกลับ
      data.forEach((item) => {
        if (item.reply_content) {
          // Alert.alert("แอดมินตอบกลับ", item.reply_content);
        }
      });
    } catch (error) {
      Alert.alert("Error", "Failed to fetch comments");
    }
  };

  const fetchLikes = async () => {
    try {
      const response = await fetch(`${API_URL}/like_play.php?id=${playId}`);
      const data = await response.json();
      setLikes(data.likes);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch likes");
    }
  };

  const handleLike = async () => {
    try {
      const userId = await AsyncStorage.getItem("id");
      const response = await fetch(
        `${API_URL}/likes_play.php?id=${playId}&uid=${userId}`,
        {
          method: "POST",
        }
      );
      const result = await response.json();
      if (result.success) {
        if (result.likes) {
          setLikes(likes + 1); // เพิ่มจำนวนถูกใจ
        } else {
          setLikes(likes - 1);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to like");
    }
  };

  const handleAddComment = async () => {
    if (comment.trim()) {
      try {
        const userId = await AsyncStorage.getItem("id");
        const response = await fetch(
          `${API_URL}/add_complay.php?id=${playId}&uid=${userId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: comment }),
          }
        );
        const newComment = await response.json();
        setComments((prevComments) => [...prevComments, newComment]);
        setComment("");
      } catch (error) {
        Alert.alert("Error", "Failed to add comment" + error);
      }
    }
  };

  useEffect(() => {
    const fetchData = () => {
      fetchFoodData();
      fetchComments();
      fetchLikes();
    };

    fetchData(); // เรียกเพื่อดึงข้อมูลเริ่มต้น
    const intervalId = setInterval(fetchData, 1000); // รีเฟรชทุก 1 วินาที

    return () => clearInterval(intervalId); // ล้าง interval เมื่อ component ถูก unmount
  }, []);

  const handleNavigation = () => {
    const { latitude, longitude } = foodData;
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${latitude},${longitude}`;
    const label = foodData.name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
  };
  const renderCommentItem = (item, index) => (
    <View key={index} style={styles.commentContainer}>
      {/* คอมเมนต์ของผู้ใช้ด้านซ้าย */}
      <View style={[styles.commentBubble, styles.userComment]}>
        <Text style={styles.commentText}>{item.comment_content}</Text>
        <View style={styles.divider} />
        <Text style={styles.commentAuthor}>โดย {item.user_name}</Text>
      </View>

      {/* คอมเมนต์ของแอดมินด้านขวา */}
      {item.reply_content && (
        <View style={[styles.commentBubble, styles.adminReply]}>
          <Text style={styles.replyText}>{item.reply_content}</Text>
          <View style={styles.divider} />
          <Text style={styles.replyAuthor}>
            แอดมิน • {item.reply_created_at}
          </Text>
        </View>
      )}
    </View>
  );

  if (!foodData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{
            uri: "https://localwisdom.online/admin/" + foodData?.imageUrl,
          }}
          style={styles.image}
        />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{foodData.name}</Text>
          <Text style={styles.description}>{foodData.description}</Text>
          <TouchableOpacity
            style={styles.navigationButton}
            onPress={handleNavigation}
          >
            <MaterialIcons name="directions" size={24} color="#fff" />
            <Text style={styles.navigationButtonText}>นำทาง</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <WebView style={styles.video} source={{ uri: foodData.videoUrl }} />
        <View style={styles.videoActions}>
          <Text style={styles.viewText}>ยอดวิว: {foodData?.view}</Text>
          <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
            <Text style={styles.likeText}>ถูกใจ {likes}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.commentsSection}>
          <Text style={styles.commentTitle}>ความคิดเห็น</Text>
          {comments.length > 0 ? comments?.map(renderCommentItem) : ""}
          <TextInput
            style={styles.input}
            value={comment}
            onChangeText={setComment}
            placeholder="เพิ่มความคิดเห็น"
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.button} onPress={handleAddComment}>
            <Text style={styles.buttonText}>โพสต์ความคิดเห็น</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 16,
  },

  commentContainer: {
    alignItems: 'flex-start', // Align comments to the left
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 8,
    backgroundColor: '#f0f0f0',  // Light gray background for the container
    borderRadius: 12,
  },
  commentBubble: {
    padding: 12,
    borderRadius: 10,
    maxWidth: '85%',
  },
  userComment: {
    backgroundColor: '#ffffff', // White background for user comments
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#ccc', // Light gray border
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  adminReply: {
    backgroundColor: '#e0e0e0', // Darker gray background for admin replies
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: '#bbb', // Medium gray border
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    marginTop: 6,
  },
  commentText: {
    fontSize: 14,
    color: '#000', // Black text color
    lineHeight: 20,
  },
  replyText: {
    fontSize: 14,
    color: '#000', // Black text color for replies
    lineHeight: 20,
  },
  commentAuthor: {
    fontSize: 12,
    color: '#555', // Dark gray for author name
    marginTop: 6,
  },
  replyAuthor: {
    fontSize: 12,
    color: '#444', // Slightly darker gray for reply author
    marginTop: 6,
    textAlign: 'right',
  },



  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginVertical: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  navigationButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: "center",
    marginTop: 10,
  },
  navigationButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  video: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    backgroundColor: "#000",
    marginBottom: 10,
  },
  videoActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  viewText: {
    fontSize: 16,
    color: "#555",
  },
  likeButton: {
    backgroundColor: "#ff6347",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  likeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  contentContainer: {
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    lineHeight: 22,
  },
  commentsSection: {
    marginTop: 20,
  },
  commentTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  commentItem: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  commentText: {
    fontSize: 14,
    color: "#555",
  },
  input: {
    backgroundColor: "#e6e6e6",
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
    color: "#333",
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#ff6347",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PlayDetails;
