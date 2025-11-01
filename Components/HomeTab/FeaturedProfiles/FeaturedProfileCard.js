import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export const FeaturedProfileCard = ({ profiles }) => {
    const navigation = useNavigation();
    
    // Add validation check
    const validProfiles = Array.isArray(profiles) ? profiles.filter(profile => profile && profile.profile_id) : [];

    const handleProfileClick = async (viewedProfileId) => {
        navigation.navigate("ProfileDetails", { viewedProfileId });
    };

    const renderProfile = ({ item: profile }) => (
        <TouchableOpacity
            style={styles.container}
            onPress={() => handleProfileClick(profile.profile_id)}
        >
            <View style={styles.featuredProfileDiv}>
                <View style={styles.featuredProfileContainer}>
                    <View>
                        <Image
                            style={styles.featuredProfileImg}
                            source={{ 
                                uri: typeof profile.profile_img === 'string' 
                                    ? profile.profile_img 
                                    : Array.isArray(profile.profile_img) 
                                        ? profile.profile_img[0] 
                                        : 'https://your-default-image-url.com/placeholder.jpg'
                            }}
                        />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.8)']}
                            style={styles.gradient}
                        />
                    </View>

                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>
                            {profile.profile_name}
                            <Text style={styles.profileID}> ({profile.profile_id})</Text>
                        </Text>
                        <View style={styles.profileInfoFlex}>
                            <Text style={styles.profileAge}>{profile.profile_age} years</Text>
                            <Text style={styles.profileHeight}>{profile.profile_height} cm</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    // Add error state handling
    if (!validProfiles.length) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No featured profiles available</Text>
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
        marginRight: 10,
        width: Dimensions.get('window').width * 0.4,
    },
    featuredProfileDiv: {
        paddingBottom: 20,
    },
    featuredProfileContainer: {
        position: 'relative',
    },
    featuredProfileImg: {
        width: 160,
        height: 160,
        borderRadius: 0,
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 80,
        zIndex: 0,
    },
    profileInfo: {
        position: 'absolute',
        bottom: 0,
        zIndex: 1,
        padding: 5,
    },
    profileName: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
    profileID: {
        fontSize: 12,
        color: '#85878C',
    },
    profileAge: {
        color: '#fff',
        fontSize: 12,
    },
    profileHeight: {
        color: '#fff',
        fontSize: 12,
    },
    profileInfoFlex: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        margin: 20,
    },
    flatList: {
        flexGrow: 0,
    },
    flatListContainer: {
        paddingHorizontal: 5,
    },
});
