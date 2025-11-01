import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    Switch,
    SafeAreaView,
    ImageBackground,
    Image,
    ScrollView,
    TouchableOpacity,
    Pressable,
    Animated,
    TouchableWithoutFeedback,
    TouchableHighlight,
    Dimensions,
    Modal,
} from "react-native";
import {
    AntDesign,
    Ionicons,
    MaterialIcons,
    FontAwesome,
    FontAwesome5,
    FontAwesome6,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import Carousel from 'react-native-reanimated-carousel';
import ImageViewer from 'react-native-image-zoom-viewer';
import RadioGroup from 'react-native-radio-buttons-group';
import { launchImageLibrary } from 'react-native-image-picker';
import { useState, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import CircularProgress from "react-native-circular-progress-indicator";
import { useNavigation } from "@react-navigation/native";

export const Rasi = () => {
    const navigation = useNavigation();

    // Toggle Switch
    const [isEnglish, setIsEnglish] = useState(true);

    const toggleSwitch = () => setIsEnglish(previousState => !previousState);

    // Cell Text
    const englishTexts = [
        'Pisces', 'Aries', 'Taurus', 'Gemini', 'Aquarius', '', '', 'Cancer',
        'Capricorn', '', '', 'Leo', 'Sagittarius', 'Scorpio', 'Libra', 'Virgo'
    ];

    const tamilTexts = [
        'மீனம்', 'மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கும்பம்', '', '', 'கடகம்',
        'மகரம்', '', '', 'சிம்மம்', 'தனுசு', 'விருச்சிகம்', 'துலாம்', 'கன்னி'
    ];

    const centralCellText = isEnglish ? "Rasi" : "இராசி கட்டம்";

    const texts = isEnglish ? englishTexts : tamilTexts;

    // Cell on click background change
    const [selectedCellIndex, setSelectedCellIndex] = useState(null);

    const handleCellPress = (index) => {
        setSelectedCellIndex(index);
        setModalVisible(true);
        setEditingGrid('rasi');
    };

    // Amsam Cell Text
    const englishAmsamTexts = [
        'Pisces', 'Aries', 'Taurus', 'Gemini', 'Aquarius', '', '', 'Cancer',
        'Capricorn', '', '', 'Leo', 'Sagittarius', 'Scorpio', 'Libra', 'Virgo'
    ];

    const tamilAmsamTexts = [
        'மீனம்', 'மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கும்பம்', '', '', 'கடகம்',
        'மகரம்', '', '', 'சிம்மம்', 'தனுசு', 'விருச்சிகம்', 'துலாம்', 'கன்னி'
    ];

    const centralCellAmsamText = isEnglish ? "Amsam" : "நவாம்சம் கட்டம்";

    const amsamTexts = isEnglish ? englishAmsamTexts : tamilAmsamTexts;

    // Cell on click background change
    const [selectedCellAmsamIndex, setSelectedCellAmsamIndex] = useState(null);

    const handleCellAmsamPress = (index) => {
        setSelectedCellAmsamIndex(index);
        setModalVisible(true);
        setEditingGrid('amsam')
    };


    // Modal for value selection
    const [modalVisible, setModalVisible] = useState(false);
    const [editingGrid, setEditingGrid] = useState(null); // Track which grid is being edited (rasi or amsam)
    const values = (isEnglish ? englishTexts : tamilTexts).filter(value => value);

    const radioButtonsData = values.map(value => ({
        id: value, // or a unique id
        label: value,
        value: value
    }));

    const [radioButtons, setRadioButtons] = useState(radioButtonsData);

    const handleValueSelect = () => {
        const selectedValue = radioButtons.find(rb => rb.selected).value; // Assuming one radio button is always selected
        if (editingGrid === 'rasi') {
            const updatedTexts = [...texts];
            updatedTexts[selectedCellIndex] = selectedValue;
            setTexts(updatedTexts); // Update the state holding Rasi chart texts
        } else if (editingGrid === 'amsam') {
            const updatedAmsamTexts = [...amsamTexts];
            updatedAmsamTexts[selectedCellAmsamIndex] = selectedValue;
            setAmsamTexts(updatedAmsamTexts); // Update the state holding Amsam chart texts
        }
        setModalVisible(false);
    };


    return (
        <View>
            {/* Rasi cell Div */}
            <View style={styles.rasiCellDiv}>
                <View style={styles.rasiToggleFlex}>
                    <Text style={styles.headerText}>Rasi & Amsam Grid</Text>
                    <View style={styles.languageToggle}>
                        <Text style={[styles.languageText, { color: isEnglish ? '#FF4050' : '#000' }]}>English</Text>
                        <Switch
                            trackColor={{ false: "#FF4050", true: "#53c840" }}
                            thumbColor={isEnglish ? "#fff" : "#fff"}
                            onValueChange={toggleSwitch}
                            value={!isEnglish}
                        />
                        <Text style={[styles.languageText, { color: !isEnglish ? '#53c840' : '#000' }]}>Tamil</Text>
                    </View>
                </View>

                {/* Rasi Chart */}
                <View style={styles.grid}>
                    {Array.from({ length: 16 }).map((_, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.gridCell,
                                (index === 5 || index === 6 || index === 9 || index === 10) && styles.hiddenCell,
                                selectedCellIndex === index && styles.selectedCell
                            ]}
                            onPress={() => handleCellPress(index)}
                        >
                            <Text style={styles.rasiName}>{texts[index]}</Text>
                        </TouchableOpacity>
                    ))}
                    <View style={styles.centralCell}>
                        <Text style={styles.centralCellText}>{centralCellText}</Text>
                    </View>
                </View>

                {/* Amsam  */}
                <View style={styles.grid}>
                    {Array.from({ length: 16 }).map((_, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.gridCell,
                                (index === 5 || index === 6 || index === 9 || index === 10) && styles.hiddenCell,
                                selectedCellAmsamIndex === index && styles.selectedCell
                            ]}
                            onPress={() => handleCellAmsamPress(index)}
                        >
                            <Text style={styles.rasiName}>{amsamTexts[index]}</Text>
                        </TouchableOpacity>
                    ))}
                    <View style={styles.centralCell}>
                        <Text style={styles.centralCellText}>{centralCellAmsamText}</Text>
                    </View>
                </View>

                {/* Modal for value selection */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <ScrollView>
                                <RadioGroup
                                    radioButtons={radioButtons}
                                    onPress={setRadioButtons}
                                />
                            </ScrollView>
                            <TouchableHighlight
                                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                                onPress={handleValueSelect}
                            >
                                <Text style={styles.textStyle}>Select</Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                style={{ ...styles.openButton, backgroundColor: "#FF0000" }}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                }}
                            >
                                <Text style={styles.textStyle}>Cancel</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>


            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "flex-start",
    },

    rasiCellDiv: {
        width: "100%",
        // backgroundColor: "#FFFBE3",
        // paddingHorizontal: 10,
        // paddingTop: 20,
        // paddingBottom: 10,
    },



    rasiName: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        // height: '100%', // Ensure it takes the full height of the cell
        // width: '100%',  // Ensure it takes the full width of the cell
        // display: 'flex',
        // flex: 1
        verticalAlign: "middle", //
        alignSelf: "center", //
        position: "absolute", //
        top: 30, //
    },

    rasiToggleFlex: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        // marginBottom: 20,
    },

    headerText: {
        fontSize: 18,
        fontFamily: "inter",
        fontWeight: '700',
    },

    languageToggle: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    languageText: {
        marginHorizontal: 5,
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: "100%",
        position: 'relative',
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 30,
    },

    gridCell: {
        width: "22%",
        height: 80,
        borderWidth: 1,
        borderColor: "#535665",
        justifyContent: 'center',
        alignItems: 'center',
        margin: 4,
        backgroundColor: "#fff",
    },

    hiddenCell: {
        backgroundColor: 'transparent',
        borderWidth: 0,
    },

    centralCell: {
        position: 'absolute',
        // top: 92,  // Adjust based on gridCell height and margin
        // left: 112, // Adjust based on gridCell width and margin
        top: "26%",  // Adjust based on gridCell height and margin
        left: "26.5%", // Adjust based on gridCell width and margin
        // width: 188,  // Width of two cells
        // height: 168, // Height of two cells
        width: "47%",  // Width of two cells
        height: 168, // Height of two cells
        backgroundColor: '#ececec',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },

    centralCellText: {
        color: "#000",
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: "center",
        fontFamily: "inter",
    },

    selectedCell: {
        backgroundColor: '#FFD700',
    },

    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginVertical: 5,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    radioButtonWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },

});
