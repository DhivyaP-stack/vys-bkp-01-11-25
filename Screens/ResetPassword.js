import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation();

  const handleSubmit = async () => {
    try {
      if (!newPassword || !confirmPassword) {
        Alert.alert("Error", "Please fill in both password fields.");
        return;
      }

      if (newPassword !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match.");
        return;
      }

      // Retrieve profile_id from AsyncStorage
      const profileId = await AsyncStorage.getItem("forget_profile_id");
      if (!profileId) {
        Alert.alert("Error", "Profile ID not found. Please retry the process.");
        return;
      }

      const payload = {
        profile_id: profileId,
        new_password: newPassword,
        confirm_password: confirmPassword,
      };

      const response = await axios.post(
        "http://103.214.132.20:8000/auth/Reset_password/",
        payload
      );

      if (response.data?.message === "Password successfully reset.") {
        Alert.alert("Success", "Your password has been reset.");
        //navigation.navigate("LoginPage"); // Navigate back to Login screen
      } else {
        Alert.alert("Error", response.data?.error || "Request failed.");
      }
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert("Error", "An error occurred while processing your request.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.reset}>Reset Password</Text>
        <Text style={styles.resetText}>
          Please enter your new password and confirm it.
        </Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry={true}
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
          <LinearGradient
            colors={["#BD1225", "#FF4050"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            useAngle={true}
            angle={92.08}
            angleCenter={{ x: 0.5, y: 0.5 }}
            style={styles.linearGradient}
          >
            <Text style={styles.submit}>Submit</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text
          onPress={() => navigation.navigate("LoginPage")}
          style={styles.btltext}
        >
          Back to Login
        </Text>
      </View>
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

  formContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },

  reset: {
    color: "#535665",
    fontFamily: "inter",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
  },

  resetText: {
    color: "#535665",
    fontFamily: "inter",
    fontSize: 16,
    marginBottom: 50,
  },

  input: {
    color: "#535665",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#D4D5D9",
    padding: 10,
    marginBottom: 24,
    fontFamily: "inter",
  },

  btn: {
    width: "100%",
    alignSelf: "center",
    borderRadius: 6,
    shadowColor: "#EE1E2440",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },

  submit: {
    textAlign: "center",
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 1,
    fontFamily: "inter",
  },

  linearGradient: {
    borderRadius: 5,
    justifyContent: "center",
    padding: 15,
  },

  btltext: {
    fontFamily: "inter",
    fontSize: 16,
    fontWeight: "600",
    color: "#FF6666",
    textAlign: "center",
    marginTop: 40,
  },
});
