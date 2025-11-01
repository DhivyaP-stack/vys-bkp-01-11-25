import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SuggestedProfiles } from "../../Components/HomeTab/SuggestedProfiles";
import { MyVisitorsCard } from "../../Components/DashBoardTab/MyVisitors/MyVisitorsCard";
import { fetchVisitorProfilesCount } from "../../CommonApiCall/CommonApiCall"; // Update import path
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export const MyVisitors = () => {
  const navigation = useNavigation();
  const [count, setCount] = useState(null);

  useEffect(() => {
    const getProfiles = async () => {
      try {
        const profilesData = await fetchVisitorProfilesCount(); // Replace with dynamic profile_id if needed
        setCount(profilesData.viewd_count || 0);
      } catch (error) {
        console.error("Error fetching wishlist count:", error);
        setCount(0);
      }
    };
    getProfiles();
  }, []);

  return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#ED1E24" />
          </TouchableOpacity>
          {/* <Text style={styles.headerText}>{"My Visitors"}</Text> */}
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.profileName}>
            My Visitors
            <Text style={styles.profileId}> ({count})</Text>
          </Text>
        </View>

        {/* Profile Cards */}
        <View style={styles.profileCardContainer}>
          <MyVisitorsCard />
        </View>
      </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    // alignItems: "center",
    // justifyContent: "center",
  },
  headerContainer: {
    padding: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    marginLeft: 10,
  },
  headerText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  contentContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },

  profileCardContainer: {
    width: "100%",
  },

  profileName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#282C3F",
    fontFamily: "inter",
    // marginBottom: 10,
    paddingTop: 10,
  },

  profileId: {
    fontSize: 14,
    color: "#85878C",
  },

  day: {
    color: "#85878C",
    fontSize: 12,
    fontWeight: "700",
    paddingTop: 10,
    paddingHorizontal: 10,
  },
});
