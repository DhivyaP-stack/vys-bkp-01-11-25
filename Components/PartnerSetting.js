import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Pressable,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios"; // Import axios
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../API/Apiurl";
import { updatePartnerPreferences, fetchPartnerProfile } from '../CommonApiCall/CommonApiCall'; // Adjust the path as needed
import Toast from 'react-native-toast-message'; // Import the toast library




// const schema = z.object({
//     ageDifference: z.string().min(1, "Age difference is required"),
//     heightFrom: z.string().min(1, "Height from is required"),
//     heightTo: z.string().min(1, "Height to is required"),
//     chevvai: z.string().min(1, "Chevvai is required"),
//     rehu: z.string().min(1, "Rehu is required"),
//     maritalStatus: z.array(z.string()).min(1, "At least one marital status is required"),
//     education: z.array(z.string()).min(1, "At least one education option is required"),
//     profession: z.array(z.string()).min(1, "At least one profession option is required"),
//     annualIncome: z.array(z.string()).min(1, "At least one income option is required"),
//     foreignInterest: z.string().min(1, "Foreign interest is required"),

// });

const schema = z.object({
    ageDifference: z.string().optional(),
    heightFrom: z.string().optional(),
    heightTo: z.string().min(1, "Height To is required"),
    chevvai: z.string().min(1, "Chevvai selection is required"),
    rehu: z.string().min(1, "Rehu selection is required"),
    maritalStatus: z.array(z.string()).min(1, "Please select at least one marital status"),
    education: z.array(z.string()).min(1, "Please select at least one education option"),
    profession: z.array(z.string()).min(1, "Please select at least one profession"),
    annualIncomeMin: z.string().optional(),
    annualIncomeMax: z.string().optional(),
    foreignInterest: z.string().optional(),
});


const age = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: '10', value: '10' }

    // Add more options as needed
];

const foreignInterest = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
    { label: 'both', value: 'both' },
    // Add more options as needed
];

// Add this array at the top (if you want to easily add more professions later)

