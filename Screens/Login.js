import {
  StyleSheet,
  Text,
  ScrollView,
  Image,
  Dimensions,
  View,
  SafeAreaView,
  Item,
  LogBox,
  Alert,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import React, { useState, useEffect, useReducer, useCallback } from "react";
import Footer from "./Footer";
import { TextInput } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as SecureStore from "expo-secure-store";

export default function Login({ navigation }) {
  const LoginUrl = global.Login;
  const initialState = {
    username: "",
    password: "",
    isSubmit: false,
    errorMessage: "",
  };
  const loginReducer = (state, action) => {
    switch (action.type) {
      case "SET_USERNAME":
        return { ...state, username: action.payload };
      case "SET_PASSWORD":
        return { ...state, password: action.payload };
      case "SET_IS_SUBMIT":
        return { ...state, isSubmit: action.payload };
      case "SET_ERROR_MESSAGE":
        return { ...state, errorMessage: action.payload };
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(loginReducer, initialState);

  const handleLoginData = async (
    success,
    user_id,
    full_name,
    onDuty,
    offDuty,
    rid,
    verified
  ) => {
    const PowUrl =
      "https://prod-60.southeastasia.logic.azure.com:443/workflows/cea747f43997459c89d13b09b98c8cce/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=O5moqz7T5jGr0alcSvuTFzfN0HeV4VDkAxs5GolsjcI&RID=" +
      rid +
      "&full_name=" +
      full_name;
    try {
      const response = await fetch(PowUrl);
      if (response.ok) {
        global.success = success;
        global.user_id = user_id;
        global.full_name = full_name;
        global.rid = rid;
        global.onDuty = onDuty;
        global.offDuty = offDuty;
        global.verified = verified;

        SecureStore.setItemAsync("success", global.success);
        SecureStore.setItemAsync("user_id", global.user_id);
        SecureStore.setItemAsync("full_name", global.full_name);
        SecureStore.setItemAsync("rid", global.rid);
        SecureStore.setItemAsync("onDuty", global.onDuty);
        SecureStore.setItemAsync("offDuty", global.offDuty);
        SecureStore.setItemAsync("verified", verified);

        navigation.reset({
          index: 0,
          routes: [{ name: "OTPVerify" }],
        });
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error posting data to Power Automate:", error);
    }
  };

  const handleLogin = useCallback(() => {
    try {
      const { username, password } = state;
      if (username === "" || password === "") {
        dispatch({
          type: "SET_ERROR_MESSAGE",
          payload: "Username and password both are required",
        }).then(alert(state.errorMessage));
        return;
      } else {
        dispatch({ type: "SET_IS_SUBMIT", payload: true }); // Set loading state to true
        // Fetch login logic
      }
      // Code for handling login
      fetch(LoginUrl, {
        method: "post",
        header: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uname: username,
          password: password,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          let loginObj = JSON.stringify(response);
          var parsed = JSON.parse(loginObj);
          var success = parsed.success;
          var user_id = parsed.userId;
          var full_name = parsed.full_name;
          var onDuty = parsed.onDuty;
          var offDuty = parsed.offDuty;
          var rid = parsed.rid;
          var verified = "0";
          console.log(onDuty, offDuty);
          if (success == 1) {
            handleLoginData(
              success,
              user_id,
              full_name,
              onDuty,
              offDuty,
              rid,
              verified
            );
          } else {
            alert("Username and Password Didn't match!!");
          }
        })
        .catch((error) => {
          alert("Error 1" + error);
        })
        .finally(setIsSubmit(false));
    } catch (error) {
      dispatch({ type: "SET_ERROR_MESSAGE", payload: error.message });
    } finally {
      dispatch({ type: "SET_IS_SUBMIT", payload: false }); // Set loading state to false
    }
  }, [state]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.logo}>
        <Image
          style={{
            width: 150,
            height: 150,
            resizeMode: "contain",
          }}
          source={require("../assets/sj.png")}
        />
        <Image
          style={{ width: 150, height: 150, resizeMode: "contain" }}
          source={require("../assets/smec.png")}
        />
        <Image
          style={{ width: 150, height: 150, resizeMode: "contain" }}
          source={require("../assets/ace.png")}
        />
      </View>
      <View
        style={[tw` max-w-screen-sm m-8 rounded-3xl  mt-10 `, styles.flexDiv]}
      >
        <View style={styles.viewDiv}>
          <Text style={styles.text}>LOGIN</Text>
        </View>
        <View style={{ margin: 15 }}>
          <TextInput
            style={{
              paddingLeft: 5,
              marginBottom: 10,
              borderRadius: 10,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              backgroundColor: "white",
            }}
            label="Email"
            autoCapitalize="none"
            onChangeText={(text) =>
              dispatch({ type: "SET_USERNAME", payload: text })
            }
          />
          <TextInput
            style={{
              paddingLeft: 5,
              marginTop: 10,
              borderRadius: 10,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              backgroundColor: "white",
            }}
            label="Password"
            secureTextEntry={true}
            autoCapitalize="none"
            onChangeText={(text) =>
              dispatch({ type: "SET_PASSWORD", payload: text })
            }
          />
        </View>
        <View
          style={{
            justifyContent: "space-evenly",
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            onPress={handleLogin}
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#51eafb",
              height: 40,
              marginLeft: "25%",
              marginRight: "25%",
              marginTop: 10,
              borderRadius: 10,
              shadowColor: "white",
              shadowOffset: {
                width: 2,
                height: 2,
              },
              shadowOpacity: 0.5,
              shadowRadius: 1.5,
              elevation: 2,
            }}
          >
            <Text
              style={{
                color: "black",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              LOGIN
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logo: {
    flex: 1,
    flexDirection: "row",
    resizeMode: "contain",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  flexDiv: {
    padding: 10,
    margin: 10,
    backgroundColor: "rgba(16, 33, 62, 1)",
  },
  viewDiv: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 20,
  },
  text: {
    alignItems: "center",
    justifyContent: "flex-start",
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
});
