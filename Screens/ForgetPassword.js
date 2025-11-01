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
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import config from "../API/Apiurl";


export const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [userID, setUserID] = useState("");
  const navigation = useNavigation();

  const handleInputChange = (field, value) => {
    if (field === "email") {
      setEmail(value);
      if (value) setUserID(""); // Clear User ID if typing in Email
    } else if (field === "userID") {
      setUserID(value);
      if (value) setEmail(""); // Clear Email if typing in User ID
    }
  };

  const handleSubmit = async () => {
    try {
      if (!email && !userID) {
        Alert.alert("Error", "Please fill in either Email or User ID");
        return;
      }

      const payload = email
        ? { email }
        : { profile_id: userID };

      const response = await axios.post(`${config.apiUrl}/auth/Forget_password/`,
        payload
      );

      if (response.data?.message === "OTP sent to your email.") {
        console.log(response.data);
        Alert.alert("Success", "OTP sent successfully.");
        await AsyncStorage.setItem('forget_profile_id',response.data.forget_profile_id);
        navigation.navigate("ForgotPasswordOtp"); // Navigate to OTP Verification screen
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
        <Text style={styles.forget}>Forgot Password</Text>
        <Text style={styles.forgetText}>
          Please enter your registered email ID or Vysyamala User ID.
        </Text>
      </View>

      <View style={styles.formContainer}>
        {!userID && (
          <TextInput
            style={styles.input}
            placeholder="Email ID"
            value={email}
            onChangeText={(value) => handleInputChange("email", value)}
            keyboardType="email-address"
          />
        )}

        {!email && (
          <TextInput
            style={styles.input}
            placeholder="User ID"
            value={userID}
            onChangeText={(value) => handleInputChange("userID", value)}
          />
        )}

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

  forget: {
    color: "#535665",
    fontFamily: "inter",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
  },

  forgetText: {
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
