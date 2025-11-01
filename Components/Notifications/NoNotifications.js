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

export const NoNotifications = () => {
    return (
        <View style={styles.container}>
            <View style={styles.noNotificationsContainer}>
                <Image
                    style={styles.notificationsIcon}
                    source={require("../../assets/img/Notifications.png")}
                />
            </View>
            <Text style={styles.noNotificationsText}>No notifications yet</Text>
            <Text style={styles.noNotificationsContent}>
                You have no notifications right now. When you get notifications, they’ll
                show up here
            </Text>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },

    noNotificationsContainer: {
        textAlign: "center",
        padding: 10,
    },

    notificationsIcon: {
        width: 80,
        height: 80,
        resizeMode: "contain",
        marginBottom: 10,
    },

    noNotificationsText: {
        fontSize: 18,
        fontWeight: "700",
        fontFamily: "inter",
        marginBottom: 10,
    },

    noNotificationsContent: {
        fontSize: 12,
        fontFamily: "inter",
        textAlign: "center",
        paddingHorizontal: 10,
    },
});
