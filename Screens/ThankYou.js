import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    ImageBackground,
    Image,
    TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";


export const ThankYou = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { profile } = route.params;
    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.textContainer}>
                <Image source={require("../assets/img/Thankyou.png")} style={styles.thankYouImg} />
                <Text style={styles.basicText}>We appreciate your interest in registering your profile in Vysyamala!</Text>
                <Text style={styles.options}>We provide two options for registering your profile</Text>
            </View>

            <ScrollView>
                <View style={styles.boxContainer}>
                    {/* Detailed Registration */}
                    <View style={styles.box}>
                        <Image source={require("../assets/img/DetailedReg.png")} style={styles.detailedRegImg} />

                        <Text style={styles.detailedRegHeading}>Detailed Registration</Text>
                        <Text style={styles.detailedRegText}>Usually takes 5-8 mins.
                            If you have enough time to upload detailed information.</Text>

                        <TouchableOpacity
                            style={styles.btn}
                            onPress={() => {
                                navigation.navigate("ContactInfo", { profile });
                            }}
                        >
                            <LinearGradient
                                colors={["#BD1225", "#FF4050"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                angle={92.08}
                                style={styles.linearGradient}
                            >
                                <Text style={styles.register}>Register Now</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Quick Registration */}
                    <View style={styles.box}>
                        <Image source={require("../assets/img/QuickReg.png")} style={styles.detailedRegImg} />

                        <Text style={styles.detailedRegHeading}>Quick Registration</Text>
                        <Text style={styles.detailedRegText}>Usually takes 2-3 mins. I am busy, I need Vysyamala Team to update the detailed horoscope. </Text>

                        <TouchableOpacity
                            style={styles.horoBtn}
                        // onPress={() => {
                        //     navigation.navigate("LoginWithPhoneNumber");
                        // }}
                        >
                            <Text style={styles.horoscope}>Upload horoscope and photo</Text>
                        </TouchableOpacity>
                    </View>


                </View>
            </ScrollView>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },

    thankYouImg: {
        width: 125,
        height: 125,
        marginBottom: 10,
    },

    textContainer: {
        width: "100%",
        paddingHorizontal: 20,
        alignItems: "center",
    },

    basicText: {
        color: "#535665",
        // color: "#4F515D",
        fontFamily: "inter",
        fontSize: 16,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 10,
    },

    options: {
        color: "#535665",
        fontFamily: "inter",
        fontSize: 14,
        marginBottom: 30,
        textAlign: "center",
    },

    boxContainer: {
        // width: "100%",
        paddingHorizontal: 20,
        alignItems: "center",
    },

    box: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#E9EAEC",
        borderRadius: 10,
        backgroundColor: "#fff",
        padding: 20,
        marginBottom: 20,
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        // elevation: 5,
    },

    detailedRegImg: {
        width: 50,
        height: 50,
        resizeMode: "contain",
        marginBottom: 10,
    },

    detailedRegHeading: {
        color: "#535665",
        // color: "#4F515D",
        fontFamily: "inter",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 10,
    },

    detailedRegText: {
        color: "#535665",
        fontFamily: "inter",
        fontSize: 14,
        marginBottom: 10,
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
        // marginBottom: 30,
        marginTop: 10,
    },

    register: {
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


    horoBtn: {
        width: "100%",
        alignSelf: "center",
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#ED1E24",
        borderRadius: 6,
        justifyContent: "center",
        padding: 15,
        marginTop: 30,
        shadowColor: "#EE1E2440",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },

    horoscope: {
        textAlign: "center",
        color: "#ED1E24",
        fontWeight: "600",
        fontSize: 16,
        letterSpacing: 1,
        fontFamily: "inter",
    },

});
