import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fetchSuggestedProfiles } from '../../../CommonApiCall/CommonApiCall'; // Make sure this function is correctly implemented to fetch data

export const SuggestedProfileCard = ({ profiles }) => {
    const navigation = useNavigation();
    
    // Add validation check
    const validProfiles = Array.isArray(profiles) ? profiles.filter(profile => profile && profile.profile_id) : [];
    
    const handleProfileClick = async (viewedProfileId) => {
        navigation.navigate("ProfileDetails", { viewedProfileId });
    };

    const renderProfile = ({ item: profile }) => (
        <TouchableOpacity
            onPress={() => handleProfileClick(profile.profile_id)}
        >
            <View style={styles.profileDiv}>
                <View style={styles.cardContainer}>
                    <Image
                        style={styles.SuggestedProfileImg}
                        source={{ 
                            uri: typeof profile.profile_img === 'string' 
                                ? profile.profile_img 
                                : Array.isArray(profile.profile_img) 
                                    ? profile.profile_img[0] 
                                    : 'https://your-default-image-url.com/placeholder.jpg'
                        }}
                    />
                    <View>
                        <Text style={styles.profileName}>
                            {profile.profile_name}
                            <Text style={styles.profileID}> ({profile.profile_id})</Text>
                        </Text>
                    </View>
                    <View style={styles.profileInfoFlex}>
                        <Text style={styles.profileAge}>{profile.profile_age} Yrs</Text>
                        <Text style={styles.profileHeight}>{profile.profile_height} cm</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    // Add error state handling
    if (!validProfiles.length) {
        return (
            <View style={styles.container}>
                <Text>No profiles available</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={validProfiles}
            renderItem={renderProfile}
            keyExtractor={item => item.profile_id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContainer}
            snapToAlignment="center"
            decelerationRate="fast"
            style={styles.flatList}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    flatList: {
        flexGrow: 0,
    },

    flatListContainer: {
        paddingHorizontal: 5,
    },

    profileDiv: {
        paddingHorizontal: 8,
    },

    cardContainer: {
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 12,
    },

    SuggestedProfileImg: {
        width: 210,
        height: 210,
        borderRadius: 0,
        marginRight: 10,
    },

    profileName: {
        color: "#FF6666",
        fontSize: 16,
        fontWeight: "700",
        fontFamily: "inter",
        paddingVertical: 5,
    },

    profileID: {
        color: "#85878C",
        fontSize: 14,
        fontWeight: "600",
    },

    profileInfoFlex: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    profileAge: {
        fontSize: 14,
        color: "#4F515D",
    },

    profileHeight: {
        fontSize: 14,
        color: "#4F515D",
    },
});
