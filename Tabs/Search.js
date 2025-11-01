import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  Pressable,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { getAdvanceSearchResults } from '../CommonApiCall/CommonApiCall'; // Adjust the import path as needed
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Search_By_profileId, logProfileVisit } from "../CommonApiCall/CommonApiCall";  // Import the function
import ProfileNotFound from "../Components/ProfileNotFound/ProfileNotFound";
import Toast from "react-native-toast-message";
import { useForm, Controller } from "react-hook-form";
import { Dropdown } from "react-native-element-dropdown";
import config from "../API/Apiurl";

export const Search = () => {
  const navigation = useNavigation();
  const { control } = useForm(); // Initialize useForm and get control
  // State variables for input fields
  const [fromAge, setFromAge] = useState(0);
  const [toAge, setToAge] = useState(0);
  const [fromHeight, setFromHeight] = useState(0);
  const [toHeight, setToHeight] = useState(0);
  const [fromRegDate, setFromRegDate] = useState('');
  const [toRegDate, setToRegDate] = useState('');
  const [maritalStatuses, setMaritalStatuses] = useState([]);
  const [checkedStatuses, setCheckedStatuses] = useState(new Set()); // To track selected statuses
  const [selectedIds, setSelectedIds] = useState(''); // Store selected IDs as comma-separated string
  const [professions, setProfessions] = useState([]); // Store fetched professions
  const [checkedProfessions, setCheckedProfessions] = useState(new Set()); // Track selected profession IDs
  const [selectedProfessionIds, setSelectedProfessionIds] = useState(''); // Store selected IDs as a string
  const [educationOptions, setEducationOptions] = useState([]); // Store fetched education options
  const [selectedEducationId, setSelectedEducationId] = useState(''); // Store selected ID as a string
  const [incomeOptions, setIncomeOptions] = useState([]); // Store fetched income options
  const [checkedIncomes, setCheckedIncomes] = useState(new Set()); // Track selected income IDs
  const [selectedIncomeMinIds, setSelectedIncomeMinIds] = useState(''); // Store selected IDs as a string
  const [selectedIncomeMaxIds, setSelectedIncomeMaxIds] = useState('');
  const [birthStars, setBirthStars] = useState([]); // Store fetched birth stars
  const [selectedBirthStarIds, setSelectedBirthStarIds] = useState(''); // Store selected IDs as a string
  const [states, setStates] = useState([]); // Store fetched states
  const [checkedStates, setCheckedStates] = useState(new Set()); // Track selected state IDs
  const [selectedStateIds, setSelectedStateIds] = useState(''); // Store selected IDs as a string
  const [searchProfileId, setSearchProfileId] = useState(""); // State to store input
  const [profiles, setProfiles] = useState([]); // State for search results (profile data)
  const [fieldOfStudyOptions, setFieldOfStudyOptions] = useState([]); // For the new dropdown
  const [checkFieldoStudy, setCheckFieldoStudy] = useState(new Set());
  const [selectedFieldofStudyIds, setSelectedFieldofStudyIds] = useState('');
  const [chevvaiDhosam, setChevvaiDhosam] = useState(null);
  const [rahuKetuDhosam, setRahuKetuDhosam] = useState(null);


  const getImageSource = (image) => {
    if (!image) return { uri: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fstock.adobe.com%2Fsearch%2Fimages%3Fk%3Ddefault%2Bimage&psig=AOvVaw28Px6jC5wsx4TWxwOrHJT2&ust=1726388184602000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCMCfpqb_wYgDFQAAAAAdAAAAABAE' }; // Fallback image
    if (Array.isArray(image)) {
      return { uri: image[0] }; // Use the first image if it's an array
    }
    return { uri: image }; // Direct URL case
  };

  // Fetch marital statuses from the API
  const fetchMaritalStatuses = async () => {
    try {
      const response = await axios.post(
        `${config.apiUrl}/auth/Get_Marital_Status/`
      );
      const status = Object.values(response.data); // Convert response object to array
      setMaritalStatuses(status);
    } catch (error) {
      console.error("Error fetching marital statuses", error);
    }
  };

  const fetchProfessions = async () => {
    try {
      const response = await axios.post(
        `${config.apiUrl}/auth/Get_Profes_Pref/`
      );
      const professionList = Object.values(response.data); // Assuming the structure matches previous
      setProfessions(professionList); // Set professions in state
    } catch (error) {
      console.error("Error fetching professions", error);
    }
  };

  const fetchEducationOptions = async () => {
    try {
      const response = await axios.post(
        `${config.apiUrl}/auth/Get_Highest_Education/`
      );
      const educationList = Object.values(response.data); // Transform the response into an array
      setEducationOptions(educationList); // Store the education options in state
    } catch (error) {
      console.error("Error fetching education options", error);
    }
  };

  // const fetchIncomeOptions = async () => {
  //   try {
  //     const response = await axios.post(
  //       "https://matrimonyapi.rainyseasun.com/auth/Get_Annual_Income/"
  //     );
  //     const incomeList = Object.values(response.data); // Convert object to array
  //     setIncomeOptions(incomeList); // Store the income options in state
  //   } catch (error) {
  //     console.error("Error fetching income options", error);
  //   }
  // };

  const fetchIncomeOptions = async () => {
    try {
      const response = await axios.post(`${config.apiUrl}/auth/Get_Annual_Income/`);
      const annualIncomeArray = Object.keys(response.data).map(key => ({
        label: response.data[key].income_description,
        value: response.data[key].income_id.toString(),
      }));
      setIncomeOptions(annualIncomeArray);
    } catch (error) {
      console.error("Error fetching UG Degree:", error);
    }
  };

  const fetchBirthStars = async () => {
    try {
      const response = await axios.post(
        `${config.apiUrl}/auth/Get_Birth_Star/`,
        {
          state_id: "", // or `null` depending on what the API expects
        }
      );
      const starList = Object.values(response.data); // Convert object to array
      setBirthStars(starList); // Store the birth stars in state
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error fetching birth stars:",
          error.response?.data || error.message
        );
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const fetchStates = async () => {
    try {
      const response = await axios.post(
        `${config.apiUrl}/auth/Get_State_Pref/`
      );

      // Assuming response.data is an object, transform it to an array of State
      const statesArray = Object.values(response.data); // Convert object to array
      setStates(statesArray); // Store the states in state
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  useEffect(() => {
    fetchMaritalStatuses();
    fetchProfessions();
    fetchEducationOptions();
    fetchIncomeOptions();
    fetchBirthStars();
    fetchStates();
    fetchFieldOfStudy();
  }, []);

  const fetchFieldOfStudy = async () => {
    try {
      const response = await axios.post(`${config.apiUrl}/auth/Get_Field_ofstudy/`);
      console.log("Field of study data ===>", response)
      const fieldofstudyList = Object.values(response.data); // Transform the response into an array
      setFieldOfStudyOptions(fieldofstudyList); // Store the education options in state
    } catch (error) {
      console.error("Error fetching education options", error);
    }
  }

  // Handle checkbox toggle for a specific status
  const handleCheckboxToggle = (statusId) => {
    setCheckedStatuses((prevCheckedStatuses) => {
      const updatedCheckedStatuses = new Set(prevCheckedStatuses);

      if (updatedCheckedStatuses.has(statusId)) {
        updatedCheckedStatuses.delete(statusId); // Uncheck if already checked
      } else {
        updatedCheckedStatuses.add(statusId); // Check if not already checked
      }

      // Update the selectedIds state
      const selectedIdsString = Array.from(updatedCheckedStatuses).join(',');
      setSelectedIds(selectedIdsString); // Set the selectedIds string in state
      console.log(selectedIdsString);

      return updatedCheckedStatuses;
    });
  };

  const handleProfessionToggle = (professionId) => {
    setCheckedProfessions((prevCheckedProfessions) => {
      const updatedCheckedProfessions = new Set(prevCheckedProfessions);

      if (updatedCheckedProfessions.has(professionId)) {
        updatedCheckedProfessions.delete(professionId); // Uncheck if already checked
      } else {
        updatedCheckedProfessions.add(professionId); // Check if not already checked
      }

      // Update the selectedProfessionIds state
      const selectedIdsString = Array.from(updatedCheckedProfessions).join(',');
      setSelectedProfessionIds(selectedIdsString); // Set the selected IDs string in state
      console.log("Selected Profession IDs:", selectedIdsString);

      return updatedCheckedProfessions;
    });
  };

  const handleFieldofStudyToggle = (fieldId) => {
    setCheckFieldoStudy((prevCheckedFieldofStudy) => {
      const updatedCheckedFieldofStudy = new Set(prevCheckedFieldofStudy);

      if (updatedCheckedFieldofStudy.has(fieldId)) {
        updatedCheckedFieldofStudy.delete(fieldId); // Uncheck if already checked
      } else {
        updatedCheckedFieldofStudy.add(fieldId); // Check if not already checked
      }

      // Update the selectedEducationIds state
      const selectedIdsString = Array.from(updatedCheckedFieldofStudy).join(',');
      setSelectedFieldofStudyIds(selectedIdsString); // Set the selected IDs string in state
      console.log("Selected Education IDs:", selectedIdsString);

      return updatedCheckedFieldofStudy;
    });
  };

  // const handleIncomeToggle = (incomeId) => {
  //   setCheckedIncomes((prevCheckedIncomes) => {
  //     const updatedCheckedIncomes = new Set(prevCheckedIncomes);

  //     if (updatedCheckedIncomes.has(incomeId)) {
  //       updatedCheckedIncomes.delete(incomeId); // Uncheck if already checked
  //     } else {
  //       updatedCheckedIncomes.add(incomeId); // Check if not already checked
  //     }

  //     // Update the selectedIncomeIds state
  //     const selectedIdsString = Array.from(updatedCheckedIncomes).join(',');
  //     setSelectedIncomeIds(selectedIdsString); // Set the selected IDs string in state
  //     console.log("Selected Income IDs:", selectedIdsString);

  //     return updatedCheckedIncomes;
  //   });
  // };

  const handleStateToggle = (stateId) => {
    setCheckedStates((prevCheckedStates) => {
      const updatedCheckedStates = new Set(prevCheckedStates);

      if (updatedCheckedStates.has(stateId)) {
        updatedCheckedStates.delete(stateId); // Uncheck if already checked
      } else {
        updatedCheckedStates.add(stateId); // Check if not already checked
      }

      // Update the selectedStateIds state
      const selectedIdsString = Array.from(updatedCheckedStates).join(',');
      setSelectedStateIds(selectedIdsString); // Set the selected IDs string in state
      console.log("Selected State IDs:", selectedIdsString);

      return updatedCheckedStates;
    });
  };




  const handleSubmit = async () => {
    const params = {
      from_age: fromAge,
      to_age: toAge,
      from_height: fromHeight,
      to_height: toHeight,
      search_marital_status: selectedIds,
      search_profession: selectedProfessionIds,
      search_education: selectedEducationId,
      max_income: selectedIncomeMinIds,
      min_income: selectedIncomeMaxIds,
      field_ofstudy: selectedFieldofStudyIds,
      search_star: selectedBirthStarIds,
      search_nativestate: selectedStateIds,
      search_chevvai_dosham: chevvaiDhosam,
      search_rahu_dosham: rahuKetuDhosam,
      // from_reg_date: fromRegDate,
      // to_reg_date: toRegDate,
    };

    try {
      // Save parameters to AsyncStorage
      console.log("search params ==>", params)
      await AsyncStorage.setItem('searchParams', JSON.stringify(params));

      // Fetch search results
      const searchResults = await getAdvanceSearchResults(per_page = 1, page_number = 1);
      console.log('Search Results:', searchResults);

      if (searchResults && searchResults && searchResults.status === "success") {
        // Access total_count from the correct part of the response
        const totalCount = searchResults.total_count;  // Adjust based on actual structure

        const count = totalCount.toString();
        await AsyncStorage.setItem('totalcount', count.toString());


        navigation.navigate('SearchResults', { results: searchResults.data });
      } else {
        console.error('Failed to fetch search results:', searchResults.data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error during search:', error);
      Toast.show({
        type: 'error',
        text1: 'No Results Found',
        text2: 'Your search did not return any results. Please try different criteria.',
        position: 'bottom'
      });
    }


  };



  const DEBOUNCE_DELAY = 500;

  const handleSearchPress = async (profileId) => {
    if (profileId) {  // Check if at least 6 characters are entered
      console.log(profileId);
      try {
        const response = await Search_By_profileId(profileId); // Call API

        if (response.status === "success") {
          setProfiles(response.data); // Store profiles in state
        } else {
          setProfiles([]); // Clear profiles if no success status
          console.log("No record found");
        }

      } catch (error) {
        console.log("Error:", error.message); // Handle error
      }
    } else {
      console.log("Please enter at least 6 characters to search");
    }
  };

  // Inside the component where you're handling input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchProfileId && searchProfileId.length >= 6) {
        handleSearchPress(searchProfileId);  // Call the search function with debounce
      }
    }, DEBOUNCE_DELAY);

    // Clean up the timer on every new keystroke or component unmount
    return () => clearTimeout(timer);
  }, [searchProfileId]); // Trigger when the user types something






  // Function to handle filter icon press
  const handleFilterPress = () => {
    // Implement your filter functionality here
    console.log("Filter icon pressed");
  };

  // Profile Photo
  const [ppChecked, ppSetChecked] = useState(false);

  const ppHandleCheckboxToggle = () => {
    ppSetChecked(!ppChecked);
  };

  const clearFields = () => {
    setFromAge('');
    setToAge('');
    setFromHeight('');
    setToHeight('');
    setCheckedIncomes(new Set());
    setCheckedStatuses(new Set());
    setCheckedProfessions(new Set());
    setCheckedEducations(new Set());
    setCheckFieldoStudy(new Set());
    setCheckedStates(new Set());
    setRahuKetuDhosam(null);
    setChevvaiDhosam(null);
  };


  const handleProfileClick = async (viewedProfileId) => {
    const success = await logProfileVisit(viewedProfileId);

    if (success) {
      Toast.show({
        type: "success",
        text1: "Profile Viewed",
        text2: `You have viewed profile ${viewedProfileId}.`,
        position: "bottom",
      });
      // navigation.navigate("ProfileDetails", { id });
      navigation.navigate("ProfileDetails", {
        viewedProfileId,
        // interestParam:0 
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to log profile visit.",
        position: "bottom",
      });
    }
  };

  const RadioButtonGroup = ({ options, selectedValue, onValueChange }) => (
    <View style={styles.radioGroup}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={styles.radioButtonContainer}
          onPress={() => onValueChange(option.value)}
        >
          <View
            style={[
              styles.radioButton,
              selectedValue === option.value && styles.radioButtonSelected,
            ]}
          />
          <Text style={styles.radioLabel}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.search}>Search</Text>

      <View style={styles.formContainer}>
        {/* Search Input Field */}
        <View style={styles.inputContainer}>
          <MaterialIcons
            name="search"
            size={18}
            color="#85878C"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Search profile ID"
            value={searchProfileId}
            onChangeText={(text) => {
              setSearchProfileId(text); // Update the state

              if (text) {
                // Call API when user types at least 6 characters
                handleSearchPress(text);
              } else if (profiles.length > 0 && text.length < 1) {
                // Clear the searchProfileId and profiles when the input is empty
                setSearchProfileId("");
                setProfiles([]);
              }
            }}
          />
        </View>

        {/* Filter Icon */}
        <TouchableOpacity style={styles.filterIcon} onPress={handleFilterPress}>
          <MaterialIcons name="filter-list" size={18} color="#FF6666" />
        </TouchableOpacity>

        {/* Search Button */}
        {/* <TouchableOpacity style={styles.searchButton} onPress={handleSearchPress}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity> */}
      </View>

      {searchProfileId ? (
        <View style={styles.profileScrollView}>
          {profiles.length > 0 ? (
            profiles.map((profile) => (
              <TouchableOpacity
                key={profile.profileid}
                onPress={() => handleProfileClick(profile.profile_id)} // Trigger the click handler
                activeOpacity={0.8} // Adjust opacity effect on click
              >
                <View style={styles.profileDiv}>
                  <View style={styles.profileContainer}>
                    <Image
                      source={getImageSource(profile.profile_img)}
                      style={styles.profileImage}
                    />

                    <View style={styles.profileContent}>
                      <Text style={styles.profileName}>
                        {profile.profile_name}{" "}
                        <Text style={styles.profileId}>({profile.profile_id})</Text>
                      </Text>
                      <Text style={styles.profileAge}>
                        {profile.profile_age} Yrs{" "}
                        <Text style={styles.line}>|</Text> {profile.profile_height}{" "}
                      </Text>
                      <Text style={styles.zodiac}>{profile.star}</Text>
                      <Text style={styles.employed}>{profile.profession}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.centerContainer}>
              <ProfileNotFound />
            </View>
          )}
        </View>

      ) : (

        <>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.searchAdvanced}>Advanced Search</Text>
            <TouchableOpacity onPress={clearFields}>
              <Text style={styles.searchClear}>Clear Search</Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            <View style={styles.searchContainer}>
              <Text style={styles.redText}>Age</Text>
              <View style={styles.formContainer}>
                <View style={styles.inputFlexContainer}>
                  <View style={styles.inputFlexFirst}>
                    <TextInput
                      placeholder="From"
                      keyboardType="numeric"
                      value={fromAge}
                      onChangeText={setFromAge}
                    />
                  </View>
                  <View style={styles.inputFlex}>
                    <TextInput
                      placeholder="To"
                      keyboardType="numeric"
                      value={toAge}
                      onChangeText={setToAge}
                    />
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.searchContainer}>
              <Text style={styles.redText}>Height</Text>
              <View style={styles.formContainer}>
                <View style={styles.inputFlexContainer}>
                  <View style={styles.inputFlexFirst}>
                    <TextInput
                      placeholder="From"
                      keyboardType="numeric"
                      value={fromHeight}
                      onChangeText={setFromHeight}
                    />
                  </View>
                  <View style={styles.inputFlex}>
                    <TextInput
                      placeholder="To"
                      keyboardType="numeric"
                      value={toHeight}
                      onChangeText={setToHeight}
                    />
                  </View>
                </View>
              </View>
            </View>



            <View style={styles.checkContainer}>
              <Text style={styles.checkRedText}>Marital Status</Text>
              <View style={styles.checkboxDivFlex}>
                <View style={styles.checkboxRow}>
                  {maritalStatuses.map((status, index) => (
                    <View key={status.marital_sts_id} style={styles.checkboxContainer}>
                      <Pressable
                        style={[
                          styles.checkboxBase,
                          checkedStatuses.has(status.marital_sts_id) && styles.checkboxChecked,
                        ]}
                        onPress={() => handleCheckboxToggle(status.marital_sts_id)}
                      >
                        {checkedStatuses.has(status.marital_sts_id) && (
                          <Ionicons name="checkmark" size={14} color="white" />
                        )}
                      </Pressable>

                      <Pressable onPress={() => handleCheckboxToggle(status.marital_sts_id)}>
                        <Text style={styles.checkboxLabel}>{status.marital_sts_name}</Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.checkContainer}>
              <Text style={styles.checkRedText}>Profession</Text>

              <View style={styles.checkboxDivFlex}>
                {/* Chunk professions into pairs */}
                {professions.reduce((acc, profession, index) => {
                  if (index % 2 === 0) acc.push([]); // Start a new row
                  acc[acc.length - 1].push(profession); // Add profession to the current row
                  return acc;
                }, []).map((row, rowIndex) => (
                  <View key={rowIndex} style={styles.checkboxRow}>
                    {row.map((profession) => (
                      <View key={profession.Profes_Pref_id} style={styles.checkboxContainer}>
                        <Pressable
                          style={[
                            styles.checkboxBase,
                            checkedProfessions.has(profession.Profes_Pref_id) && styles.checkboxChecked,
                          ]}
                          onPress={() => handleProfessionToggle(profession.Profes_Pref_id)}
                        >
                          {checkedProfessions.has(profession.Profes_Pref_id) && (
                            <Ionicons name="checkmark" size={14} color="white" />
                          )}
                        </Pressable>

                        <Pressable onPress={() => handleProfessionToggle(profession.Profes_Pref_id)}>
                          <Text style={styles.checkboxLabel}>{profession.Profes_name}</Text>
                        </Pressable>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.searchContainer}>
              <Text style={styles.redText}>Highest Education</Text>
              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={educationOptions.map(edu => ({
                      label: edu.education_description,
                      value: edu.education_id.toString()
                    }))}
                    maxHeight={180}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Education"
                    value={selectedEducationId}
                    onChange={(item) => setSelectedEducationId(item.value)}
                  />
                </View>
              </View>
            </View>

            <View style={styles.checkContainer}>
              <Text style={styles.checkRedText}>Field of Study</Text>

              <View style={styles.checkboxDivFlex}>
                <View style={styles.checkboxRow}>
                  {fieldOfStudyOptions.map((fieldofstudy) => (
                    <View key={fieldofstudy.study_id} style={styles.checkboxContainer}>
                      <Pressable
                        style={[
                          styles.checkboxBase,
                          checkFieldoStudy.has(fieldofstudy.study_id) && styles.checkboxChecked,
                        ]}
                        onPress={() => handleFieldofStudyToggle(fieldofstudy.study_id)}
                      >
                        {checkFieldoStudy.has(fieldofstudy.study_id) && (
                          <Ionicons name="checkmark" size={14} color="white" />
                        )}
                      </Pressable>

                      <Pressable onPress={() => handleFieldofStudyToggle(fieldofstudy.study_id)}>
                        <Text style={styles.checkboxLabel}>{fieldofstudy.study_description}</Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              </View>
            </View>


            <View style={styles.checkContainer}>
              {/* <Text style={styles.checkRedText}>Annual Income</Text> */}

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
                          data={incomeOptions} // Use the incomeOptions array
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
                    {/* {errors.annualIncome && <Text style={styles.errorText}>{errors.annualIncome.message}</Text>} */}
                  </View>
                </View>
              </View>

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
                          data={incomeOptions} // Use the incomeOptions array
                          maxHeight={180}
                          labelField="label"
                          valueField="value"
                          placeholder="Select Max Annual Income"
                          value={value}
                          onChange={(item) => {
                            onChange(item.value);
                            setSelectedIncomeMaxIds(item.value); // Update selectedIncomeIds state
                          }}
                        />
                      )}
                    />
                    {/* {errors.annualIncome && <Text style={styles.errorText}>{errors.annualIncome.message}</Text>} */}
                  </View>
                </View>
              </View>

              {/* <View style={styles.checkboxDivFlex}>
                  {incomeOptions.map((income) => (
                    <View key={income.income_id} style={styles.checkboxContainer}>
                      <Pressable
                        style={[
                          styles.checkboxBase,
                          checkedIncomes.has(income.income_id) && styles.checkboxChecked,
                        ]}
                        onPress={() => handleIncomeToggle(income.income_id)}
                      >
                        {checkedIncomes.has(income.income_id) && (
                          <Ionicons name="checkmark" size={14} color="white" />
                        )}
                      </Pressable>

                      <Pressable onPress={() => handleIncomeToggle(income.income_id)}>
                        <Text style={styles.checkboxLabel}>{income.income_description}</Text>
                      </Pressable>
                    </View>
                  ))}
                </View> */}
            </View>


            {/* <View style={styles.searchContainer}>
              <Text style={styles.redText}>Dhosam</Text>

              <View style={styles.dhosamFlex}>
              
                <View style={styles.singleCheckboxContainer}>
                  <Pressable
                    style={[
                      styles.checkboxBase,
                      chevvaiChecked && styles.checkboxChecked,
                    ]}
                    onPress={chevvaiHandleCheckboxToggle}
                  >
                    {chevvaiChecked && (
                      <Ionicons name="checkmark" size={14} color="white" />
                    )}
                  </Pressable>

                  <Pressable onPress={chevvaiHandleCheckboxToggle}>
                    <Text style={styles.checkboxLabel}>Chevvai</Text>
                  </Pressable>
                </View>

                <View style={styles.singleCheckboxContainer}>
                  <Pressable
                    style={[
                      styles.checkboxBase,
                      rehuChecked && styles.checkboxChecked,
                    ]}
                    onPress={rehuHandleCheckboxToggle}
                  >
                    {rehuChecked && (
                      <Ionicons name="checkmark" size={14} color="white" />
                    )}
                  </Pressable>

                  <Pressable onPress={rehuHandleCheckboxToggle}>
                    <Text style={styles.checkboxLabel}>Rahu/Ketu </Text>
                  </Pressable>
                </View>
              </View>
            </View> */}
            <View style={styles.searchContainer}>
              <Text style={styles.redText}>Chevvai Dosham</Text>
              <RadioButtonGroup
                options={[
                  { label: 'Yes', value: 'Yes' },
                  { label: 'No', value: 'No' },
                  { label: 'Both', value: 'Both' },
                ]}
                selectedValue={chevvaiDhosam}
                onValueChange={setChevvaiDhosam}
              />
            </View>
            <View style={styles.searchContainer}>
              <Text style={styles.redText}>Rahu/Ketu Dosham</Text>
              <RadioButtonGroup
                options={[
                  { label: 'Yes', value: 'Yes' },
                  { label: 'No', value: 'No' },
                  { label: 'Both', value: 'Both' },
                ]}
                selectedValue={rahuKetuDhosam}
                onValueChange={setRahuKetuDhosam}
              />
            </View>

            <View style={styles.searchContainer}></View>

            <View style={styles.searchContainer}>
              <Text style={styles.redText}>Birth Star</Text>
              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={birthStars.map(star => ({
                      label: star.birth_star,
                      value: star.birth_id.toString()
                    }))}
                    maxHeight={180}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Birth Star"
                    value={selectedBirthStarIds}
                    onChange={(item) => setSelectedBirthStarIds(item.value)}
                  />
                </View>
              </View>
            </View>


            <View style={styles.checkContainer}>
              <Text style={styles.checkRedText}>Native States</Text>

              <View style={styles.checkboxDivFlex}>
                <View style={styles.checkboxRow}>
                  {states.map((state) => (
                    <View key={state.State_Pref_id} style={styles.checkboxContainer}>
                      <Pressable
                        style={[
                          styles.checkboxBase,
                          checkedStates.has(state.State_Pref_id) && styles.checkboxChecked,
                        ]}
                        onPress={() => handleStateToggle(state.State_Pref_id)}
                      >
                        {checkedStates.has(state.State_Pref_id) && (
                          <Ionicons name="checkmark" size={14} color="white" />
                        )}
                      </Pressable>

                      <Pressable onPress={() => handleStateToggle(state.State_Pref_id)}>
                        <Text style={styles.checkboxLabel}>{state.State_name}</Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              </View>
            </View>


            <View style={styles.searchContainer}>
              <Text style={styles.redText}>Work Location</Text>

              <View style={styles.formContainer}>
                <View style={styles.inputFlexContainer}>
                  <View style={styles.inputFlex}>
                    <TextInput placeholder="Work Location" />
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.searchContainer}>
              <Text style={styles.redText}>Profile Photo</Text>

              <View>
                <View style={styles.singleCheckboxContainer}>
                  <Pressable
                    style={[
                      styles.checkboxBase,
                      ppChecked && styles.checkboxChecked,
                    ]}
                    onPress={ppHandleCheckboxToggle}
                  >
                    {ppChecked && (
                      <Ionicons name="checkmark" size={14} color="white" />
                    )}
                  </Pressable>

                  <Pressable onPress={ppHandleCheckboxToggle}>
                    <Text style={styles.checkboxLabel}>People only with photo</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              {/* Cancel */}
              {/* <TouchableOpacity onPress={clearFields}>
                <View style={styles.loginContainer}>
                  <Text style={styles.cancel}>Clear</Text>
                </View>
              </TouchableOpacity> */}

              <TouchableOpacity
                style={styles.btn}
                onPress={() => {
                  // navigation.navigate("SearchResults");
                  handleSubmit();
                }}
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
                    <Text style={styles.login}>Submit</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </>

      )
      }

    </SafeAreaView >

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  centerContainer: {
    justifyContent: 'center',  // Centers the content vertically
    alignItems: 'center',      // Centers the content horizontally
  },
  search: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "inter",
    color: "#282C3F",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  searchAdvanced: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "inter",
    color: "#282C3F",
    left: -5,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  searchClear: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "inter",
    color: "#FF6666",
    marginLeft: 130,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#D4D5D9",
    backgroundColor: "white"
  },

  input: {
    flex: 1,
    color: "#535665",
    padding: 10,
    fontFamily: "inter",
    backgroundColor: "white"
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
    marginBottom: 15,
    textAlign: "left",
  },

  redText: {
    // color: "#FF6666",
    color: "#282C3F",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "inter",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    marginBottom: 10,
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
    backgroundColor: "white"
  },

  inputFlex: {
    flex: 1,
    color: "#535665",
    padding: 10, // Adjust padding
    fontFamily: "inter",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#D4D5D9",
    backgroundColor: "white"
  },

  checkRedText: {
    // color: "#FF6666",
    color: "#282C3F",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "inter",
    alignSelf: "flex-start",
    // paddingHorizontal: 10,
    marginBottom: 10,
  },

  // checkboxDivFlex: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "flex-start",
  //   alignSelf: "flex-start",
  //   fontFamily: "inter",
  //   width: "100%",
  // },

  // checkBoxFlex: {
  //   // flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "flex-start",
  //   alignSelf: "flex-start",
  //   // borderColor: "#D4D5D9",
  //   fontFamily: "inter",
  // },

  checkContainer: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    width: "80%",
  },

  // checkboxContainer: {
  //   flexDirection: "row",
  //   // justifyContent: "space-between",
  //   alignItems: "center",
  //   marginBottom: 20,
  //   // paddingHorizontal: 10,
  //   // textAlign: "left",
  //   // alignSelf: "center",
  // },

  checkboxDivFlex: {
    flexDirection: "column",  // Stack checkboxes vertically
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%", // Full width to accommodate label text
  },

  checkBoxFlex: {
    flexDirection: "column",  // Stack each set of checkboxes vertically
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",  // Full width for alignment
  },

  checkboxContainer: {
    flexDirection: "row",  // Keeps checkbox and label side-by-side
    alignItems: "center",
    marginBottom: 20,  // Space between each checkbox
  },



  singleCheckboxContainer: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
    // textAlign: "left",
    // alignSelf: "center",
  },

  dhosamFlex: {
    flexDirection: "row",
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
    borderColor: "#282C3F",
    backgroundColor: "transparent",
    marginRight: 6,
  },

  checkboxChecked: {
    // backgroundColor: "#FF6666",
    backgroundColor: "#282C3F",
  },

  checkboxLabel: {
    fontSize: 13,
    color: "#535665",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 10,
    marginTop: -20,
  },

  btn: {
    // width: "100%",
    alignSelf: "center",
    borderRadius: 6,
    // shadowColor: "#EE1E2440",
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.2,
    // shadowRadius: 6,
    // elevation: 5,
    marginBottom: 10,
  },

  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  cancel: {
    color: "#FF6666",
    fontSize: 14,
    // fontWeight: "700",
    fontFamily: "inter",
    alignSelf: "flex-start",
    padding: 15,
    marginBottom: 10,
  },

  login: {
    textAlign: "center",
    color: "white",
    fontWeight: "600",
    fontSize: 14,
    letterSpacing: 1,
    fontFamily: "inter",
    // marginRight: 5,
  },

  linearGradient: {
    borderRadius: 5,
    justifyContent: "center",
    padding: 10,
  },
  searchButton: {
    backgroundColor: '#FF6666',  // Adjust color as needed
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 1,  // Add margin to separate from the input field
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: 16,
  },

  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  profileScrollView: {
    width: "100%",
  },

  profileDiv: {
    width: "100%",
    paddingHorizontal: 10,
  },

  profileContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderRadius: 8,
    padding: 8,
    marginVertical: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },

  saveIcon: {
    position: "absolute",
    left: -25,
    top: 5,
  },

  profileContent: {
    paddingLeft: 10,
  },

  profileName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF6666",
    fontFamily: "inter",
    marginBottom: 10,
  },

  profileId: {
    fontSize: 14,
    color: "#85878C",
  },

  profileAge: {
    fontSize: 14,
    color: "#4F515D",
    marginBottom: 5,
  },

  line: {},

  zodiac: {
    fontSize: 14,
    color: "#4F515D",
    marginBottom: 5,
  },

  employed: {
    fontSize: 14,
    color: "#4F515D",
  },

  checkboxRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#282C3F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#282C3F',
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 14,
  },
  dropdown: {
    width: "100%",
    color: "#535665",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#D4D5D9",
    paddingHorizontal: 10,
    paddingVertical: 13,
    fontFamily: "inter",
  },

  placeholderStyle: {
    fontSize: 14,
  },

  selectedTextStyle: {
    fontSize: 14,
  },
});
