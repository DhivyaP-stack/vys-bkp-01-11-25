import React, { useEffect, useRef, useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    KeyboardAvoidingView, Image, Platform, Keyboard
} from "react-native";
// import moment from "moment";
import moment from 'moment-timezone';
import {fetchMessages,} from '../CommonApiCall/CommonApiCall';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { Animated } from "react-native";


const ChatRoom = () => {
    const route = useRoute();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false); // To track message sending state
    const [profileId, setProfileId] = useState(null); // Add profile_id state
    const ws = useRef(null);
    const flatListRef = useRef(null); // Reference for FlatList to handle scrolling
    const [chatData, setChatData] = useState({
        created: null,
        room_id_name: null,
        statue: null,
    });

    const keyboardHeightAnimated = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", (event) => {
            Animated.timing(keyboardHeightAnimated, {
                toValue: event.endCoordinates.height,
                duration: 200,
                useNativeDriver: false,
            }).start();
        });

        const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
            Animated.timing(keyboardHeightAnimated, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }).start();
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    useEffect(() => {
        const getProfileId = async () => {
            const id = await AsyncStorage.getItem("loginuser_profileId");
            setProfileId(id);
        };
        getProfileId();
    }, []);

    const room_name_id = route.params?.room_name
    const profile_image = route.params?.profile_image
    const last_mesaage_visit = route.params?.last_mesaage_visit
    const username_list = route.params?.username
    console.log("room_name_id, profile_image, last_mesaage_visit ===>", room_name_id, profile_image, last_mesaage_visit);


    const getStoredData = async () => {
        try {
            const chatCreated = await AsyncStorage.getItem('chat_created');
            const chatRoomIdName = await AsyncStorage.getItem('chat_room_id_name');
            const chatStatue = await AsyncStorage.getItem('chat_statue');

            // Parse the data if necessary
            const parsedCreated = chatCreated ? JSON.parse(chatCreated) : null;
            const parsedStatue = chatStatue ? JSON.parse(chatStatue) : null;

            // Update the state with the retrieved values
            setChatData({
                created: parsedCreated,
                room_id_name: chatRoomIdName,
                statue: parsedStatue,
            });
        } catch (error) {
            console.error('Failed to retrieve data:', error);
        }
    };

    // Use useEffect to fetch the data when the component mounts
    useEffect(() => {
        getStoredData();
    }, []);

    const room_name = chatData.room_id_name // Static room_name value
    const username = "Vinoth"; // Static username value for this example

    // Function to load messages using the POST request
    const loadMessages = async () => {
        try {
            console.log("chat room create ==>", room_name_id)
            const apiMessages = await fetchMessages(room_name_id);
            const formattedMessages = apiMessages.map(msg => ({
                username: msg.user,
                message: msg.value,
                date: msg.date || new Date().toISOString(),
            }));

            setMessages(formattedMessages || []); // Ensure messages array is populated
        } catch (error) {
            console.error("Failed to load messages:", error);
        }
    };

    // WebSocket connection setup
    useEffect(() => {
        loadMessages(); // Fetch initial messages when component mounts
        if (!room_name_id) return;
        const websocketUrl = `ws://103.214.132.20:8000/ws/chat/${room_name_id}/?username=${username_list}`;
        ws.current = new WebSocket(websocketUrl);

        ws.current.onopen = () => {
            console.log("WebSocket connection opened.");
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("WebSocket message received:", data, room_name_id, username_list);

            // Append new message to the state
            // setMessages((prevMessages) => [...prevMessages, data]);
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages, data];
                // localStorage.setItem(`messages_${roomName}`, JSON.stringify(updatedMessages));
                return updatedMessages;
            });
            // scrollToBottom(); // Scroll to the bottom when a new message is received
        };

        ws.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        ws.current.onclose = () => {
            console.log("WebSocket connection closed.");
        };

        // Cleanup WebSocket connection on component unmount
        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [room_name_id, username_list]);

    useEffect(() => {
        if (flatListRef.current && messages.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    const sendMessage = async () => {
        if (newMessage.trim()) {
            try {
                setIsSending(true);
        
                // Send message via WebSocket
                const messageData = {
                    username: username, // Change to profileId if needed
                    message: newMessage,
                    date: new Date().toISOString(),
                };
        
                ws.current.send(JSON.stringify(messageData));
        
                // Update local messages list immediately
                // setMessages((prevMessages) => [...prevMessages, messageData]);
        
                // Clear input field
                setNewMessage('');
        
                // Prepare FormData for the first API
                const formData = new FormData();
                formData.append('profile_id', profileId);
        
                // First API call - Update unread message count
                const response = await axios.post(
                    'http://103.214.132.20:8000/auth/unread_message_count/',
                    formData,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );
                console.log('User Chat List Response:', response.data);
                // Second API call - Get user chat list
                const userChatListResponse = await axios.post(
                    'http://103.214.132.20:8000/auth/Get_user_chatlist/',
                    { profile_id: profileId }
                );
                console.log('User Chat List:', userChatListResponse.data);
            } catch (error) {
                console.error('Error during message send:', error);
            } finally {
                setIsSending(false);
            }
        }
    };


    // const renderMessage = ({ item }) => (
    //     <View style={[styles.messageContainer, item.username === username ? styles.myMessage : styles.otherMessage]}>
    //         <Text style={styles.messageText}>{item.value}</Text>
    //         <Text style={styles.messageText}>{item.message}</Text>
    //         {/* <Text style={styles.messageUsername}>{item.username}</Text> */}
    //         <Text style={styles.messageDate}>{new Date(item.date).toLocaleString()}</Text>
    //     </View>
    // );

    const renderMessage = ({ item, index }) => {
        const currentDate = moment(item.date).tz("Asia/Kolkata").format("MMMM D, YYYY");
    
        // Show the date only once per day
        const showDate =
            index === 0 ||
            moment(messages[index - 1].date).tz("Asia/Kolkata").format("MMMM D, YYYY") !== currentDate;
    
        const isCurrentUser = item.username === profileId; // Check if the message belongs to the current user
    
        return (
            <View>
                
                {/* Show Date Header */}
                {showDate && (
                    <View style={styles.dateContainer}>
                        <Text style={styles.dateText}>{currentDate}</Text>
                    </View>
                )}
    
                {/* Message Bubble */}
                <View
                    style={[
                        styles.messageContainer,
                        isCurrentUser ? styles.leftAlign : styles.rightAlign,
                    ]}
                >
                    <View
                        style={[
                            styles.messageBubble,
                            isCurrentUser ? styles.receiverBubble : styles.senderBubble,
                        ]}
                    >
                        <Text style={styles.messageText}>{item.message}</Text>
                        <Text style={styles.timeText}>
                            {moment(item.date).tz("Asia/Kolkata").format("hh:mm A")}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
            <Image
                source={{ uri: profile_image }}
                style={styles.profileImage}
            />
            <View style={styles.textContainer}>
                <Text style={styles.userName}>{username_list}</Text>
                <Text style={styles.lastSeen}>Last seen: {last_mesaage_visit}</Text>
            </View>
        </View>
            <KeyboardAvoidingView 
                style={styles.chatContainer} 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={-200} // Offset to prevent overlapping on iOS
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderMessage}
                    ListEmptyComponent={<Text style={styles.noMessages}>No messages yet.</Text>}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message"
                        value={newMessage}
                        onChangeText={(text) => setNewMessage(text)}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={isSending}>
                        <Text style={styles.sendButtonText}>
                            {isSending ? "Sending..." : "Send"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// Styles for the chat room UI
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: Platform.OS === 'ios' ? 50 : 0, // Add padding for iOS status bar
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        position: "absolute",
        top: Platform.OS === 'ios' ? 50 : 0, // Adjust top position for iOS
        left: 0,
        right: 0,
        zIndex: 10,
        elevation: 3, // For Android shadow
        height: 70, // Fixed height for header
    },
    chatContainer: {
        flex: 1,
        paddingTop: 70, // Match the header height
    },
    keyboardAvoid: {
        flex: 1,
        justifyContent: "space-between",
    },
    messageList: {
        padding: 10,
    },
    messageContainer: {
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        maxWidth: "80%",
    },
    dateContainer: {
        alignSelf: "center",
        marginVertical: 10,
        backgroundColor: "#E5E5E5",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },

    myMessage: {
        alignSelf: "flex-end",
        backgroundColor: "#DCF8C6",
    },
    otherMessage: {
        alignSelf: "flex-start",
        backgroundColor: "#ECECEC",
    },
    messageText: {
        fontSize: 16,
    },
    messageUsername: {
        fontSize: 12,
        color: "#888",
        marginTop: 5,
    },
    messageDate: {
        fontSize: 10,
        color: "#aaa",
        marginTop: 3,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#ddd",
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: "#007BFF",
        padding: 10,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    sendButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    messageContainer: {
        flexDirection: "row",
        marginVertical: 5,
        paddingHorizontal: 10,
    },
    rightAlign: {
        justifyContent: "flex-end",
    },
    leftAlign: {
        justifyContent: "flex-start",
    },
    messageBubble: {
        maxWidth: "75%",
        padding: 10,
        borderRadius: 15,
        position: "relative",
    },
    senderBubble: {
        backgroundColor: "#0078FF", // Blue for the current user's message
        alignSelf: "flex-end",
    },
    receiverBubble: {
        backgroundColor: "#E5E5E5", // Gray for other users' messages
        alignSelf: "flex-start",
    },
    messageText: {
        color: "#000000",
        fontWeight: "bold",
    },
    timeText: {
        fontSize: 10,
        marginTop: 4,
        color: "#000000",
        fontWeight: "bold",
        alignSelf: "flex-end",
    },
    container1: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#D1D5DB', // Equivalent to 'border-footer-text-gray'
        backgroundColor: '#fff',
    },
    profileImage: {
        width: 48,
        height: 48,
        borderRadius: 8,
    },
    textContainer: {
        marginLeft: 12,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000', // Equivalent to 'text-vysyamalaBlack'
    },
    lastSeen: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280', // Equivalent to 'text-ashSecondary'
        marginTop : 6
    },

});

export default ChatRoom;
