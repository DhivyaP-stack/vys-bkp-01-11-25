import React from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
} from "react-native";
import { NotificationsCard } from "../Components/Notifications/NotificationsCard";

export const Notifications = () => {
  return (
    <SafeAreaView style={styles.container}>
      <NotificationsCard />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
