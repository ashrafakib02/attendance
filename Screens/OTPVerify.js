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
import "../Tools/global";
import { TextInput } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";

import * as SecureStore from "expo-secure-store";

export default function OTPVerify({ navigation }) {
  const otpUrl = global.otp;
  const initialState = {
    otp: "",
    isSubmit: false,
    errorMessage: "",
  };
  const loginReducer = (state, action) => {
    switch (action.type) {
      case "SET_OTP":
        return { ...state, otp: action.payload };
      case "SET_IS_SUBMIT":
        return { ...state, isSubmit: action.payload };
      case "SET_ERROR_MESSAGE":
        return { ...state, errorMessage: action.payload };
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(loginReducer, initialState);
  const handleOTP = useCallback(() => {
    try {
      const { otp } = state;
      if (otp === "") {
        dispatch({
          type: "SET_ERROR_MESSAGE",
          payload: "Please Enter Your OTP",
        }).then(alert(state.errorMessage));
        return;
      } else {
        dispatch({ type: "SET_IS_SUBMIT", payload: true }); // Set loading state to true
        // Fetch login logic
      }
      // Code for handling login
      fetch(otpUrl, {
        method: "post",
        header: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp: otp,
          rid: global.rid,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          let loginObj = JSON.stringify(response);
          var parsed = JSON.parse(loginObj);
          var success = parsed.success;

          if (success == 1) {
            var verified = "1";
            global.verified = verified;
            SecureStore.setItemAsync("verified", verified);
            navigation.reset({
              index: 0,
              routes: [{ name: "MainScreen" }],
            });
          } else {
            Alert.alert("Alert", "OTP Didn't match!!", [
              {
                text: "ok",
                onPress: () =>
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Login" }],
                  }),
              },
            ]);
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
      <Text style={{ color: "red", alignSelf: "center" }}>
        **Please contact your HR department for the Login OTP
      </Text>
      <View
        style={[tw` max-w-screen-sm m-8 rounded-3xl  mt-10 `, styles.flexDiv]}
      >
        <View style={styles.viewDiv}>
          <Text style={styles.text}>OTP VERIFY</Text>
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
            label="OTP"
            autoCapitalize="none"
            keyboardType="numeric"
            maxLength={6}
            onChangeText={(text) =>
              dispatch({ type: "SET_OTP", payload: text })
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
            onPress={handleOTP}
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
              Verify
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
