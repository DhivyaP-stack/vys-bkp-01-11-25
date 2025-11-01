// VysassistResults
import React from "react";
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Text } from "react-native";
import { SearchCard } from "../../Components/DashBoardTab/Search/SearchCard";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { VysassistCard } from "../../Components/Vysassist/VysassistCard";
export const VysassistResults = () => {
    const navigation = useNavigation();

    return (
            <SafeAreaView style={styles.container}>
                <View style={styles.headerContainer}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                          <Ionicons name="arrow-back" size={24} color="#ED1E24" />
                        </TouchableOpacity>
                        <Text style={styles.headerText}>{"Vysassist Notes"}</Text>
                      </View>
                      
                <View style={styles.searchResultsContainer}>
                    <VysassistCard />
                </View>
            </SafeAreaView>
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
        marginTop : 15,
        marginLeft : 10,
      },
      headerText: {
        color: "#000000",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
      },
    searchResultsContainer: {
        width: "100%",
        justifyContent: 'flex-start',
    }
});
