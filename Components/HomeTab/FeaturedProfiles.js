import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { FeaturedProfileCard } from './FeaturedProfiles/FeaturedProfileCard'; // Adjust path
import { getFeaturedProfiles } from '../../CommonApiCall/CommonApiCall';
import { useNavigation } from '@react-navigation/native';


export const FeaturedProfiles = ({ }) => {

    const [profiles, setProfiles] = useState([]);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    const handleScrollToTop = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
    };

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const data = await getFeaturedProfiles();
                console.log("fetchProfiles", data);
                // Validate that data is an array and each profile has a valid profile_img
                const validProfiles = data.filter(profile =>
                    profile && typeof profile.profile_img === 'string' && profile.profile_img
                );
                setProfiles(validProfiles);
            } catch (error) {
                console.error('Error fetching profiles:', error);
                setError('Failed to load profiles');
            }
        };

        fetchProfiles();
    }, []);

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }
    return (
        <View style={styles.container}>
            <View style={styles.featuredProfileDiv}>
                {/* Heading */}
                <View style={styles.headingFlex}>
                    <View>
                        <Text style={styles.matching}>
                            Featured Profiles
                            <Text style={styles.matchNumber}> ({profiles.length})</Text>
                        </Text>
                    </View>

                    <View style={styles.viewAllFlex}>
                        <TouchableOpacity
                            style={styles.viewAllButton}
                            onPress={() => navigation.navigate('FeaturedOrSuggestProfiles', { type: 'featured', profiles: profiles })}
                        >
                            <Text style={styles.viewAllText}>View all</Text>
                            <FontAwesome6 name="chevron-right" size={12} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {profiles.length > 0 ? (
                    // <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <FeaturedProfileCard profiles={profiles} />
                    // </ScrollView>
                ) : (
                    <Text style={styles.errorText}>No profiles found</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#14181B',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    headingFlex: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    featuredProfileDiv: {
        paddingBottom: 20,
    },
    matching: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        paddingHorizontal: 10,
        marginVertical: 20,
    },
    matchNumber: {
        fontSize: 14,
        color: '#85878C',
    },
    viewAllFlex: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 10,
    },
    viewAllText: {
        color: '#FFF',
        fontSize: 12,
        marginRight: 5,
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
