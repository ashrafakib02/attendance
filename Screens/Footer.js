import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import tw from "tailwind-react-native-classnames";

const Footer = () => {
  return (
    <View style={styles.container}>
      <Text>Developed By</Text>
      <Image
        style={[tw`h-10 w-20 ml-1`]}
        source={require("../assets/smec.png")}
      />
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
});
