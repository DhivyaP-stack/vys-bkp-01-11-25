// import React, { useState, useEffect } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   Switch,
// } from "react-native";
// import { ProfileCard } from "../../Components/HomeTab/MatchingProfiles/ProfileCard";
// import { fetchProfiles } from "../../CommonApiCall/CommonApiCall";
// import { useNavigation } from "@react-navigation/native";
// import { Ionicons } from "@expo/vector-icons";
// import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

// export const DashBoardMatchingProfiles = () => {
//   const navigation = useNavigation();
//   const [totalcount, setTotalCount] = useState();
//   //toggle switch
//   const [isEnabled, setIsEnabled] = useState(false);
//   const toggleSwitch = () => setIsEnabled(previousState => !previousState);

//   useEffect(() => {
//     const loadProfiles = async () => {
//       try {
//         const perPage = 10;
//         const pageNumber = 1;
//         // Fetch profiles data
//         const response = await fetchProfiles(perPage, pageNumber);

//         // Log the response to understand its structure
//         console.log("API Response countttt:", response.total_count);
//         setTotalCount(response.total_count);
//       } catch (error) {
//         console.error("Error loading profiles:", error);
//       } finally {
//       }
//     };

//     loadProfiles();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <View style={styles.headerContainer}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#ED1E24" />
//         </TouchableOpacity>
//         <Text style={styles.headerText}>{"Matching Profiles"}</Text>

//       </View>
//  <View style={styles.matchingContainer}>
//       {/* <SafeAreaView style={styles}> */}
//         <Text style={{ fontSize: 15,height: 20, width: 100,fontWeight: 'bold',  textAlign: '', color: '#b40101ff' }}>Sort by Date:</Text>

//         <Switch
//           trackColor={{ false: '#767577', true: '#81b0ff' }}
//           thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
//           ios_backgroundColor="#3e3e3e"
//           onValueChange={toggleSwitch}
//           value={isEnabled}
//         />
//         </View>
//       {/* </SafeAreaView> */}

//       <View style={styles.mainContent}>
//         <View style={styles.cardContainer}>
//           <ProfileCard searchProfiles={null} isLoadingNew={false} />
//         </View>
//       </View>
//     </View>
//   );
// };

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
} from "react-native";
import { ProfileCard } from "../../Components/HomeTab/MatchingProfiles/ProfileCard";
import { fetchProfiles } from "../../CommonApiCall/CommonApiCall";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

export const DashBoardMatchingProfiles = () => {
  const navigation = useNavigation();
  const [totalcount, setTotalCount] = useState(0);

  // Toggle switch - false = "1" (default), true = "2" (sort by date)
  const [isEnabled, setIsEnabled] = useState(false);

  // Get order_by value based on toggle state
  const getOrderBy = () => isEnabled ? "2" : "1";

  // Handle toggle switch change
  const toggleSwitch = async () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    const newOrderBy = newState ? "2" : "1";

    console.log('Toggle changed to:', newState ? '1' : '2');

    // Reload total count with new order
    await loadProfilesCount(newOrderBy);
  };

  const loadProfilesCount = async (orderBy = "1") => {
    try {
      const perPage = 10;
      const pageNumber = 1;

      console.log('Loading profiles count with Order by:', orderBy);

      // Fetch profiles data with orderBy
      const response = await fetchProfiles(perPage, pageNumber, orderBy);

      console.log("API Response count:", response?.total_count);
      console.log("API Response all_profile_ids:", response?.all_profile_ids);

      setTotalCount(response?.total_count || 0);
    } catch (error) {
      console.error("Error loading profiles:", error);
    }
  };

  useEffect(() => {
    loadProfilesCount(getOrderBy());
  }, []);

  // Debug: Log when orderBy changes
  useEffect(() => {
    console.log('Current orderBy state:', getOrderBy());
    console.log('Toggle is:', isEnabled ? '1' : '2');
  }, [isEnabled]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#ED1E24" />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          Matching Profiles {totalcount > 0 && `(${totalcount})`}
        </Text>
      </View>

      <View style={styles.matchingContainer}>
        <Text style={styles.sortLabel}>Sort by Date:</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#7f0909ff' }}
          thumbColor={isEnabled ? '#e80909ff' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>

      <View style={styles.mainContent}>
        <View style={styles.cardContainer}>
          <ProfileCard
            searchProfiles={null}
            isLoadingNew={false}
            orderBy={getOrderBy()}
          />
        </View>
      </View>
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
  matchingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 15, // optional for spacing
    // marginTop: 10,
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

  mainContent: {
    flex: 1,
    width: "100%",
  },
  cardContainer: {
    flex: 1,
    width: "100%",
  },
});
