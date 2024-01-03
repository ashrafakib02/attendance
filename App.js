import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, Text, View, Image, LogBox } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "./Screens/Footer";
import Login from "./Screens/Login";
import OTPVerify from "./Screens/OTPVerify";
import MainScreen from "./Screens/MainScreen";
import * as SecureStore from "expo-secure-store";

LogBox.ignoreAllLogs();

function SplashScreen({ navigation }) {
  const manageData = async () => {
    try {
      var success = await SecureStore.getItemAsync("success");
      var user_id = await SecureStore.getItemAsync("user_id");
      var full_name = await SecureStore.getItemAsync("full_name");
      var rid = await SecureStore.getItemAsync("rid");
      var onDuty = await SecureStore.getItemAsync("onDuty");
      var offDuty = await SecureStore.getItemAsync("offDuty");
      var verified = await SecureStore.getItemAsync("verified");
    } catch (error) {
      alert("Error while Loading data!");
    }
    global.success = success;
    global.user_id = user_id;
    global.full_name = full_name;
    global.onDuty = onDuty;
    global.offDuty = offDuty;
    global.rid = rid;
    global.verified = verified;
  };
  useEffect(() => {
    manageData();
    setTimeout(() => {
      if (global.success == "1" && global.verified == "1") {
        navigation.replace("MainScreen");
      } else if (global.success == "1" && global.verified == "0") {
        navigation.replace("OTPVerify");
      } else {
        navigation.replace("Login");
      }
    }, 3000);
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <Image
            style={{
              width: 150,
              height: 150,
              resizeMode: "contain",
            }}
            source={require("./assets/sj.png")}
          />
          <Image
            style={{ width: 150, height: 150, resizeMode: "contain" }}
            source={require("./assets/smec.png")}
          />
          <Image
            style={{ width: 150, height: 150, resizeMode: "contain" }}
            source={require("./assets/ace.png")}
          />
        </View>
        {/* <View
          style={{
            flex: 1,
            fontWeight: "bold",
            color: "rgba(16, 33, 62, 1)",
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 60,
              marginTop: 10,
              fontWeight: "bold",
              color: "rgba(16, 33, 62, 1)",
              textShadowColor: "black",
              textShadowOffset: { width: -1, height: 1 },
              textShadowRadius: 3,
            }}
          >
            Daily Attendance
          </Text>
        </View> */}
      </View>
      <Footer />
    </SafeAreaView>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OTPVerify"
          component={OTPVerify}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainScreen"
          component={MainScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
});
