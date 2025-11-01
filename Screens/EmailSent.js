import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

export const EmailSent = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.email}>Email sent</Text>

        <Image
          style={styles.emailImg}
          source={require("../assets/img/emailTick.png")}
        />

        <Text style={styles.emailText}>
          An email with a new password have been sent to someone@gmail.com
        </Text>

        <Text style={styles.emailText}>
          If you’re still facing issues contact admin through mail at vysyamala
          @gmail.com or call us at 9944851550 / 9043085524.
        </Text>
      </View>

      <Text
        onPress={() => navigation.navigate("LoginPage")}
        style={styles.btltext}
      >
        Back to Login
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  textContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },

  email: {
    color: "#535665",
    fontFamily: "inter",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 50,
  },

  emailImg: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginBottom: 20,
  },

  emailText: {
    color: "#535665",
    fontFamily: "inter",
    fontSize: 16,
    marginBottom: 20,
  },

  btltext: {
    fontFamily: "inter",
    fontSize: 16,
    fontWeight: "600",
    color: "#FF6666",
    textAlign: "center",
    marginTop: 20,
  },
});
