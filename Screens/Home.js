import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";


export const Home = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.bgImgStyle}
        source={require("../assets/img/VysyamalaBg.png")}
      >
        <View style={styles.vysyamalaContainer}>
          <Image
            style={styles.heart}
            source={require("../assets/img/Heart.png")}
          />

          <Text
            style={styles.vysyamala}
            onPress={() => {
              navigation.navigate("LoginPage");
            }}
          >
            Vysyamala
          </Text>
          <Text style={styles.vysyamalaText}>
            The perfect match for a perfect life
          </Text>
        </View>
      </ImageBackground>
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

  bgImgStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },

  vysyamalaContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    width: "100%",
    height: "100%",
  },

  heart: {
    width: 100,
    height: 100,
    resizeMode: "center",
    marginTop: 350,
  },

  vysyamala: {
    fontSize: 60,
    color: "#fff",
    fontFamily: "kaush",
    padding: 0,
    marginTop: -45,
    textShadowColor: "#ed1e24",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 1,
  },

  vysyamalaText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "kaush",
    textAlign: "center",
    color: "#fff",
  },
});
