import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import Footer from "./Footer";
import "../Tools/global";
import { Alert } from "react-native";
import * as Location from "expo-location";

export default function MainScreen() {
  const [isSigned, setISigned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [latitude, setLatitude] = useState("0");
  const [longitude, setLongitude] = useState("0");
  const [textAddress, setTextAddress] = useState("-");
  const [maxId, setMaxId] = useState("-");

  const signInApi = global.signIn;
  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        status = await Location.requestForegroundPermissionsAsync();
        showError(
          "Permission to access location was denied. Please go to settings to reset the permission"
        );
        return;
      } else {
        let location = await Location.getCurrentPositionAsync({});
        let address = await Location.reverseGeocodeAsync(location.coords);
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
        setTextAddress(
          address[0].streetNumber +
            "," +
            address[0].street +
            "," +
            address[0].district +
            "," +
            address[0].city +
            "-" +
            address[0].postalCode
        );
      }
    };
    getLocation();
    console.log(textAddress);
  }, []);
  const signIn = () => {
    // const PowSignInUrl =
    //   "https://prod-30.southeastasia.logic.azure.com:443/workflows/9b86eba3f67945cb86267a74b3b7407b/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=MGO4km67Vl-KnTHvFbI1Zp5uVgSmIZTf51duS9kzAOQ&RID=" +
    //   global.rid +
    //   "&full_name=" +
    //   full_name +
    //   "&onDuty=" +
    //   global.onDuty +
    //   "&offDuty=" +
    //   global.offDuty +
    //   "&latitude=" +
    //   latitude +
    //   "&longitude=" +
    //   longitude +
    //   "&textAddress=" +
    //   textAddress;
    // try {
    //   const response = await fetch(PowSignInUrl);
    //   if (response.ok) {
    //     console.log(response.headers.map.maxid);
    //     setMaxId(response.headers.map.maxid);
    //     setISigned(true);
    //     setIsLoading(false);
    //   } else {
    //     throw new Error(`HTTP error! Status: ${response.status}`);
    //   }
    // } catch (error) {
    //   console.error("Error posting data to Power Automate:", error);
    //   setIsLoading(false);
    // }

    setIsLoading(true);
    fetch(signInApi, {
      method: "post",
      header: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rid :global.rid,
        full_name :global.full_name,
        onDuty :global.onDuty,
        offDuty :global.offDuty,
        latitude:latitude,
        longitude:longitude,
        textAddress:textAddress,
    })
  })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        let loginObj = JSON.stringify(response);
        var parsed = JSON.parse(loginObj);
        var success = parsed.success;
        var message = parsed.message;
        if (success == 1) {
          setISigned(true);
         setIsLoading(false);
        } else {
          console.log(message);
          setISigned(false);
          setIsLoading(false);
          alert("Data Not Added3!!");
        }
      })
      .catch((error) => {
        alert("Error 3" + error);
        setIsLoading(false);
        setISigned(false);
      });
  };
  const signOut = async () => {
    const PowSignOutUrl =
      "https://prod-54.southeastasia.logic.azure.com:443/workflows/270aa9b63bcb464aa3c26dbb9135d885/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=QJED0kOFNUmIc8UUCyU8G4uwtSRvFK9PZUKLfUqePWQ&RID=" +
      global.rid+
      "&maxId=" +
      maxId;
    try {
      const response = await fetch(PowSignOutUrl);
      if (response.ok) {
        setISigned(false);
        setIsLoading(false);
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error posting data to Power Automate:", error);
      setIsLoading(false);
    }
  };
  const handleSigned = () => {
    if (!isSigned) {
      Alert.alert("Alert", "Want to Check-in for today", [
        {
          text: "Cancel",

          style: "cancel",
        },
        {
          text: "Accept",
          onPress: () => {
            setIsLoading(true);
            signIn();
            //setISigned(true);
          },
        },
      ]);
    } else {
      Alert.alert("Warning", "Want to Check-out for today", [
        {
          text: "Cancel",

          style: "cancel",
        },
        {
          text: "Accept",
          onPress: () => {
            setIsLoading(true);
            signOut();
          },
        },
      ]);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!isSigned ? (
            <View>
              <TouchableOpacity onPress={handleSigned}>
                <Image
                  style={styles.logo}
                  source={require("../assets/Off.png")}
                />
              </TouchableOpacity>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.SignedText}>Checked Out</Text>
                <Text>{global.full_name}</Text>
                <Text>{global.rid}</Text>
              </View>
            </View>
          ) : (
            <View>
              <TouchableOpacity onPress={handleSigned}>
                <Image
                  style={styles.logo}
                  source={require("../assets/On.png")}
                />
              </TouchableOpacity>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.SignedText}>Checked In</Text>
                <Text>{global.full_name}</Text>
                <Text>{global.rid}</Text>
              </View>
            </View>
          )}
        </View>
      )}

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 350,
    height: 350,
    resizeMode: "contain",
  },
  SignedText: {
    fontSize: 24,
  },
});
