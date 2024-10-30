import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text, Modal, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // แสดงป๊อปอัพเมื่อเข้าหน้านี้ครั้งแรก
    setModalVisible(true);
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.profileIcon}
        onPress={() => navigation.navigate("Profile")}
      >
        <Icon name="user" color={"#000"} size={30} />
      </TouchableOpacity>

      <Image 
        source={require('../assets/Image/pro1.jpg')} // Replace with your logo's path
        style={styles.logo}
      />

      <Text style={styles.welcomeText}>
        ยินดีต้อนรับเข้าสู่แหล่งเรียนรู้ภูมิปัญญาท้องถิ่นจังหวัดนราธิวาส
      </Text>

      {/* Modal for Popup */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>ยินดีต้อนรับเข้าสู่แหล่งเรียนรู้ภูมิปัญญาท้องถิ่นจังหวัดนราธิวาส</Text>
            <Button 
              title="ปิด"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>

      {/* Other components can go here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  profileIcon: {
    position: 'absolute',
    top: 40,
    right: 20,
    borderRadius: 20,
    padding: 10,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#000',
    paddingHorizontal: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color:'red',
  },
});

export default HomeScreen;
