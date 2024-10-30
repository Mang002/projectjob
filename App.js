import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Register from "./screens/Register";
import UserPage from "./screens/UserPage";
import AdminPage from "./screens/AdminPage";
import LoginScreen from "./screens/LoginScreen";
import ReportScreen from "./screens/ReportScreen";
import Nofication from "./screens/Notification";
import Profile from "./screens/Profile";
import ReportUser from "./screens/ReportUser";
import FoodWisdomScreen from "./screens/FoodWisdom";
import CraftWisdom from "./screens/CraftWisdom";
import CraftDetails from "./screens/CraftDetails";
import PlayDetails from "./screens/PlayDetails";
// import HealthWisdom from "./screens/HealthWisdom";
import EditProfile from "./screens/EditProfile";
import foodDetails from "./screens/foodDetails";
import MapScreen from "./screens/MapScreen";
import ForgotPassemail from "./screens/ForgotPassemail";
import OTPScreen from "./screens/OTPScreen";
import ChangePasswordScreen from "./screens/ChangePasswordScreen";
import ChangePassword1 from "./screens/ChangePassword1";
import healthDetail from "./screens/healthDetails";
import PlayWisdom from "./screens/PlayWisdom";
import TraditionWisdom from "./screens/TraditionWisdom";

const Stack = createStackNavigator();
// const [userInfo, setUserInfo] = React.useState();
// const [require, response , promptAsync] = Google.useAuthRequest ({
//   androidClientId :
//   "823072164984-s2a0etg6a4ama04asmvdv02o472fq7vh.apps.googleusercontent.com",
// });

const horizontalAnimation = {
  gestureDirection: "horizontal",
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={horizontalAnimation}>
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{
            headerShown: false,
            title: "หน้า LoginScreen",
            headerStyle: {
              backgroundColor: "#ffc107",
            },
          }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{
            headerShown: true,
            title: "สมัครสมาชิก",
            headerStyle: {
              backgroundColor: "#20c997",
            },
          }}
        />
        <Stack.Screen
          name="AdminPage"
          component={AdminPage}
          options={{
            headerShown: true,
            title: "หน้า Admin",
            headerStyle: {
              backgroundColor: "#ffc107",
            },
          }}
        />
        <Stack.Screen
          name="UserPage"
          component={UserPage}
          options={{
            headerShown: false,
            title: "หน้า User",
            headerStyle: {
              backgroundColor: "#ffc107",
            },
          }}
        />
        <Stack.Screen
          name="FoodWisdom"
          component={FoodWisdomScreen}
          options={{
            headerShown: false,
            title: "อาหาร",
            headerStyle: {
              backgroundColor: "#ffc107",
            },
          }}
        />

        <Stack.Screen
          name="CraftWisdom"
          component={CraftWisdom}
          options={{
            headerShown: false,
            title: "หัตกรรม",
            headerStyle: {
              backgroundColor: "#ffc107",
            },
          }}
        />
        <Stack.Screen
          name="CraftDetails"
          component={CraftDetails}
          options={{
            headerShown: false,
            title: "ข้อมูลหัตกรรม",
            headerStyle: {
              backgroundColor: "#ffc107",
            },
          }}
        />
        <Stack.Screen
          name="PlayDetails"
          component={PlayDetails}
          options={{
            headerShown: false,
            title: "ข้อมูลการละเล่น",
            headerStyle: {
              backgroundColor: "#ffc107",
            },
          }}
        />

        {/* <Stack.Screen
          name="HealthWisdom"
          component={HealthWisdom}
          options={{
            headerShown: false,
            title: "ยา",
            headerStyle: {
              backgroundColor: "#ffc107",
            },
          }}
        /> */}
        <Stack.Screen
          name="TraditionWisdom"
          component={TraditionWisdom}
          options={{
            headerShown: false,
            title: "ยา",
            headerStyle: {
              backgroundColor: "#ffc107",
            },
          }}
        />
        <Stack.Screen
          name="ReportUser"
          component={ReportUser}
          options={{
            headerShown: false,
            title: "รายงาน",
            headerStyle: {
              backgroundColor: "#ffc107",
            },
          }}
        />
        <Stack.Screen
          name="Nofication"
          component={Nofication}
          options={{
            headerShown: false,
            title: "การแจ้งเตือน",
            headerStyle: {
              backgroundColor: "#ffc107",
            },
          }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            headerShown: false,
            title: "โปรไฟล์",
            headerStyle: {
              backgroundColor: "#ffc107",
            },
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{
            headerShown: false,
            title: "แก้ไขโปรไฟล์",
            headerStyle: {
              backgroundColor: "#ffc107",
            },
          }}
        />
        <Stack.Screen
          name="foodDetails"
          component={foodDetails}
          options={{
            headerShown: false,
            title: "รายละเอียดด้านอาหาร",
            headerStyle: {
              backgroundColor: "#ffc107",
            },
          }}
        />
        <Stack.Screen
          name="MapScreen"
          component={MapScreen}
          options={{
            headerShown: false,
            title: "แผนที่",
            headerStyle: {
              backgroundColor: "#ffc107",
            },
          }}
        />
        <Stack.Screen
          name="ForgotPassemail"
          component={ForgotPassemail}
          options={{
            headerShown: false,
            title: "ลืมรหัสผ่านใส่อีเมล",
            headerStyle: {
              backgroundColor: "#ffc107",
            },
          }}
        />
        <Stack.Screen
          name="ChangePasswordScreen"
          component={ChangePasswordScreen}
          options={{
            headerShown: false,
            title: "เปลี่ยนรหัสผ่าน",
            headerStyle: {
              backgroundColor: "#ffc107",
            },
          }}
        />
        <Stack.Screen
          name="OTPScreen"
          component={OTPScreen}
          options={{
            headerShown: false,
            title: "เปลี่ยนotp",
            headerStyle: {
              backgroundColor: "#ffc107",
            },
          }}
        />
        <Stack.Screen
          name="ChangePassword1"
          component={ChangePassword1}
          options={{
            headerShown: false,
            title: "เปลี่ยนรหัสด้านใน",
            headerStyle: {
              backgroundColor: "#ffc107",
            },
          }}
        />
        <Stack.Screen
          name="PlayWisdom"
          component={PlayWisdom}
          options={{
            headerShown: false,
            title: "การละเล่นภูมิปัญญา",
            headerStyle: {
              backgroundColor: "#ffc107",
            },
          }}
        />
        <Stack.Screen
          name="healthDetail"
          component={healthDetail}
          options={{
            headerShown: false,
            title: "ข้อมูลด้านการละเล่น",
            headerStyle: {
              backgroundColor: "#ffc107",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;
