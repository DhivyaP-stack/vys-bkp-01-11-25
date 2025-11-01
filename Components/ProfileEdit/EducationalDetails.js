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
import { getMyEducationalDetails, updateProfileEducation } from '../../CommonApiCall/CommonApiCall'; // Import the API function
import RNPickerSelect from 'react-native-picker-select';
import config from "../../API/Apiurl";
import axios from "axios";
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';

export const EducationalDetails = () => {

    const [educationalDetails, setEducationalDetails] = useState(null); // State for profile details
    const [isEditMode, setIsEditMode] = useState(false); // Toggle between view and edit mode
    const [validationErrors, setValidationErrors] = useState({});
    const [highestEduOptions, setHighestEduOptions] = useState([]); // State for education options
    const [annualIncomeOptions, setAnnualIncomeOptions] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [professionOptions, setProfessionalPreferences] = useState([]);
    const [isFetched, setIsFetched] = useState(false);






    const fetchAnnualIncomeOptions = async () => {
        try {
            const response = await axios.post(`${config.apiUrl}/auth/Get_Annual_Income/`);
            const annualIncomeArray = Object.keys(response.data).map(key => ({
                label: response.data[key].income_description,
                value: response.data[key].income_id.toString(),
            }));
            setAnnualIncomeOptions(annualIncomeArray);
        } catch (error) {
            console.error("Error fetching Annual Income:", error);
        }
    };


    const fetchCountryList = async () => {
        try {
            const response = await axios.post(`${config.apiUrl}/auth/Get_Country/`);
            const countryData = response.data;

            // Assuming countryData is an object with country_id as keys
            const formattedCountryList = Object.keys(countryData).map((key) => ({
                label: countryData[key].country_name,
                value: countryData[key].country_id.toString(),
            }));

            setCountryList(formattedCountryList);
        } catch (error) {
            console.error("Error fetching country list:", error);
        }
    };

    useEffect(() => {
        fetchCountryList(); // Call function to fetch country list
        fetchAnnualIncomeOptions(); // Call the function on component mount
    }, []);


    useEffect(() => {
        // Fetch highest education options from API
        const fetchHighestEducation = async () => {
            try {
                const response = await axios.post(`${config.apiUrl}/auth/Get_Highest_Education/`);
                const highestEduArray = Object.keys(response.data).map(key => ({
                    label: response.data[key].education_description,
                    value: response.data[key].education_id.toString(),
                }));
                setHighestEduOptions(highestEduArray);
            } catch (error) {
                console.error("Error fetching highest education:", error);
            }
        };
        fetchHighestEducation();
    }, []);


    const fetchStateList = async (countryId) => {
        try {
            const response = await axios.post(`${config.apiUrl}/auth/Get_State/`, {
                country_id: countryId,
            });
            const stateData = response.data;

            const formattedStateList = Object.keys(stateData).map((key) => ({
                label: stateData[key].state_name,
                value: stateData[key].state_id.toString(),
            }));

            setStateList(formattedStateList);
        } catch (error) {
            console.error("Error fetching state list:", error);
        }
    };

    useEffect(() => {

        const fetchProfessionalPreferences = async () => {
            try {
                const response = await axios.post(`${config.apiUrl}/auth/Get_Profes_Pref/`);

                // Map the response data into an array of objects with `label` and `value`
                const professionalPreferencesArray = Object.keys(response.data).map(key => ({
                    label: response.data[key].Profes_name,  // Professional name (label for dropdown)
                    value: response.data[key].Profes_Pref_id.toString(),  // Professional ID (value for dropdown)
                }));

                // Update your state or handle the data as needed
                setProfessionalPreferences(professionalPreferencesArray);  // Assuming you have a state setter
            } catch (error) {
                console.error("Error fetching Professional Preferences:", error);
            }
        };
        fetchProfessionalPreferences();
    }, []);


    const [formValues, setFormValues] = useState({
        personal_edu_name: '',
        personal_about_edu: '',
        personal_profession_name: '',
        personal_ann_inc_name: '',
        personal_gross_ann_inc: '',
        personal_work_coun_name: '',
        personal_work_sta_name: '',
        personal_work_pin: '',
        personal_career_plans: '',
        personal_work_place: '',
        personal_edu_id: null,
        personal_profession: null,
        personal_ann_inc_id: null,
        personal_work_sta_id: null,
        personal_work_coun_id: null,
        personal_company_name: '',
        personal_designation: '',
        personal_profess_details: '',
        personal_business_name: '',
        personal_business_addresss: '',
        personal_nature_of_business: '',
    });

    // Function to fetch profile data
    const fetchProfileData = async () => {
        try {
            const data = await getMyEducationalDetails();
            console.log("data educational details ===>", data);
            setEducationalDetails(data.data); // Set the data in the state
        } catch (error) {
            console.error('Failed to load profile data', error);
        }
    };


    useEffect(() => {
        fetchProfileData(); // Call the function when component mounts
    }, []);



    useEffect(() => {
        // Update form values when personalDetails is fetched
        if (educationalDetails && !isFetched) {
            setFormValues({
                personal_edu_name: educationalDetails.personal_edu_name || '',
                personal_about_edu: educationalDetails.personal_about_edu || '',
                personal_profession_name: educationalDetails.personal_profession_name || '',
                personal_ann_inc_name: educationalDetails.personal_ann_inc_name || '',
                personal_gross_ann_inc: educationalDetails.personal_gross_ann_inc || '',
                personal_work_coun_name: educationalDetails.personal_work_coun_name || '',
                personal_work_sta_name: educationalDetails.personal_work_sta_name || '',
                personal_work_pin: educationalDetails.personal_work_pin || '',
                personal_career_plans: educationalDetails.personal_career_plans || '',
                personal_work_place: educationalDetails.personal_work_place || '',
                personal_edu_id: educationalDetails.personal_edu_id || null,
                personal_profession: educationalDetails.personal_profession || null,
                personal_ann_inc_id: educationalDetails.personal_ann_inc_id || null,
                personal_work_sta_id: educationalDetails.personal_work_sta_id || null,
                personal_work_coun_id: educationalDetails.personal_work_coun_id || null,
                personal_company_name: educationalDetails.personal_company_name || '',
                personal_designation: educationalDetails.personal_designation || '',
                personal_profess_details: educationalDetails.personal_profess_details || '',
                personal_business_name: educationalDetails.personal_business_name || '',
                personal_business_addresss: educationalDetails.personal_business_addresss || '',
                personal_nature_of_business: educationalDetails.personal_nature_of_business || '',
            });

            // Fetch state list if country ID exists
            if (educationalDetails.personal_work_coun_id) {
                fetchStateList(educationalDetails.personal_work_coun_id);
            }

            setIsFetched(true);  // Mark as fetched to prevent further updates
        }
    }, [educationalDetails, isFetched]);


    // Personal Menu





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

            // If changing country, reset state selection
            const updates = {
                ...prevValues,
                [field]: updatedValue,
            };

            if (field === 'personal_work_coun_id') {
                updates.personal_work_sta_id = null; // Reset state when country changes
            }

            return updates;
        });

        // Fetch states if country is selected
        if (field === 'personal_work_coun_id' && value) {
            fetchStateList(value);
        }

        // Clear the error message for the field
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [field]: '',
        }));
    };

    const validateForm = () => {
        const errors = {};
        let hasErrors = false;

        // Helper function to validate and set error
        const validateField = (value, fieldName, errorMessage) => {
            if (!value || value.trim() === '') {
                errors[fieldName] = errorMessage;
                hasErrors = true;
                return false;
            }
            return true;
        };

        // Validate required fields that are sent to the API
        validateField(formValues.personal_edu_id, 'personal_edu_id', 'Education Level is required');
        validateField(formValues.personal_about_edu, 'personal_about_edu', 'About Education is required');
        validateField(formValues.personal_profession, 'personal_profession', 'Profession is required');
        validateField(formValues.personal_ann_inc_id, 'personal_ann_inc_id', 'Annual Income is required');
        validateField(formValues.personal_gross_ann_inc, 'personal_gross_ann_inc', 'Gross Annual Income is required');
        validateField(formValues.personal_work_coun_id, 'personal_work_coun_id', 'Work Country is required');
        validateField(formValues.personal_work_sta_id, 'personal_work_sta_id', 'Work State is required');
        validateField(formValues.personal_work_pin, 'personal_work_pin', 'Work Pin Code is required');
        validateField(formValues.personal_career_plans, 'personal_career_plans', 'Career Plans is required');
        validateField(formValues.personal_work_place, 'personal_work_place', 'Work Place is required');

        // Additional validations for specific professions
        if (formValues.personal_profession === "1" ||
            formValues.personal_profession === "7" ||
            formValues.personal_profession === "6") {
            validateField(formValues.personal_company_name, 'personalypr_company_name', 'Company Name is required');
            validateField(formValues.personal_designation, 'personal_designation', 'Designation is required');
            validateField(formValues.personal_profess_details, 'personal_profess_details', 'Profession Details is required');
        }

        if (formValues.personal_profession === "6" ||
            formValues.personal_profession === "2") {
            validateField(formValues.personal_business_name, 'personal_business_name', 'Business Name is required');
            validateField(formValues.personal_business_addresss, 'personal_business_addresss', 'Business Address is required');
            validateField(formValues.personal_nature_of_business, 'personal_nature_of_business', 'Nature of Business is required');
        }

        setValidationErrors(errors);
        return !hasErrors;
    };

    const handleSave = async () => {
        try {
            console.log('Form Values:', formValues);

            // First validate the form
            const isValid = validateForm();
            if (!isValid) {
                // Show validation errors using Toast
                const errorMessages = Object.values(validationErrors).join('\n');
                Toast.show({
                    type: 'error',
                    text1: 'Validation Error',
                    text2: errorMessages,
                    visibilityTime: 4000,
                    autoHide: true,
                });
                return;
            }

            // If validation passes, prepare the data
            const profileData = {
                education_level: formValues.personal_edu_id,
                about_edu: formValues.personal_about_edu?.trim(),
                profession: formValues.personal_profession,
                annual_income: formValues.personal_ann_inc_id,
                actual_income: formValues.personal_gross_ann_inc?.trim(),
                work_country: formValues.personal_work_coun_id,
                work_state: formValues.personal_work_sta_id,
                work_pincode: formValues.personal_work_pin?.trim(),
                career_plans: formValues.personal_career_plans?.trim(),
                work_place: formValues.personal_work_place?.trim(),
                company_name: formValues.personal_company_name?.trim() || '',
                designation: formValues.personal_designation?.trim() || '',
                profession_details: formValues.personal_profess_details?.trim() || '',
                business_name: formValues.personal_business_name?.trim() || '',
                business_address: formValues.personal_business_addresss?.trim() || '',
                nature_of_business: formValues.personal_nature_of_business?.trim() || ''
            };

            // Make the API call
            const response = await updateProfileEducation(profileData);
            console.log('API Response:', response);

            if (response && response.status === "success") {
                console.log('Profile updated successfully:', response);
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: response.message || 'Profile updated successfully',
                    visibilityTime: 3000,
                    autoHide: true,
                });
                setIsEditMode(false);
                await fetchProfileData(); // Refresh the data
            } else {
                throw new Error(response?.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message || 'Failed to update profile. Please try again.',
                visibilityTime: 4000,
                autoHide: true,
            });
        }
    };



    return (

        <View style={styles.menuChanges}>
            <View style={styles.editOptions}>
                <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 15 }}>Education & Profession Details</Text>
                <TouchableWithoutFeedback onPress={() => setIsEditMode(!isEditMode)}>
                    <Text style={styles.redText}>{isEditMode ? 'View' : 'Edit'}</Text>
                </TouchableWithoutFeedback>
                {isEditMode ? (
                    <View style={styles.editOptions}>
                        <Text style={styles.labelNew}>Highest Education</Text>
                        <RNPickerSelect
                            onValueChange={(value) => handleChange('personal_edu_id', value)}
                            items={highestEduOptions}
                            value={formValues.personal_edu_id}
                            useNativeAndroidPickerStyle={false} // Important for custom styles on Android
                            Icon={() => (
                                <Ionicons
                                    name="chevron-down" // Name of the icon
                                    size={24}
                                    color="gray"
                                    style={{ marginTop: 10 }}
                                />
                            )}
                            placeholder={{ label: "Select Education", value: null }}
                            style={pickerSelectStyles}
                        />
                        {validationErrors.personal_edu_name && <Text style={styles.error}>{validationErrors.personal_edu_name}</Text>}

                        <Text style={styles.labelNew}>About Education</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="About Education"
                            value={formValues.personal_about_edu}
                            onChangeText={(text) => handleChange('personal_about_edu', text)}
                        />
                        {validationErrors.personal_about_edu && <Text style={styles.error}>{validationErrors.personal_about_edu}</Text>}

                        <Text style={styles.labelNew}>Profession</Text>
                        <RNPickerSelect
                            onValueChange={(value) => handleChange('personal_profession', value)}
                            items={professionOptions}
                            value={formValues.personal_profession}
                            useNativeAndroidPickerStyle={false} // Important for custom styles on Android
                            Icon={() => (
                                <Ionicons
                                    name="chevron-down" // Name of the icon
                                    size={24}
                                    color="gray"
                                    style={{ marginTop: 10 }}
                                />
                            )}
                            placeholder={{ label: "Select Profession", value: null }}
                            style={pickerSelectStyles}
                        />
                        {validationErrors.personal_profession && <Text style={styles.error}>{validationErrors.personal_profession}</Text>}

                        <Text style={styles.labelNew}>Annual Income</Text>
                        <RNPickerSelect
                            onValueChange={(value) => handleChange('personal_ann_inc_id', value)}
                            items={annualIncomeOptions}
                            value={formValues.personal_ann_inc_id}
                            useNativeAndroidPickerStyle={false} // Important for custom styles on Android
                            Icon={() => (
                                <Ionicons
                                    name="chevron-down" // Name of the icon
                                    size={24}
                                    color="gray"
                                    style={{ marginTop: 10 }}
                                />
                            )}
                            placeholder={{ label: "Select Annual Income", value: null }}
                            style={pickerSelectStyles}
                        />
                        {validationErrors.personal_ann_inc_name && <Text style={styles.error}>{validationErrors.personal_ann_inc_name}</Text>}

                        <Text style={styles.labelNew}>Gross Annual Income</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Gross Income"
                            value={formValues.personal_gross_ann_inc}
                            onChangeText={(text) => handleChange('personal_gross_ann_inc', text)}
                        />
                        {validationErrors.personal_gross_ann_inc && <Text style={styles.error}>{validationErrors.personal_gross_ann_inc}</Text>}

                        <Text style={styles.labelNew}>Country</Text>
                        <RNPickerSelect
                            onValueChange={(value) => handleChange('personal_work_coun_id', value)}
                            items={countryList}
                            value={formValues.personal_work_coun_id}
                            useNativeAndroidPickerStyle={false} // Important for custom styles on Android
                            Icon={() => (
                                <Ionicons
                                    name="chevron-down" // Name of the icon
                                    size={24}
                                    color="gray"
                                    style={{ marginTop: 10 }}
                                />
                            )}
                            placeholder={{ label: "Select Country", value: null }}
                            style={pickerSelectStyles}
                        />
                        {validationErrors.personal_work_coun_name && <Text style={styles.error}>{validationErrors.personal_work_coun_name}</Text>}

                        <Text style={styles.labelNew}>State</Text>
                        <RNPickerSelect
                            onValueChange={(value) => handleChange('personal_work_sta_id', value)}
                            items={stateList}
                            value={formValues.personal_work_sta_id}
                            useNativeAndroidPickerStyle={false} // Important for custom styles on Android
                            Icon={() => (
                                <Ionicons
                                    name="chevron-down" // Name of the icon
                                    size={24}
                                    color="gray"
                                    style={{ marginTop: 10 }}
                                />
                            )}
                            placeholder={{ label: "Select State", value: null }}
                            style={pickerSelectStyles}
                        />
                        {validationErrors.personal_work_sta_name && <Text style={styles.error}>{validationErrors.personal_work_sta_name}</Text>}

                        <Text style={styles.labelNew}>Work Place</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Work Place"
                            value={formValues.personal_work_place}
                            onChangeText={(text) => handleChange('personal_work_place', text)}
                        />
                        {validationErrors.personal_work_place && <Text style={styles.error}>{validationErrors.personal_work_place}</Text>}

                        <Text style={styles.labelNew}>Pincode</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Pincode"
                            value={formValues.personal_work_pin}
                            onChangeText={(text) => handleChange('personal_work_pin', text)}
                        />
                        {validationErrors.personal_work_pin && <Text style={styles.error}>{validationErrors.personal_work_pin}</Text>}

                        <Text style={styles.labelNew}>Career Plan</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Career Plan"
                            value={formValues.personal_career_plans}
                            onChangeText={(text) => handleChange('personal_career_plans', text)}
                        />
                        {validationErrors.personal_career_plans && <Text style={styles.error}>{validationErrors.personal_career_plans}</Text>}

                        {(formValues.personal_profession === "1" ||
                            formValues.personal_profession === "7" ||
                            formValues.personal_profession === "6") && (
                                <>
                                    <Text style={styles.labelNew}>Company Name</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Company Name"
                                        value={formValues.personal_company_name}
                                        onChangeText={(text) => handleChange('personal_company_name', text)}
                                    />
                                    <Text style={styles.labelNew}>Designation</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Designation"
                                        value={formValues.personal_designation}
                                        onChangeText={(text) => handleChange('personal_designation', text)}
                                    />
                                    <Text style={styles.labelNew}>Profession Details</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Profession Details"
                                        value={formValues.personal_profess_details}
                                        onChangeText={(text) => handleChange('personal_profess_details', text)}
                                    />
                                    {validationErrors.personal_profess_details && <Text style={styles.error}>{validationErrors.personal_profess_details}</Text>}
                                </>
                            )}

                        {(formValues.personal_profession === "6" ||
                            formValues.personal_profession === "2") && (
                                <>
                                    <Text style={styles.labelNew}>Business Name</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Business Name"
                                        value={formValues.personal_business_name}
                                        onChangeText={(text) => handleChange('personal_business_name', text)}
                                    />
                                    <Text style={styles.labelNew}>Business Address</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Business Address"
                                        value={formValues.personal_business_addresss}
                                        onChangeText={(text) => handleChange('personal_business_addresss', text)}
                                    />
                                    <Text style={styles.labelNew}>Nature of Business</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Nature of Business"
                                        value={formValues.personal_nature_of_business}
                                        onChangeText={(text) => handleChange('personal_nature_of_business', text)}
                                    />
                                </>
                            )}

                        <View style={styles.formContainer1}>
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
                                        <Text style={styles.login}>Save</Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>


                ) : (

                    <View style={styles.editOptions}>
                        {/* View Mode */}
                        {educationalDetails && (
                            <>

                                <Text style={styles.labelNew}>Education Level : <Text style={styles.valueNew}>{educationalDetails.personal_edu_name}</Text></Text>
                                <Text style={styles.labelNew}>Field of Study : <Text style={styles.valueNew}>{educationalDetails.persoanl_field_ofstudy_name}</Text></Text>
                                <Text style={styles.labelNew}>Specific Field : <Text style={styles.valueNew}>{educationalDetails.persoanl_degree_name}</Text></Text>
                                <Text style={styles.labelNew}>About Education : <Text style={styles.valueNew}>{educationalDetails.personal_about_edu}</Text></Text>
                                <Text style={styles.labelNew}>Profession : <Text style={styles.valueNew}>{educationalDetails.personal_profession_name}</Text></Text>
                                <Text style={styles.labelNew}>Annual Income : <Text style={styles.valueNew}>{educationalDetails.personal_ann_inc_name}</Text></Text>
                                <Text style={styles.labelNew}>Gross Income : <Text style={styles.valueNew}>{educationalDetails.personal_gross_ann_inc}</Text></Text>
                                <Text style={styles.labelNew}>Country : <Text style={styles.valueNew}>{educationalDetails.personal_work_coun_name}</Text></Text>
                                <Text style={styles.labelNew}>State : <Text style={styles.valueNew}>{educationalDetails.personal_work_sta_name}</Text></Text>
                                <Text style={styles.labelNew}>Pincode : <Text style={styles.valueNew}>{educationalDetails.personal_work_pin}</Text></Text>
                                <Text style={styles.labelNew}>Career Plan : <Text style={styles.valueNew}>{educationalDetails.personal_career_plans}</Text></Text>
                                <Text style={styles.labelNew}>Currency : <Text style={styles.valueNew}>{educationalDetails.personal_incom_currency}</Text></Text>
                                <Text style={styles.labelNew}>Company Name : <Text style={styles.valueNew}>{educationalDetails.personal_company_name}</Text></Text>
                                <Text style={styles.labelNew}>Designation : <Text style={styles.valueNew}>{educationalDetails.personal_designation}</Text></Text>
                                <Text style={styles.labelNew}>Profession : <Text style={styles.valueNew}>{educationalDetails.personal_profess_details}</Text></Text>
                                <Text style={styles.labelNew}>Business Name : <Text style={styles.valueNew}>{educationalDetails.personal_business_name}</Text></Text>
                                <Text style={styles.labelNew}>Business Address : <Text style={styles.valueNew}>{educationalDetails.personal_business_addresss}</Text></Text>
                                <Text style={styles.labelNew}>Nature of Business : <Text style={styles.valueNew}>{educationalDetails.personal_nature_of_business}</Text></Text>
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
    labelNew: {
        color: '#282C3F',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: 7
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
        alignSelf: 'flex-start',
        fontWeight: 'bold',
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