export const PartnerSettings = () => {
    const navigation = useNavigation();
    const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            ageDifference: '',
            heightFrom: '',
            heightTo: '',
            maritalStatus: [],
            education: [],
            profession: [],
            annualIncomeMin: '',
            annualIncomeMax: '',
            nativeState: [],
            foreignInterest: '',
            chevvai: '',
            rehu: '',
            workLocation: '',
        },
    });
    const maritalStatusSelected = watch("maritalStatus") || [];
    const [maritalStatusOptions, setMaritalStatusOptions] = useState([]);
    const [highestEduOptions, setHighestEduOptions] = useState([]);
    const [annualIncomeOptions, setAnnualIncomeOptions] = useState([]);
    const [professionOptions, setProfessionOptions] = useState([]);

    const [selectedIncomeMinIds, setSelectedIncomeMinIds] = useState(''); // Store selected IDs as a string
    const [selectedIncomeMaxIds, setSelectedIncomeMaxIds] = useState('');

    useEffect(() => {
        fetchMaritalStatus();
        fetchProfessionOptions();
        fetchHighestEdu();
        fetchAnnualIncome();
        // fetchMatchList();
        //fetchMatchStars();
    }, []);

    const fetchMaritalStatus = async () => {
        try {
            const response = await axios.post(`${config.apiUrl}/auth/Get_Marital_Status/`);
            const maritalStatusArray = Object.keys(response.data).map(key => ({
                label: response.data[key].marital_sts_name,
                value: response.data[key].marital_sts_id.toString(),
            }));
            setMaritalStatusOptions(maritalStatusArray);
        } catch (error) {
            console.error("Error fetching marital status:", error);
        }
    };


    const fetchHighestEdu = async () => {
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


    const fetchAnnualIncome = async () => {
        try {
            const response = await axios.post(`${config.apiUrl}/auth/Get_Annual_Income/`);
            const annualIncomeArray = Object.keys(response.data).map(key => ({
                label: response.data[key].income_description,
                value: response.data[key].income_id.toString(),
            }));
            console.log("Annual Income:", annualIncomeArray);
            setAnnualIncomeOptions(annualIncomeArray);
        } catch (error) {
            console.error("Error fetching UG Degree:", error);
        }
    };

    const fetchProfessionOptions = async () => {
        try {
            const response = await axios.post(`${config.apiUrl}/auth/Get_Profes_Pref/`);
            const professionsArray = Object.keys(response.data).map(key => ({
                label: response.data[key].Profes_name,
                value: response.data[key].Profes_Pref_id.toString(),
            }));
            setProfessionOptions(professionsArray);
        } catch (error) {
            console.error("Error fetching profession options:", error);
        }
    };


    const onSubmit = async (data) => {
        try {
            // Combine income min and max into a comma-separated string
            const incomeValues = [];
            if (data.annualIncomeMin) incomeValues.push(data.annualIncomeMin);
            if (data.annualIncomeMax) incomeValues.push(data.annualIncomeMax);

            const formattedData = {
                pref_age_differences: data.ageDifference || '',
                pref_height_from: data.heightFrom || '',
                pref_height_to: data.heightTo || '',
                pref_marital_status1: data.maritalStatus ? data.maritalStatus.join(',') : '',
                pref_profession1: data.profession ? data.profession.join(',') : '',
                pref_education1: data.education ? data.education.join(',') : '',
                pref_anual_income1: [data.annualIncomeMin, data.annualIncomeMax].filter(Boolean).join(','),
                pref_chevvai: data.chevvai || '',
                pref_ragukethu: data.rehu || '',
                pref_foreign_intrest: data.foreignInterest || '',
            };

            console.log("Post Data:", formattedData);

            const result = await updatePartnerPreferences(formattedData);
            console.log("Registration response:", result);

            if (result.data.status === "success") {
                Toast.show({
                    type: 'success',
                    position: 'bottom',
                    text1: 'Successfully updated',
                    text2: 'Your partner preferences have been updated successfully.',
                });
            } else {
                Toast.show({
                    type: 'error',
                    position: 'bottom',
                    text1: 'Unsuccessful',
                    text2: 'There was a problem updating your preferences. Please try again.',
                });
            }
        } catch (error) {
            console.error("Error submitting contact details:", error);
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Error',
                text2: 'An error occurred while submitting your details.',
            });
        }
    };



    useEffect(() => {

        const fetchProfileData = async () => {
            try {
                const partnerProfileData = await fetchPartnerProfile();

                // Set the form values using the data returned from the API
                setValue('ageDifference', partnerProfileData.fromAge);
                setValue('heightFrom', partnerProfileData.fromHeight);
                setValue('heightTo', partnerProfileData.toHeight);
                setValue('education', partnerProfileData.education);
                setValue('maritalStatus', partnerProfileData.maritalStatus);
                setValue('profession', partnerProfileData.profession);
                setValue('rehu', partnerProfileData.rahuKetuDhosam);
                setValue('chevvai', partnerProfileData.chevvaiDhosam);
                setValue('foreignInterest', partnerProfileData.foreignInterest);

                // Handle annual income min and max with proper null checks
                if (partnerProfileData.income !== undefined && partnerProfileData.income !== null) {
                    const incomeData = String(partnerProfileData.income);
                    if (incomeData.length > 0) {
                        const incomeArray = incomeData.split(',');
                        if (incomeArray.length >= 2) {
                            setValue('annualIncomeMin', incomeArray[0]);
                            setValue('annualIncomeMax', incomeArray[1]);
                            setSelectedIncomeMinIds(incomeArray[0]);
                            setSelectedIncomeMaxIds(incomeArray[1]);
                        } else if (incomeArray.length === 1) {
                            setValue('annualIncomeMin', incomeArray[0]);
                            setSelectedIncomeMinIds(incomeArray[0]);
                        }
                    }
                }
            } catch (error) {
                console.error('Error setting form values:', error);
            }
        };

        fetchProfileData();
    }, [setValue]);


    return (
        <SafeAreaView style={styles.container}>
            {/* <Text style={styles.partnerHead}>Partner Preference</Text> */}
            {/* <Text style={styles.search}>Advanced Search</Text> */}

            {/* Age */}
            <View style={styles.searchContainer}>
                <Text style={styles.redText}>Age Difference</Text>
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Controller
                            control={control}
                            name="ageDifference"
                            render={({ field: { onChange, value } }) => (
                                <Dropdown
                                    style={styles.dropdown}
                                    data={age}
                                    maxHeight={180}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Age Difference"
                                    value={value}
                                    onChange={(item) => {
                                        onChange(item.value);
                                    }}
                                />
                            )}
                        />
                    </View>
                    {/* {errors.ageDifference && <Text style={styles.errorText}>{errors.ageDifference.message}</Text>} */}
                </View>
            </View>

            {/* Height */}
            <View style={styles.searchContainer}>
                <Text style={styles.redText}>Height</Text>
                <View style={styles.formContainer}>
                    <View style={styles.inputFlexContainer}>
                        {/* Height From */}
                        <Controller
                            control={control}
                            name="heightFrom"
                            rules={{ required: 'Height from is required' }}
                            render={({ field: { onChange, value } }) => (
                                <View style={styles.inputFlexFirst}>
                                    <TextInput
                                        placeholder="From"
                                        keyboardType="numeric"
                                        value={value}
                                        onChangeText={onChange}
                                    />
                                    {/* {errors.heightFrom && (
                                        <Text style={styles.errorText}>{errors.heightFrom.message}</Text>
                                    )} */}
                                </View>
                            )}
                        />

                        {/* Height To */}
                        <Controller
                            control={control}
                            name="heightTo"
                            rules={{ required: 'Height to is required' }}
                            render={({ field: { onChange, value } }) => (
                                <View style={styles.inputFlex}>
                                    <TextInput
                                        placeholder="To"
                                        keyboardType="numeric"
                                        value={value}
                                        onChangeText={onChange}
                                    />
                                    {errors.heightTo && (
                                        <Text style={styles.errorText}>{errors.heightTo.message}</Text>
                                    )}
                                </View>
                            )}
                        />
                    </View>
                </View>
            </View>

            {/* Marital Status */}
            <View style={styles.checkContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <Pressable
                        style={[
                            styles.checkboxBase,
                            maritalStatusSelected?.length === maritalStatusOptions.length && maritalStatusOptions.length > 0 && styles.checkboxChecked,
                        ]}
                        onPress={() => {
                            const allValues = maritalStatusOptions.map(opt => opt.value);
                            if (maritalStatusSelected?.length === maritalStatusOptions.length) {
                                setValue("maritalStatus", []);
                            } else {
                                setValue("maritalStatus", allValues);
                            }
                        }}
                    >
                        {maritalStatusSelected?.length === maritalStatusOptions.length && maritalStatusOptions.length > 0 && (
                            <Ionicons name="checkmark" size={14} color="white" />
                        )}
                    </Pressable>

                    <Pressable
                        onPress={() => {
                            const allValues = maritalStatusOptions.map(opt => opt.value);
                            if (maritalStatusSelected?.length === maritalStatusOptions.length) {
                                setValue("maritalStatus", []);
                            } else {
                                setValue("maritalStatus", allValues);
                            }
                        }}
                    >
                        <Text style={styles.checkRedText}>Marital Status</Text>
                    </Pressable>
                </View>
                <Controller
                    control={control}
                    name="maritalStatus"
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.checkboxDivColFlex}>
                            {maritalStatusOptions.map((status) => (
                                <View key={status.value} style={styles.checkboxContainer}>
                                    <Pressable
                                        style={[
                                            styles.checkboxBase,
                                            value.includes(status.value) && styles.checkboxChecked,
                                        ]}
                                        onPress={() => {
                                            const newValue = value.includes(status.value)
                                                ? value.filter((item) => item !== status.value)
                                                : [...value, status.value];
                                            onChange(newValue);
                                        }}
                                    >
                                        {value.includes(status.value) && (
                                            <Ionicons name="checkmark" size={14} color="white" />
                                        )}
                                    </Pressable>
                                    <Pressable onPress={() => {
                                        const newValue = value.includes(status.value)
                                            ? value.filter((item) => item !== status.value)
                                            : [...value, status.value];
                                        onChange(newValue);
                                    }}>
                                        <Text style={styles.checkboxLabel}>{status.label}</Text>
                                    </Pressable>
                                </View>
                            ))}

                        </View>
                    )}
                />
                {errors.maritalStatus && <Text style={styles.errorTextCheckBox}>{errors.maritalStatus.message}</Text>}
            </View>

            {/* Education */}
            <View style={styles.checkContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <Pressable
                        style={[
                            styles.checkboxBase,
                            (watch("education")?.length === highestEduOptions.length && highestEduOptions.length > 0) && styles.checkboxChecked,
                        ]}
                        onPress={() => {
                            const allValues = highestEduOptions.map(opt => opt.value);
                            if (watch("education")?.length === highestEduOptions.length) {
                                setValue("education", []);
                            } else {
                                setValue("education", allValues);
                            }
                        }}
                    >
                        {(watch("education")?.length === highestEduOptions.length && highestEduOptions.length > 0) && (
                            <Ionicons name="checkmark" size={14} color="white" />
                        )}
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            const allValues = highestEduOptions.map(opt => opt.value);
                            if (watch("education")?.length === highestEduOptions.length) {
                                setValue("education", []);
                            } else {
                                setValue("education", allValues);
                            }
                        }}
                    >
                        <Text style={styles.checkRedText}>Education</Text>
                    </Pressable>
                </View>
                <Controller
                    control={control}
                    name="education"
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.checkboxDivColFlex}>
                            {highestEduOptions.map((education) => (
                                <View key={education.value} style={styles.checkboxContainer}>
                                    <Pressable
                                        style={[
                                            styles.checkboxBase,
                                            value.includes(education.value) && styles.checkboxChecked,
                                        ]}
                                        onPress={() => {
                                            const newValue = value.includes(education.value)
                                                ? value.filter((item) => item !== education.value)
                                                : [...value, education.value];
                                            onChange(newValue);
                                        }}
                                    >
                                        {value.includes(education.value) && (
                                            <Ionicons name="checkmark" size={14} color="white" />
                                        )}
                                    </Pressable>
                                    <Pressable onPress={() => {
                                        const newValue = value.includes(education.value)
                                            ? value.filter((item) => item !== education.value)
                                            : [...value, education.value];
                                        onChange(newValue);
                                    }}>
                                        <Text style={styles.checkboxLabel}>{education.label}</Text>
                                    </Pressable>
                                </View>
                            ))}
                        </View>
                    )}
                />
                {errors.education && <Text style={styles.errorTextCheckBox}>{errors.education.message}</Text>}
            </View>

            {/* Profession */}
            <View style={styles.checkContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <Pressable
                        style={[
                            styles.checkboxBase,
                            (watch("profession")?.length === professionOptions.length && professionOptions.length > 0) && styles.checkboxChecked,
                        ]}
                        onPress={() => {
                            const allValues = professionOptions;
                            if (watch("profession")?.length === professionOptions.length) {
                                setValue("profession", []);
                            } else {
                                setValue("profession", allValues);
                            }
                        }}
                    >
                        {(watch("profession")?.length === professionOptions.length && professionOptions.length > 0) && (
                            <Ionicons name="checkmark" size={14} color="white" />
                        )}
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            const allValues = professionOptions;
                            if (watch("profession")?.length === professionOptions.length) {
                                setValue("profession", []);
                            } else {
                                setValue("profession", allValues);
                            }
                        }}
                    >
                        <Text style={styles.checkRedText}>Profession</Text>
                    </Pressable>
                </View>
                <Controller
                    control={control}
                    name="profession"
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.checkboxDivColFlex}>
                            {professionOptions.map((professionOpt) => (
                                <View key={professionOpt.value} style={styles.checkboxContainer}>
                                    <Pressable
                                        style={[
                                            styles.checkboxBase,
                                            value.includes(professionOpt.value) && styles.checkboxChecked,
                                        ]}
                                        onPress={() => {
                                            const newValue = value.includes(professionOpt.value)
                                                ? value.filter((item) => item !== professionOpt.value)
                                                : [...value, professionOpt.value];
                                            onChange(newValue);
                                        }}
                                    >
                                        {value.includes(professionOpt.value) && (
                                            <Ionicons name="checkmark" size={14} color="white" />
                                        )}
                                    </Pressable>
                                    <Pressable onPress={() => { 
                                        const newValue = value.includes(professionOpt.value)
                                            ? value.filter((item) => item !== professionOpt.value)
                                            : [...value, professionOpt.value];
                                        onChange(newValue);
                                    }}>
                                        <Text style={styles.checkboxLabel}>{professionOpt.label}</Text>
                                    </Pressable>
                                </View>
                            ))}
                        </View>
                    )}
                />
                {errors.profession && <Text style={styles.errorTextCheckBox}>{errors.profession.message}</Text>}
            </View>

            {/* Annual Income */}
            <View style={styles.searchContainer}>
                <Text style={styles.redText}>Annual Income Min</Text>
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Controller
                            control={control}
                            name="annualIncomeMin"
                            render={({ field: { onChange, value } }) => (
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    data={annualIncomeOptions} // Use the incomeOptions array
                                    maxHeight={180}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select min Annual Income"
                                    value={value}
                                    onChange={(item) => {
                                        onChange(item.value);
                                        setSelectedIncomeMinIds(item.value); // Update selectedIncomeIds state
                                    }}
                                />
                            )}
                        />
                    </View>
                </View>


                {/* <Controller
                    control={control}
                    name="annualIncome"
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.checkboxDivColFlex}>
                            {annualIncomeOptions.map((income) => (
                                <View key={income.value} style={styles.checkboxContainer}>
                                    <Pressable
                                        style={[
                                            styles.checkboxBase,
                                            value.includes(income.value) && styles.checkboxChecked,
                                        ]}
                                        onPress={() => {
                                            const newValue = value.includes(income.value)
                                                ? value.filter((item) => item !== income.value)
                                                : [...value, income.value];
                                            onChange(newValue);
                                        }}
                                    >
                                        {value.includes(income.value) && (
                                            <Ionicons name="checkmark" size={14} color="white" />
                                        )}
                                    </Pressable>
                                    <Pressable onPress={() => {
                                        const newValue = value.includes(income.value)
                                            ? value.filter((item) => item !== income.value)
                                            : [...value, income.value];
                                        onChange(newValue);
                                    }}>
                                        <Text style={styles.checkboxLabel}>{income.label}</Text>
                                    </Pressable>
                                </View>
                            ))}
                        </View>
                    )}
                /> */}
                {/* {errors.annualIncome && <Text style={styles.errorTextCheckBox}>{errors.annualIncome.message}</Text>} */}
            </View>

            {/* Annual Income */}
            <View style={styles.searchContainer}>
                <Text style={styles.redText}>Annual Income Max</Text>
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Controller
                            control={control}
                            name="annualIncomeMax"
                            render={({ field: { onChange, value } }) => (
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    data={annualIncomeOptions} // Use the incomeOptions array
                                    maxHeight={180}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select max Annual Income"
                                    value={value}
                                    onChange={(item) => {
                                        onChange(item.value);
                                        setSelectedIncomeMinIds(item.value); // Update selectedIncomeIds state
                                    }}
                                />
                            )}
                        />
                    </View>
                </View>
                {/* {errors.annualIncome && <Text style={styles.errorText}>{errors.annualIncome.message}</Text>} */}
            </View>


            {/* Native State */}





            {/* Chevvai Dropdown */}
            <View style={styles.searchContainer}>
                <Text style={styles.redText}>Chevvai</Text>
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Controller
                            control={control}
                            name="chevvai"
                            render={({ field: { onChange, value } }) => (
                                <Dropdown
                                    style={styles.dropdown}
                                    data={[
                                        { label: "Yes", value: "Yes" },
                                        { label: "No", value: "No" },
                                        { label: "Both", value: "Both" }
                                    ]}
                                    maxHeight={180}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select Chevvai"
                                    value={value}
                                    onChange={(item) => {
                                        onChange(item.value);
                                    }}
                                />
                            )}
                        />
                    </View>
                    {errors.chevvai && <Text style={styles.errorText}>{errors.chevvai.message}</Text>}
                </View>
            </View>

            {/* Rehu Dropdown */}
            <View style={styles.searchContainer}>
                <Text style={styles.redText}>Rehu</Text>
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Controller
                            control={control}
                            name="rehu"
                            render={({ field: { onChange, value } }) => (
                                <Dropdown
                                    style={styles.dropdown}
                                    data={[
                                        { label: "Yes", value: "Yes" },
                                        { label: "No", value: "No" },
                                        { label: "Both", value: "Both" }
                                    ]}
                                    maxHeight={180}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select Rehu"
                                    value={value}
                                    onChange={(item) => {
                                        onChange(item.value);
                                    }}
                                />
                            )}
                        />
                    </View>
                    {errors.rehu && <Text style={styles.errorText}>{errors.rehu.message}</Text>}
                </View>
            </View>

            {/* Foreign Interest */}
            <View style={styles.searchContainer}>
                <Text style={styles.redText}>Foreign Interest</Text>
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>

                        <Controller
                            control={control}
                            name="foreignInterest"
                            render={({ field: { onChange, value } }) => (
                                <Dropdown
                                    style={styles.dropdown}
                                    data={[{ label: 'Yes', value: 'Yes' },
                                    { label: 'No', value: 'No' },
                                    { label: 'Both', value: 'Both' }]}
                                    maxHeight={180}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select your Foreign Interest"
                                    value={value}
                                    onChange={(item) => {
                                        onChange(item.value);
                                    }}
                                />
                            )}
                        />
                    </View>

                    {/* {errors.foreignInterest && <Text style={styles.errorText}>{errors.foreignInterest.message}</Text>} */}
                </View>
            </View>

            {/* Porutham */}


            {/* Work Location */}


            {/* Find Match Button */}
            <View style={styles.formContainer}>
                <TouchableOpacity
                    style={styles.btn}
                    onPress={handleSubmit(onSubmit)}
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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",

    },

    partnerHead: {
        color: "#535665",
        // color: "#4F515D",
        fontFamily: "inter",
        fontSize: 24,
        fontWeight: "700",
        alignSelf: "flex-start",
        paddingHorizontal: 20,
        marginVertical: 10,
    },

    search: {
        fontSize: 16,
        fontWeight: "700",
        fontFamily: "inter",
        // color: "#282C3F",
        color: "#535665",
        alignSelf: "flex-start",
        paddingHorizontal: 20,
        marginVertical: 10,
    },


    inputContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 4,
        borderColor: "#D4D5D9",
    },

    input: {
        flex: 1,
        color: "#535665",
        padding: 10,
        fontFamily: "inter",
    },

    dropdown: {
        width: "100%",
        color: "#535665",
        // borderWidth: 1,
        borderRadius: 4,
        borderColor: "#D4D5D9",
        padding: 10,
        fontFamily: "inter",
    },

    searchIcon: {
        paddingLeft: 10,
    },

    filterIcon: {
        position: "absolute",
        right: 20,
        bottom: 15,
    },

    searchContainer: {
        width: "100%",
        marginBottom: 15,
        textAlign: "left",
    },

    redText: {
        color: "#535665",
        fontSize: 14,
        fontWeight: "700",
        fontFamily: "inter",
        alignSelf: "flex-start",
        paddingHorizontal: 20,
        // marginBottom: 10,
    },

    inputFlexContainer: {
        flexDirection: "row", // Change to row
        justifyContent: "space-between", // Apply space between
        alignItems: "center",
        borderColor: "#D4D5D9",
        fontFamily: "inter",
    },

    inputFlexFirst: {
        flex: 1,
        color: "#535665",
        padding: 10, // Adjust padding
        marginRight: 10, // Adjust margin right
        fontFamily: "inter",
        borderWidth: 1,
        borderRadius: 4,
        borderColor: "#D4D5D9",
    },

    inputFlex: {
        flex: 1,
        color: "#535665",
        padding: 10, // Adjust padding
        fontFamily: "inter",
        borderWidth: 1,
        borderRadius: 4,
        borderColor: "#D4D5D9",
    },

    checkRedText: {
        // color: "#FF6666",
        color: "#535665",
        fontSize: 20,
        fontWeight: "bold",
        fontFamily: "inter",
        alignSelf: "flex-start",
        // paddingHorizontal: 10,
        marginBottom: 10,
        marginTop: 5,
    },

    checkboxDivFlex: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        alignSelf: "flex-start",
        fontFamily: "inter",
        width: "100%",
    },

    checkboxDivColFlex: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        alignSelf: "flex-start",
        fontFamily: "inter",
        width: "100%",
    },

    checkBoxFlex: {
        // flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        alignSelf: "flex-start",
        // borderColor: "#D4D5D9",
        fontFamily: "inter",
    },

    checkContainer: {
        alignSelf: "flex-start",
        paddingHorizontal: 20,
        width: "80%",
    },

    newCheckContainer: {
        alignSelf: "flex-start",
        paddingHorizontal: 20,
        width: "100%",
    },

    checkboxContainer: {
        flexDirection: "row",
        // justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        // paddingHorizontal: 10,
        // textAlign: "left",
        // alignSelf: "center",
    },

    singleCheckboxContainer: {
        flexDirection: "row",
        // justifyContent: "space-between",
        alignItems: "center",
        // marginBottom: 20,
        paddingHorizontal: 20,
        // textAlign: "left",
        // alignSelf: "center",
    },

    dhosamFlex: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        alignSelf: "flex-start",
        // borderColor: "#D4D5D9",
        // fontFamily: "inter",
        width: "80%",
        // justifyContent: "space-between",
        // alignItems: "flex-start",
        // alignSelf: "flex-start",
        // borderColor: "#D4D5D9",
        // fontFamily: "inter",
    },

    checkboxBase: {
        width: 18,
        height: 18,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 2,
        borderWidth: 2,
        // borderColor: "#FF6666",
        borderColor: "#535665",
        backgroundColor: "transparent",
        marginRight: 6,
    },

    checkboxChecked: {
        // backgroundColor: "#FF6666",
        backgroundColor: "#535665",
    },

    checkboxLabel: {
        fontSize: 14,
        color: "#535665",
    },

    redTextLabel: {
        color: "#535665",
        fontSize: 14,
        fontWeight: "700",
        fontFamily: "inter",
        alignSelf: "flex-start",
        paddingHorizontal: 20,
        marginBottom: 10,
    },

    placeholderStyle: {
        fontSize: 14,
    },

    selectedTextStyle: {
        fontSize: 14,
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
    formContainer: {
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
    errorText: {
        color: "#FF0000",
        fontSize: 12,
        fontFamily: "inter",
    },

    errorTextCheckBox: {
        color: "#FF0000",
        fontSize: 12,
        fontFamily: "inter",
        marginTop: -15,
        marginBottom: 10,
    }

});