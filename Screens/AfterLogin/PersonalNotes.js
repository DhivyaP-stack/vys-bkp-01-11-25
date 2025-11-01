import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { PersonalNotesCard } from "../../Components/DashBoardTab/PersonalNotes/PersonalNotesCard";
import { SuggestedProfiles } from "../../Components/HomeTab/SuggestedProfiles";
import { fetchPersonalNotesCount } from "../../CommonApiCall/CommonApiCall";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export const PersonalNotes = () => {
  const navigation = useNavigation();
  const [count, setCount] = useState(null);

  useEffect(() => {
    const loadPersonalNotes = async () => {
      try {
        const fetchedProfiles = await fetchPersonalNotesCount();
        setCount(fetchedProfiles?.personal_note_count || 0);
      } catch (error) {
        console.error("Error fetching personal notes count:", error);
        setCount(0);
      }
    };

    loadPersonalNotes();
  }, []); // Empty dependency array to run only once on mount

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#ED1E24" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{/* {"Personal Notes"} */}</Text>
      </View>
      <View style={styles.contentConatiner}>
        <Text style={styles.profileName}>
          Personal Notes
          <Text style={styles.profileId}> ({count})</Text>
        </Text>
      </View>

      <View style={styles.cardContainer}>
        <PersonalNotesCard />
      </View>

      {/* Suggested Profile Cards */}
      {/* <SuggestedProfiles /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
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
  cardContainer: {
    width: "100%",
  },
  profileName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#282C3F",
    fontFamily: "inter",
    paddingTop: 10,
  },
  profileId: {
    fontSize: 14,
    color: "#85878C",
  },
});
