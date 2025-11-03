import React, { useState, useRef, useEffect } from 'react'
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
    TextInput,
    Button,

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
import { getMyFamilyDetails, updateProfileFamily } from '../../CommonApiCall/CommonApiCall'; // Import the API function
import RNPickerSelect from 'react-native-picker-select';
import config from "../../API/Apiurl";
import axios from "axios";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export const FamilyDetails = () => {

    const [familyDetails, setFamilyDetails] = useState(null); // State for profile details
    const [isEditMode, setIsEditMode] = useState(false); // Toggle between view and edit mode
    const [validationErrors, setValidationErrors] = useState({});
    const [familyStatusOptions, setFamilyStatus] = useState([]);
    const [selectedValue, setSelectedValue] = useState(null);
    const [SelectedValueBro, setSelectedValueBro] = useState(null);
    const [selectedSistersMarried, setSelectedSistersMarried] = useState(null); // State for the second dropdown
    const [selectedBrothersMarried, setSelectedBrothersMarried] = useState(null); // State for the second dropdown
    const [martialStatus, setMartialStatus] = useState(null);
    const [noOfChildren, setNoOfChildren] = useState('');

    const [submitting, setSubmitting] = useState(false); // Add state to track submission
    const [isFetched, setIsFetched] = useState(false);




    const [formValues, setFormValues] = useState({
        personal_about_fam: '',
        personal_father_name: '',
        personal_father_occu_name: '',
        personal_mother_name: '',
        personal_mother_occu_name: '',
        personal_fam_sta_name: '',
        personal_sis: '',
        personal_sis_married: '',
        personal_bro: '',
        personal_bro_married: '',
        personal_prope_det: '',
        personal_father_occu_id: null,
        personal_mother_occu_id: null,
        personal_fam_sta_id: null,
        personal_no_of_children: null,
        father_alive: '',
        mother_alive: ''
    });

    // Function to fetch profile data
    const fetchProfileData = async () => {
        try {
            const data = await getMyFamilyDetails();
            setFamilyDetails(data.data); // Set the data in the state
        } catch (error) {
            console.error('Failed to load profile data', error);
        }
    };



    useEffect(() => {
        fetchProfileData(); // Call the function when component mounts
    }, []);



    useEffect(() => {

        const fetchFamilyStatus = async () => {
            try {
                const response = await axios.post(`${config.apiUrl}/auth/Get_FamilyStatus/`);
                const FamilyStatusArray = Object.keys(response.data).map(key => ({
                    label: response.data[key].family_status_name,
                    value: response.data[key].family_status_id.toString(),
                }));
                setFamilyStatus(FamilyStatusArray);
            } catch (error) {
                console.error("Error fetching Family status:", error);
            }
        };
        fetchFamilyStatus();
    }, []);



    useEffect(() => {
        // Update form values when familyDetails is fetched
        if (familyDetails && !isFetched) {
            setFormValues({
                personal_about_fam: familyDetails.personal_about_fam || '',
                personal_father_name: familyDetails.personal_father_name || '',
                personal_father_occu_name: familyDetails.personal_father_occu_name || '',
                personal_mother_name: familyDetails.personal_mother_name || '',
                personal_mother_occu_name: familyDetails.personal_mother_occu_name || '',
                personal_fam_sta_name: familyDetails.personal_fam_sta_name || '',
                personal_sis: familyDetails.personal_sis || '',
                personal_sis_married: familyDetails.personal_sis_married || '',
                personal_bro: familyDetails.personal_bro || '',
                personal_bro_married: familyDetails.personal_bro_married || '',
                personal_prope_det: familyDetails.personal_prope_det || '',
                personal_father_occu_id: familyDetails.personal_father_occu_id || null,
                personal_mother_occu_id: familyDetails.personal_mother_occu_id || null,
                personal_fam_sta_id: familyDetails.personal_fam_sta_id || null,
                personal_no_of_children: familyDetails.personal_no_of_children || null,
                father_alive: familyDetails.father_alive || '',
                mother_alive: familyDetails.mother_alive || '',
            });
            setIsFetched(true);  // Mark as fetched to prevent further updates

        }
    }, [familyDetails, isFetched]);



    // Personal Menu

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getMyFamilyDetails(); // Fetch family details
                setSelectedValue(data.data.personal_sis.toString()); // Set the value as a string for dropdown
                setSelectedValueBro(data.data.personal_bro.toString()); // Set the value as a string for dropdown
                setSelectedSistersMarried(data.data.personal_sis_married.toString());
                setSelectedBrothersMarried(data.data.personal_bro_married.toString());
            } catch (error) {
                console.error('Failed to load profile data', error);
            }
        };

        fetchData(); // Call the fetch function when the component mounts
    }, []); // Empty dependency array means this runs once on mount

    useEffect(() => {
        const fetchMartialStatus = async () => {
            try {
                const value = await AsyncStorage.getItem("martial_status");
                console.log("value check ====>", value)
                setMartialStatus(value);
            } catch (error) {
                console.error("Failed to fetch martial_status from AsyncStorage", error);
            }
        };
        fetchMartialStatus();
    }, []);


    const getSistersMarriedOptions = (sistersCount) => {
        const count = parseInt(sistersCount);
        return Array.from({ length: count + 1 }, (_, i) => ({
            // label: i.toString(),
            label: i === 5 ? '5+' : i.toString(), // Show '5+' instead of 5
            value: i.toString(),
        }));
    };

    const getBrothersMarriedOptions = (brothersCount) => {
        const count = parseInt(brothersCount);
        return Array.from({ length: count + 1 }, (_, i) => ({
            label: i === 5 ? '5+' : i.toString(), // Show '5+' instead of 5
            value: i.toString(),
        }));
    };



    const handleSecondDropdownChange = (value) => {
        setSelectedSistersMarried(value);
        if (value !== null) {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                selectedSistersMarried: '', // Clear second dropdown error when a value is selected
            }));
        }
    };

    const handleThirdDropdownChange = (value) => {
        setSelectedBrothersMarried(value);
        if (value !== null) {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                selectedBrothersMarried: '', // Clear second dropdown error when a value is selected
            }));
        }
    };



    // const handleChange = (field, value) => {
    //     setFormValues((prevValues) => ({
    //         ...prevValues,
    //         [field]: value,
    //     }));

    //     if (field === 'personal_work_coun_id') {
    //         fetchStateList(value); // Fetch states based on selected country
    //     }
    //     // Clear the error message for the field
    //     setValidationErrors((prevErrors) => ({
    //         ...prevErrors,
    //         [field]: '',
    //     }));
    // };


    const handleChange = (field, value) => {
        setFormValues((prevValues) => {
            // Update the value to either the user input or empty string
            const updatedValue = value === '' ? '' : value;

            return {
                ...prevValues,
                [field]: updatedValue,
            };
        });
        if (field === 'personal_work_coun_id') {
            fetchStateList(value); // Fetch states based on selected country
        }
        // Clear the error message for the field
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [field]: '',
        }));
    };



    const validateForm = () => {
        const errors = {};

        // Validate each field
        // if (!formValues.personal_about_fam) errors.personal_about_fam = 'About Family is required';
        // if (!formValues.personal_father_name) errors.personal_father_name = 'Father Name is required';
        // if (!formValues.personal_father_occu_name) errors.personal_father_occu_name = 'Father Occupation Name is required';
        // if (!formValues.personal_mother_name) errors.personal_mother_name = 'Mother Name is required';
        // if (!formValues.personal_mother_occu_name) errors.personal_mother_occu_name = 'Mother Occupation Name is required';
        // if (!formValues.personal_fam_sta_name) errors.personal_fam_sta_name = 'Family Status Name is required';
        // if (!formValues.personal_sis) errors.personal_sis = 'Number of Sisters is required';
        // if (!formValues.personal_sis_married) errors.personal_sis_married = 'Sisters Married status is required';
        // if (!formValues.personal_bro) errors.personal_bro = 'Number of Brothers is required';
        // if (!formValues.personal_bro_married) errors.personal_bro_married = 'Brothers Married status is required';
        // if (!formValues.personal_prope_det) errors.personal_prope_det = 'Property Details are required';

        // // Validate dropdowns for family details
        // if (!formValues.personal_fam_sta_id) errors.personal_fam_sta_id = 'Family Status ID is required';

        // if (selectedValue === null) {
        //     errors.selectedValue = 'Please select a number.'; // Add error for dropdown
        // }

        // if (SelectedValueBro === null) {
        //     errors.SelectedValueBro = 'Please select a number.'; // Add error for dropdown
        // }

        // if (parseInt(selectedValue) >= 1 && !selectedSistersMarried) {
        //     errors.selectedSistersMarried = 'Please select the number of sisters married.';
        // }

        // if (parseInt(SelectedValueBro) >= 1 && !selectedBrothersMarried) {
        //     errors.selectedBrothersMarried = 'Please select the number of brothers married.';
        // }

        // if (['2', '3', '5'].includes(martialStatus) && !noOfChildren) {
        //     errors.noOfChildren = 'Please select the number of children.';
        // }

        setValidationErrors(errors);

        return Object.keys(errors).length === 0; // Return true if there are no errors
    };


    // const handleSave = () => {
    //     if (validateForm()) {
    //         // Proceed with form submission
    //         console.log(selectedValue);
    //         console.log('Form values to save:', formValues);
    //     }
    // };




    const handleSave = async () => {
        console.log("Starting save operation...");
        if (validateForm()) {
            // Map the selected dropdown values to the form data
            const familyData = {
                father_name: formValues.personal_father_name || "",
                father_occupation: formValues.personal_father_occu_name || "",
                mother_name: formValues.personal_mother_name || "",
                mother_occupation: formValues.personal_mother_occu_name || "",
                family_status: formValues.personal_fam_sta_id || "",
                no_of_sister: selectedValue || "0",
                no_of_sis_married: selectedSistersMarried || "0",
                no_of_brother: SelectedValueBro || "0",
                no_of_bro_married: selectedBrothersMarried || "0",
                property_details: formValues.personal_prope_det || "",
                personal_about_fam: formValues.personal_about_fam || "",
                no_of_children: noOfChildren === "" ? "0" : noOfChildren,
                father_alive: formValues.father_alive || "",
                mother_alive: formValues.mother_alive || "",
            };
            console.log("Submitting family data:", familyData);

            try {
                setSubmitting(true); // Show loading state
                const response = await updateProfileFamily(familyData);
                console.log('Family profile update response:', response);

                if (response && response.status === 'success') {
                    Toast.show({
                        type: 'success',
                        text1: 'Success',
                        text2: response.message || 'Family profile updated successfully',
                        visibilityTime: 3000,
                        autoHide: true
                    });
                    setIsEditMode(false); // Exit edit mode on success
                    await fetchProfileData();  // Refresh profile data
                } else {
                    throw new Error(response?.message || 'Update failed');
                }
            } catch (error) {
                console.error('Failed to update family profile:', error);
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: error.message || 'Failed to update family profile. Please try again.',
                    visibilityTime: 4000,
                    autoHide: true
                });
            } finally {
                setSubmitting(false); // Hide loading state
            }
        }
    };





    return (

        <View style={styles.menuChanges}>
            <View style={styles.editOptions}>
                <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 15 }}>Family Details</Text>
                <TouchableWithoutFeedback onPress={() => setIsEditMode(!isEditMode)}>
                    <Text style={styles.redText}>{isEditMode ? 'View' : 'Edit'}</Text>
                </TouchableWithoutFeedback>
                {isEditMode ? (
                    <View style={styles.editOptions}>
                        {/* About Family */}
                        <View style={styles.formGroup}>
                            <Text style={styles.labelNew}>About Family</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter About Family"
                                value={formValues.personal_about_fam}
                                onChangeText={(text) => handleChange('personal_about_fam', text)}
                            />
                            {validationErrors.personal_about_fam && <Text style={styles.error}>{validationErrors.personal_about_fam}</Text>}
                        </View>

                        {/* Father Name */}
                        <View style={styles.formGroup}>
                            <Text style={styles.labelNew}>Father Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Father Name"
                                value={formValues.personal_father_name}
                                onChangeText={(text) => handleChange('personal_father_name', text)}
                            />
                            {validationErrors.personal_father_name && <Text style={styles.error}>{validationErrors.personal_father_name}</Text>}
                        </View>

                        {/* Father Occupation */}
                        <View style={styles.formGroup}>
                            <Text style={styles.labelNew}>Father Occupation</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Father Occupation"
                                value={formValues.personal_father_occu_name}
                                onChangeText={(text) => handleChange('personal_father_occu_name', text)}
                            />
                            {validationErrors.personal_father_occu_name && <Text style={styles.error}>{validationErrors.personal_father_occu_name}</Text>}
                        </View>

                        {/* Mother Name */}
                        <View style={styles.formGroup}>
                            <Text style={styles.labelNew}>Mother Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Mother Name"
                                value={formValues.personal_mother_name}
                                onChangeText={(text) => handleChange('personal_mother_name', text)}
                            />
                            {validationErrors.personal_mother_name && <Text style={styles.error}>{validationErrors.personal_mother_name}</Text>}
                        </View>

                        {/* Mother Occupation */}
                        <View style={styles.formGroup}>
                            <Text style={styles.labelNew}>Mother Occupation</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Mother Occupation"
                                value={formValues.personal_mother_occu_name}
                                onChangeText={(text) => handleChange('personal_mother_occu_name', text)}
                            />
                            {validationErrors.personal_mother_occu_name && <Text style={styles.error}>{validationErrors.personal_mother_occu_name}</Text>}
                        </View>

                        {/* Family Status */}
                        <View style={styles.formGroup}>
                            <Text style={styles.labelNew}>Family Status</Text>
                            <RNPickerSelect
                                onValueChange={(value) => handleChange('personal_fam_sta_id', value)}
                                items={familyStatusOptions}
                                value={formValues.personal_fam_sta_id}
                                useNativeAndroidPickerStyle={false} // Important for custom styles on Android
                                Icon={() => (
                                    <Ionicons
                                        name="chevron-down" // Name of the icon
                                        size={24}
                                        color="gray"
                                        style={{ marginTop: 10 }}
                                    />
                                )}
                                placeholder={{ label: "Select Family Status", value: null }}
                                style={pickerSelectStyles}
                            />
                            {validationErrors.personal_edu_name && <Text style={styles.error}>{validationErrors.personal_edu_name}</Text>}
                        </View>

                        {/* Number of Sisters */}
                        <View style={styles.formGroup}>
                            <Text style={styles.labelNew}>Number of Sisters</Text>
                            <RNPickerSelect
                                onValueChange={(value) => {
                                    setSelectedValue(value);
                                    if (value !== null) {
                                        setValidationErrors((prevErrors) => ({
                                            ...prevErrors,
                                            selectedValue: '',
                                        }));
                                    }
                                }}
                                items={[
                                    { label: '0', value: "0" },
                                    { label: '1', value: "1" },
                                    { label: '2', value: "2" },
                                    { label: '3', value: "3" },
                                    { label: '4', value: "4" },
                                    { label: '5+', value: "5+" },
                                ]}
                                value={selectedValue}
                                useNativeAndroidPickerStyle={false} // Important for custom styles on Android
                                Icon={() => (
                                    <Ionicons
                                        name="chevron-down" // Name of the icon
                                        size={24}
                                        color="gray"
                                        style={{ marginTop: 10 }}
                                    />
                                )}
                                placeholder={{ label: 'Select No of Sisters', value: null }}
                                style={pickerSelectStyles}
                            />
                            {validationErrors.selectedValue && <Text style={styles.error}>{validationErrors.selectedValue}</Text>}
                        </View>

                        {/* Number of Sisters Married */}
                        {selectedValue !== null && parseInt(selectedValue) >= 1 && (
                            <View style={styles.formGroup}>
                                <Text style={styles.labelNew}>Number of Sisters Married</Text>
                                <RNPickerSelect
                                    onValueChange={handleSecondDropdownChange}
                                    items={getSistersMarriedOptions(selectedValue)}
                                    value={selectedSistersMarried}
                                    useNativeAndroidPickerStyle={false} // Important for custom styles on Android
                                    Icon={() => (
                                        <Ionicons
                                            name="chevron-down" // Name of the icon
                                            size={24}
                                            color="gray"
                                            style={{ marginTop: 10 }}
                                        />
                                    )}
                                    placeholder={{ label: 'Select No of Sisters Married', value: null }}
                                    style={pickerSelectStyles}
                                />
                                {validationErrors.selectedSistersMarried && (
                                    <Text style={styles.error}>{validationErrors.selectedSistersMarried}</Text>
                                )}
                            </View>
                        )}

                        {/* Number of Brothers */}
                        <View style={styles.formGroup}>
                            <Text style={styles.labelNew}>Number of Brothers</Text>
                            <RNPickerSelect
                                onValueChange={(value) => {
                                    setSelectedValueBro(value);
                                    if (value !== null) {
                                        setValidationErrors((prevErrors) => ({
                                            ...prevErrors,
                                            SelectedValueBro: '',
                                        }));
                                    }
                                }}
                                items={[
                                    { label: '0', value: "0" },
                                    { label: '1', value: "1" },
                                    { label: '2', value: "2" },
                                    { label: '3', value: "3" },
                                    { label: '4', value: "4" },
                                    { label: '5+', value: "5+" },
                                ]}
                                value={SelectedValueBro}
                                useNativeAndroidPickerStyle={false} // Important for custom styles on Android
                                Icon={() => (
                                    <Ionicons
                                        name="chevron-down" // Name of the icon
                                        size={24}
                                        color="gray"
                                        style={{ marginTop: 10 }}
                                    />
                                )}
                                placeholder={{ label: 'Select No of Brothers', value: null }}
                                style={pickerSelectStyles}
                            />
                            {validationErrors.SelectedValueBro && <Text style={styles.error}>{validationErrors.SelectedValueBro}</Text>}
                        </View>

                        {/* Number of Brothers Married */}
                        {SelectedValueBro !== null && parseInt(SelectedValueBro) >= 1 && (
                            <View style={styles.formGroup}>
                                <Text style={styles.labelNew}>Number of Brothers Married</Text>
                                <RNPickerSelect
                                    onValueChange={handleThirdDropdownChange}
                                    items={getBrothersMarriedOptions(SelectedValueBro)}
                                    value={selectedBrothersMarried}
                                    useNativeAndroidPickerStyle={false} // Important for custom styles on Android
                                    Icon={() => (
                                        <Ionicons
                                            name="chevron-down" // Name of the icon
                                            size={24}
                                            color="gray"
                                            style={{ marginTop: 10 }}
                                        />
                                    )}
                                    placeholder={{ label: 'Select No of Brothers Married', value: null }}
                                    style={pickerSelectStyles}
                                />
                                {validationErrors.selectedBrothersMarried && (
                                    <Text style={styles.error}>{validationErrors.selectedBrothersMarried}</Text>
                                )}
                            </View>
                        )}

                        {/* Property Details */}
                        <View style={styles.formGroup}>
                            <Text style={styles.labelNew}>Property Details</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Property Details"
                                value={formValues.personal_prope_det}
                                useNativeAndroidPickerStyle={false} // Important for custom styles on Android
                                Icon={() => (
                                    <Ionicons
                                        name="chevron-down" // Name of the icon
                                        size={24}
                                        color="gray"
                                        style={{ marginTop: 10 }}
                                    />
                                )}
                                onChangeText={(text) => handleChange('personal_prope_det', text)}
                            />
                            {validationErrors.personal_prope_det && <Text style={styles.error}>{validationErrors.personal_prope_det}</Text>}
                        </View>

                        {['2', '3', '5'].includes(martialStatus) && (
                            <View style={styles.formGroup}>
                                <Text style={styles.labelNew}>No. of Children</Text>
                                <RNPickerSelect
                                    onValueChange={(value) => setNoOfChildren(value)}
                                    items={[
                                        { label: '0', value: '0' },
                                        { label: '1', value: '1' },
                                        { label: '2', value: '2' },
                                        { label: '3', value: '3' },
                                        { label: '4', value: '4' },
                                        { label: '5', value: '5' },
                                    ]}
                                    value={noOfChildren}
                                    useNativeAndroidPickerStyle={false}
                                    Icon={() => (
                                        <Ionicons
                                            name="chevron-down"
                                            size={24}
                                            color="gray"
                                            style={{ marginTop: 10 }}
                                        />
                                    )}
                                    placeholder={{ label: 'Select No. of Children', value: null }}
                                    style={pickerSelectStyles}
                                />
                                {validationErrors.noOfChildren && <Text style={styles.error}>{validationErrors.noOfChildren}</Text>}
                            </View>
                        )}
                        <View style={styles.formGroup}>
                            <Text style={styles.labelNew}>Father Alive</Text>
                            <RNPickerSelect
                                onValueChange={(value) => handleChange('father_alive', value)}
                                items={[
                                    { label: 'Yes', value: 'yes' },
                                    { label: 'No', value: 'no' },
                                ]}
                                value={formValues.father_alive}
                                useNativeAndroidPickerStyle={false}
                                Icon={() => (
                                    <Ionicons
                                        name="chevron-down"
                                        size={24}
                                        color="gray"
                                        style={{ marginTop: 10 }}
                                    />
                                )}
                                placeholder={{ label: "Is father alive?", value: null }}
                                style={pickerSelectStyles}
                            />
                            {validationErrors.personal_father_alive && <Text style={styles.error}>{validationErrors.personal_father_alive}</Text>}
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.labelNew}>Mother Alive</Text>
                            <RNPickerSelect
                                onValueChange={(value) => handleChange('mother_alive', value)}
                                items={[
                                    { label: 'Yes', value: 'yes' },
                                    { label: 'No', value: 'no' },
                                ]}
                                value={formValues.mother_alive}
                                useNativeAndroidPickerStyle={false}
                                Icon={() => (
                                    <Ionicons
                                        name="chevron-down"
                                        size={24}
                                        color="gray"
                                        style={{ marginTop: 10 }}
                                    />
                                )}
                                placeholder={{ label: "Is mother alive?", value: null }}
                                style={pickerSelectStyles}
                            />
                            {validationErrors.personal_mother_alive && <Text style={styles.error}>{validationErrors.personal_mother_alive}</Text>}
                        </View>

                        {/* Save Button */}
                        {/* <Button title="Save" onPress={handleSave} /> */}
                        <View style={[styles.formContainer1, { marginTop: 25 }]}>
                            <TouchableOpacity
                                style={styles.btn}
                                onPress={handleSave}
                            >
                                <LinearGradient
                                    colors={["#BD1225", "#FF4050"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    useAngle={true}
                                    angle={92.08}
                                    angleCenter={{ x: 0.5, y: 0.5 }}
                                    style={styles.linearGradient}
                                >
                                    <View style={styles.loginContainer}>
                                        <Text style={styles.login}>{submitting ? 'Saving...' : 'Save'}</Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>


                ) : (

                    <View style={styles.editOptions}>
                        {/* View Mode */}
                        {familyDetails && (
                            <>
                                <Text style={styles.labelNew}>About My Family : <Text style={styles.valueNew}>{familyDetails.personal_about_fam}</Text></Text>
                                <Text style={styles.labelNew}>Father Name : <Text style={styles.valueNew}>{familyDetails.personal_father_name}</Text></Text>
                                <Text style={styles.labelNew}>Father's Occupation : <Text style={styles.valueNew}>{familyDetails.personal_father_occu_name}</Text></Text>
                                <Text style={styles.labelNew}>Mother Name : <Text style={styles.valueNew}>{familyDetails.personal_mother_name}</Text></Text>
                                <Text style={styles.labelNew}>Mother's Occupation : <Text style={styles.valueNew}>{familyDetails.personal_mother_occu_name}</Text></Text>
                                <Text style={styles.labelNew}>Family Status : <Text style={styles.valueNew}>{familyDetails.personal_fam_sta_name}</Text></Text>
                                <Text style={styles.labelNew}>Sisters : <Text style={styles.valueNew}>{familyDetails.personal_sis}</Text></Text>
                                <Text style={styles.labelNew}>Sisters Married : <Text style={styles.valueNew}>{familyDetails.personal_sis_married}</Text></Text>
                                <Text style={styles.labelNew}>Brothers : <Text style={styles.valueNew}>{familyDetails.personal_bro}</Text></Text>
                                <Text style={styles.labelNew}>Brothers Married : <Text style={styles.valueNew}>{familyDetails.personal_bro_married}</Text></Text>
                                <Text style={styles.labelNew}>Property Details : <Text style={styles.valueNew}>{familyDetails.personal_prope_det}</Text></Text>
                                <Text style={styles.labelNew}>Father Alive : <Text style={styles.valueNew}>{familyDetails.father_alive}</Text></Text>
                                <Text style={styles.labelNew}>Mother Alive : <Text style={styles.valueNew}>{familyDetails.mother_alive}</Text></Text>
                                {(martialStatus === "2" || martialStatus === "3" || martialStatus === "5") && (
                                    <Text style={styles.labelNew}>
                                        No of Children : <Text style={styles.valueNew}>{familyDetails.personal_no_of_children}</Text>
                                    </Text>
                                )}
                            </>
                        )}
                    </View>
                )}
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

    detailsMenu: {
        width: "100%",
        backgroundColor: "#4F515D",
        paddingHorizontal: 10,
        paddingVertical: 20,
        // paddingTop: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "center",
        borderBottomWidth: 0.5,
        borderColor: "#fff",
    },

    menuName: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "500",
        fontFamily: "inter",
        marginLeft: 5,
    },

    iconMenuFlex: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        // width: "100%",
    },

    redText: {
        color: "#ED1E24",
        fontSize: 14,
        fontWeight: "700",
        fontFamily: "inter",
        marginVertical: 15,
        alignSelf: "flex-start",
        paddingHorizontal: 10,
    },

    editOptions: {
        width: '90%',
        backgroundColor: '#ffffff',
        padding: 10,
        borderRadius: 8,
        marginBottom: 2,
        marginTop: 10
    },

    menuContainer: {
        width: "100%",
        overflow: 'hidden', // Ensure content doesn't overflow
    },

    label: {
        color: "#535665",
        fontSize: 14,
        fontWeight: "700",
        fontFamily: "inter",
        marginBottom: 10,
    },

    value: {
        color: "#535665",
        fontSize: 14,
        fontWeight: "500",
        fontFamily: "inter",
    },
    input: {
        height: 50, // Increase height
        borderWidth: 1,
        borderColor: '#ccc', // Light gray border
        borderRadius: 5, // Rounded corners
        paddingHorizontal: 10, // Horizontal padding
        marginBottom: 15, // Space between inputs
        fontSize: 16, // Increase font size for better readability
    },
    pickerSelect: {
        inputIOS: {
            height: 50, // Increase height
            borderWidth: 1,
            borderColor: '#ccc', // Light gray border
            borderRadius: 5, // Rounded corners
            paddingHorizontal: 10, // Horizontal padding
            marginBottom: 15, // Space between inputs
            fontSize: 16, // Increase font size for better readability
        },
        inputAndroid: {
            height: 50, // Increase height
            borderWidth: 1,
            borderColor: '#ccc', // Light gray border
            borderRadius: 5, // Rounded corners
            paddingHorizontal: 10, // Horizontal padding
            marginBottom: 15, // Space between inputs
            fontSize: 16, // Increase font size for better readability
        },
    },
    label: {
        marginBottom: 5, // Space between label and input
        fontSize: 16, // Font size for labels
    },
    container: {
        marginBottom: 15, // Space between container elements
    },
    loginContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    login: {
        textAlign: "center",
        color: "white",
        fontWeight: "600",
        fontSize: 16,
        letterSpacing: 1,
        fontFamily: "inter",
        marginRight: 5,
    },
    formContainer1: {
        width: "100%",
        paddingHorizontal: 20,
    },

    linearGradient: {
        borderRadius: 5,
        justifyContent: "center",
        padding: 15,
    },
    btn: {
        width: "100%",
        alignSelf: "center",
        borderRadius: 6,
        marginBottom: 30,
    },
    menuChanges: {
        width: '100%',
        backgroundColor: '#4F515D',
        justifyContent: 'center',
        alignItems: 'center'
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
        alignSelf: 'flex-start',
        fontWeight: 'bold',
    },
    labelNew: {
        color: '#282C3F',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: 7
    },
    valueNew: {
        color: '#282C3F',
        fontSize: 15,
        fontWeight: '500',
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});