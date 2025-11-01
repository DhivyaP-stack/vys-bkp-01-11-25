import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import axios from "axios"; // Import axios
import config from "../API/Apiurl";

export const ForgotPasswordOtp = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const otpRefs = useRef([]);
  const [MobileNo, setMobileNo] = useState("");
  const [ProfileId, setProfileId] = useState("");
  const [ProfileOwner, setProfileOwner] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [email, setEmail] = useState("");
  const [resendDisabled, setResendDisabled] = useState(true);
  const [resendMessage, setResendMessage] = useState("");
  const [timer, setTimer] = useState(60); // Add timer state

  useEffect(() => {
    retrieveDataFromSession();
    startResendTimer(60); // Initially disable resend for 60 seconds
  }, []);

  useEffect(() => {
    if (resendDisabled) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev > 0) {
            return prev - 1;
          } else {
            clearInterval(interval);
            setResendDisabled(false);
            return 0;
          }
        });
      }, 1000);
    }
  }, [resendDisabled]);

  // const retrieveDataFromSession = async () => {
  //   try {
  //     const profileValue = await AsyncStorage.getItem("profile_owner");
  //     const profileId = await AsyncStorage.getItem("profile_id");
  //     const mobileno = await AsyncStorage.getItem("Mobile_no");
  //     const countrycode = await AsyncStorage.getItem("countrycode");
  //     const email = await AsyncStorage.getItem("email");
  //     setMobileNo(mobileno);
  //     setProfileId(profileId);
  //     setProfileOwner(profileValue);
  //     setCountryCode(countrycode);
  //     setEmail(email);

  //     console.log("Retrieved Profile Value:", profileValue);
  //     console.log("Retrieved Profile ID:", profileId);
  //     console.log("Retrieved Mobile No:", mobileno);
  //   } catch (error) {
  //     console.error("Error retrieving data from session:", error);
  //   }
  // };

  const retrieveDataFromSession = async () => {
    try {
      const profileId = await AsyncStorage.getItem("forget_profile_id");
     
      setProfileId(profileId);
     

      console.log("Retrieved Profile ID:", profileId);
    } catch (error) {
      console.error("Error retrieving data from session:", error);
    }
  };

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;

    if (text === "") {
      if (index > 0) {
        otpRefs.current[index - 1].focus();
      } else {
        newOtp[index] = "";
      }
    } else if (text.length === 1 && index < otp.length - 1) {
      otpRefs.current[index + 1].focus();
    }

    setOtp(newOtp);
  };

  const handleBackspace = (index) => {
    const newOtp = [...otp];
    newOtp[index - 1] = "";
    const prevRef = otpRefs.current[index - 1];
    if (prevRef) {
      prevRef.focus();
    }
    setOtp(newOtp);
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");

    if (otp.includes("") || enteredOtp.length !== 6) {
      Alert.alert("Error", "Please enter a complete 6-digit OTP.");
      return;
    }

    console.log(enteredOtp);
    console.log(ProfileId);

    try {
      const response = await axios.post(
        `${config.apiUrl}/auth/Forget_password_otp_verify/`,
        {
          otp: enteredOtp,
          profile_id: ProfileId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const jsonResponse = response.data;
      console.log(jsonResponse);
      console.log(jsonResponse.message);

      if (jsonResponse.status === 1) {
        Alert.alert("Success", "OTP verified successfully.");
        navigation.navigate("ResetPassword");
        // navigation.navigate("ContactInfo");
      } else {
        Alert.alert("Error", jsonResponse.Message || "OTP verification failed.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      Alert.alert("Error", "An error occurred during OTP verification.");
    }
  };

  const startResendTimer = (seconds) => {
    setResendDisabled(true);
    setTimer(seconds);
  };

  const handleResendOtp = async () => {
    try {
      const response = await axios.post(
        `${config.apiUrl}/auth/Get_resend_otp/`,
        {
          ProfileId: ProfileId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setResendMessage("OTP resent successfully.");
        setTimeout(() => {
          setResendMessage("");
        }, 3000);
        startResendTimer(60);
      } else {
        Alert.alert("Error", response.data.message || "Failed to resend OTP.");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      Alert.alert("Error", "An error occurred while resending OTP.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.mobile}>Mobile Verification</Text>
        <Text style={styles.mobileText}>
          Please verify your mobile number and say why we need mobile
          verification
        </Text>
      </View>

      <View style={styles.otpContainer}>
        <Text style={styles.otp}>OTP Verification</Text>
        <Text style={styles.otpText}>
          {/* We have sent a verification code to {MobileNo} */}
          {/* We have sent a verification code to{" "}
          {countryCode === "91" ? MobileNo : email} */}
        </Text>
      </View>

      <View style={styles.otpInputContainer}>
        {otp.map((value, index) => (
          <TextInput
            key={index}
            style={[
              styles.otpInput,
              index === focusedIndex && styles.focusedOtpInput, // Apply highlight style only to the focused input
            ]}
            value={value}
            onChangeText={(text) => handleOtpChange(text, index)}
            maxLength={1}
            keyboardType="numeric"
            ref={(el) => (otpRefs.current[index] = el)}
            onFocus={() => setFocusedIndex(index)} // Update the focused index when the input is focused
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === "Backspace" && value === "") {
                handleBackspace(index);
              }
            }}
          />
        ))}
      </View>

      {resendMessage ? (
        <Text style={styles.successMessage}>{resendMessage}</Text>
      ) : (
        <Text style={styles.existing}>
          Didn't receive OTP?{" "}
          <Text
            style={resendDisabled ? styles.redText : styles.redText}
            onPress={!resendDisabled ? handleResendOtp : null}
          >
            Resend OTP {resendDisabled && <Text style={styles.redText}>({timer}s)</Text>}
          </Text>
        </Text>
      )}

      <TouchableOpacity style={styles.btn} onPress={handleVerify}>
        <LinearGradient
          colors={["#BD1225", "#FF4050"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          useAngle={true}
          angle={92.08}
          angleCenter={{ x: 0.5, y: 0.5 }}
          style={styles.linearGradient}
        >
          <Text style={styles.verify}>Verify</Text>
        </LinearGradient>
      </TouchableOpacity>
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

  mobile: {
    color: "#535665",
    fontFamily: "inter",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
  },

  mobileText: {
    color: "#535665",
    fontFamily: "inter",
    fontSize: 16,
    marginBottom: 50,
  },

  otpContainer: {
    width: "100%",
    textAlign: "center",
    alignSelf: "center",
    paddingHorizontal: 20,
  },

  otp: {
    color: "#535665",
    fontFamily: "inter",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },

  otpText: {
    color: "#535665",
    fontFamily: "inter",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },

  otpInputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  otpInput: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "#D4D5D9",
    borderRadius: 6,
    backgroundColor: "#fff",
    textAlign: "center",
    fontSize: 16,
    color: "#535665",
    fontFamily: "inter",
    fontWeight: "700",
    marginHorizontal: 5,
    marginVertical: 20,
  },

  focusedOtpInput: {
    borderColor: "#BD1225", // Highlight color
    borderWidth: 2, // Highlight border width
  },

  existing: {
    fontSize: 14,
    color: "#000",
    textAlign: "center",
    fontFamily: "inter",
    marginBottom: 50,
  },

  redText: {
    color: "#ED1E24",
    fontFamily: "inter",
    fontWeight: "700",
  },

  disabledResendText: {
    color: "#D4D5D9",
    fontFamily: "inter",
    fontWeight: "700",
  },

  successMessage: {
    fontSize: 14,
    color: "green",
    textAlign: "center",
    fontFamily: "inter",
    marginBottom: 50,
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
    marginBottom: 30,
    paddingHorizontal: 20,
  },

  verify: {
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
});

