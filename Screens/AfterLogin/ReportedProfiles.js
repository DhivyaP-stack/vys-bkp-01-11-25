import React from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { ReportedProfilesCard } from "../../Components/DashBoardTab/ReportedProfiles/ReportedProfilesCard";
import { SuggestedProfiles } from "../../Components/HomeTab/SuggestedProfiles";

export const ReportedProfiles = () => {

    return (
        <ScrollView>
            <View style={styles.container}>

                <View style={styles.contentContainer}>
                    <Text style={styles.profileName}>Reported Profiles
                        <Text style={styles.profileId}> (05)</Text>
                    </Text>
                </View>

                <View style={styles.profileCardContainer}>
                    <ReportedProfilesCard />
                    <ReportedProfilesCard />
                    <ReportedProfilesCard />
                </View>

                {/* Suggested Profile Cards */}
                <SuggestedProfiles />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "flex-start",
        alignItems: "center",
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

});