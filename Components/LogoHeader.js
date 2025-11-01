import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { fetchNotifications } from '../CommonApiCall/CommonApiCall'; // Import the function from commonApi.js


export const LogoHeader = (props) => {
    const navigation = useNavigation();

    return (
    <View style={styles.container}>
            <Image
                style={styles.logo}
                source={require("../assets/img/VysyamalaLogo.png")}
            />

            {/* <TouchableOpacity
                onPress={handleNotificationClick}
                style={styles.notificationContainer}
            >
                <MaterialIcons name="notifications" size={24} color="#535665" />
                {notifyCount > 0 && (
                    <View style={styles.notificationBadge}>
                        <Text style={styles.notificationText}>{notifyCount}</Text>
                    </View>
                )}
            </TouchableOpacity> */}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
    },

    logo: {
        width: 125,
        height: 100,
        resizeMode: "contain",
    },

    bell: {
        width: 15,
        height: 15,
        resizeMode: "contain",
    },
    notificationContainer: {
        position: "relative",
        padding: 10,
    },
    notificationBadge: {
        position: "absolute",
        right: 0,
        top: 0,
        backgroundColor: "red",
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    notificationText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
});
