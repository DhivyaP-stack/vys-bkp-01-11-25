import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchChatList, fetchChatListSearch } from "../CommonApiCall/CommonApiCall"; // Import the common API function
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const MessageShimmer = () => {
  const shimmerItems = Array(8).fill(0); // Create 8 shimmer items
  
  const renderShimmerItem = () => (
    <View style={styles.chatItem}>
      <View style={styles.avatarContainer}>
        <ShimmerPlaceholder
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
          }}
        />
      </View>
      <View style={styles.chatDetails}>
        <ShimmerPlaceholder
          style={{
            width: '60%',
            height: 20,
            marginBottom: 6,
            borderRadius: 4,
          }}
        />
        <ShimmerPlaceholder
          style={{
            width: '80%',
            height: 16,
            borderRadius: 4,
          }}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <ShimmerPlaceholder
          style={{
            flex: 1,
            height: 49,
            borderRadius: 5,
          }}
        />
      </View>
      {shimmerItems.map((_, index) => (
        <View key={index}>{renderShimmerItem()}</View>
      ))}
    </SafeAreaView>
  );
};

export const Message = () => {
  const navigation = useNavigation();
  const route = useRoute(); // To access params from the previous screen
  const [chatList, setChatList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fromProfileId = route.params?.from_profile_id || null; // Retrieve from_profile_id if available

  console.log("chat", fromProfileId);
// Use navigation listener to trigger fetchAllData every time the screen is focused
  useEffect(() => {
  const unsubscribe = navigation.addListener("focus", () => {
    fetchAllData();
  });
  return unsubscribe;
  }, [navigation]);

  // Function to fetch chat list data and toggle the spinner
  const fetchAllData = async () => {
    setSearchText(""); // Reset search text
    setIsLoading(true);
    try {
      const fetchedChatList = await fetchChatList();
      // setChatList(fetchedChatList);
      // console.log("fetchedChatList list ==>", fetchedChatList);

      const sortedChatList = fetchedChatList.slice().sort((a, b) => {
        if (a.last_mesaage_seen === b.last_mesaage_seen) return 0;
        return a.last_mesaage_seen ? 1 : -1;
      });
  
      setChatList(sortedChatList);
      console.log("sortedChatList ==>", sortedChatList);  
      
      // If fromProfileId is provided, navigate automatically to that chat
      if (fromProfileId) {
        const targetChat = fetchedChatList.find((chat) => {
          console.log("chat object:", chat);
          return chat.profile_user_id === fromProfileId;
        });
      
        if (targetChat) {
          handleProfileClick(targetChat);
        } else {
          console.warn("No chat found for profile_id:", fromProfileId);
        }
      }
    } catch (error) {
      console.error("Error fetching chat list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search functionality
  const handleSearch = async (text) => {
    setSearchText(text);

    if (text.trim() === "") {
      // Reset the list to default chat list when search is cleared
      const defaultChatList = await fetchChatList();
      setChatList(defaultChatList);
      return;
    }

    // Call search API when text is entered
    const searchResults = await fetchChatListSearch(text);
    console.log("searchResults ==>", searchResults);
    setChatList(searchResults); // Update chat list with search results
  };

  // Handle profile click, navigate to ChatRoom
  const handleProfileClick = (item) => {
    navigation.navigate("ChatRoom", {
      room_name: item.room_name_id,
      username: item.profile_user_name, // Replace with dynamic username
      from_profile_id: item.profile_id, // Pass the profile id to the ChatRoom
      profile_image: item.profile_image,
      last_mesaage_visit: item.profile_lastvist,
    });
  };

  // Render each chat item (profile)
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => handleProfileClick(item)}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: `${item.profile_image}` }}
          style={styles.avatar}
        />
        {/* {!item.last_mesaage_seen && <View style={styles.unreadIndicator} />} */}
      </View>
      <View style={styles.chatDetails}>
        <Text style={styles.name}>{item.profile_user_name}</Text>
        <Text style={[
          styles.message,
          !item.last_mesaage_seen && styles.unreadMessage
        ]}>
          {item.last_mesaage}
        </Text>
        <Text style={styles.time}>{item.profile_lastvist}</Text>
        {!item.last_mesaage_seen && <View style={styles.unreadIndicator} />}
      </View>
    </TouchableOpacity>
  );

  // No Chats Available component
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={{
          uri: "https://img.icons8.com/?size=100&id=4VEQ8USN91aS&format=png&color=000000", // Use an online image URL here
        }}
        style={styles.emptyImage}
      />
      <Text style={styles.emptyText}>No Chats Available</Text>
      <Text style={styles.emptySubText}>oops!</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  // Replace the loading indicator with MessageShimmer
  // if (isLoading) {
  //   return <MessageShimmer />;
  // }
  

  return (
    <SafeAreaView style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Chats"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      {/* Chat List */}
      <FlatList
        data={chatList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={renderEmptyComponent}
      />
    </SafeAreaView>
  );
};

// Styles for the chat list UI
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },
  searchContainer: {
    flexDirection: "row",
    padding: 19,
    borderBottomWidth: 3,
    borderBottomColor: "#fff",
  },
  searchInput: {
    flex: 1,
    height: 49,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",  
  },
  chatItem: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
    width: 50, // Match avatar width
    height: 50, // Match avatar height
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  unreadIndicator: {
    position: 'absolute',
    right: 15, // Changed from 0 to 15 to account for marginRight of avatar
    top: 20,
    width: 17, // Slightly smaller size
    height: 17, // Slightly smaller size
    borderRadius: 100, // Half of width/height for perfect circle
    backgroundColor: '#FF3B30', // iOS-style red color
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 1, // Ensure it's above the avatar
  },
  chatDetails: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  message: {
    fontSize: 14,
    color: "#555",
  },
  unreadMessage: {
    fontWeight: 'bold',
    color: '#000',
  },
  time: {
    fontSize: 12,
    color: "#aaa",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

});

export default Message;
