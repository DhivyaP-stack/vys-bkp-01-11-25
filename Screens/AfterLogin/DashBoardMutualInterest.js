import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ProfileCard } from "../../Components/HomeTab/MatchingProfiles/ProfileCard";
import { SuggestedProfiles } from "../../Components/HomeTab/SuggestedProfiles";
import { DashBoardMutualInterestCard } from "../../Components/DashBoardTab/DashBoardMutualInterest/DashBoardMutualInterestCard";
import { fetchMutualInterestsCount } from "../../CommonApiCall/CommonApiCall"; // Update import path
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
export const DashBoardMutualInterest = () => {
  const navigation = useNavigation();
  const [count, setCount] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const profiles = await fetchMutualInterestsCount();
        console.log("sdcsdcsdc", profiles);
        setCount(profiles.mut_int_count || 0);
      } catch (error) {
        console.error('Error fetching wishlist count:', error);
        setCount(0);
      }
    };
    fetchProfiles();
  }, []);
  return (
    // <ScrollView>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#ED1E24" />
          </TouchableOpacity>
          <Text style={styles.headerText}>{/* {"Mutual Interest"} */}</Text>
        </View>
        <View style={styles.contentConatiner}>
          <Text style={styles.profileName}>
            Mutual Interest
            <Text style={styles.profileId}> ({count})</Text>
          </Text>
        </View>

        {/* Profile Cards */}
        <View style={styles.cardContainer}>
          <DashBoardMutualInterestCard />
        </View>
      </View>
    // </ScrollView>
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
  contentConatiner: {
    width: "100%",
    paddingHorizontal: 10,
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

  cardContainer: {
    width: "100%",
  },
});
