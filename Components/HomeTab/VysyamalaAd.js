import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    ImageBackground,
    Image,
    Pressable,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
} from "react-native";

export const VysyamalaAd = () => {
    return (
        <View style={styles.container}>
            <View style={styles.imgContainer}>
                <Image style={styles.productsImg}
                    source={require("../../assets/img/ProductsImg.png")} />
                <Image style={styles.bazaarImg}
                    source={require("../../assets/img/VysyaBazaar.png")} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F4F4",
        alignItems: "center",
        justifyContent: "center",
    },

    imgContainer: {
        width: "100%",
        paddingVertical: 20,
    },

    productsImg: {
        margin: "auto",
        marginBottom: 20,
    },
    bazaarImg: {
        margin: "auto",

    },
});
