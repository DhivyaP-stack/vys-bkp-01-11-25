import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";


const Checkbox = ({ id, label, checked, onChange }) => {
  return (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={() => onChange(id, !checked)} // Toggle checked state
    >
      <View
        style={[
          styles.checkbox,
          { backgroundColor: checked ? '#007bff' : '#fff' }
        ]}
      >
          <Ionicons name="checkmark" size={14} color="white" />                                  
        </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>

    // <View style={styles.checkboxDivFlex}>
    //   <View key={profession} style={styles.checkboxContainer}>
    //     <Pressable
    //       style={[
    //         styles.checkboxBase,
    //         value.includes(profession) && styles.checkboxChecked,
    //       ]}
    //       onPress={() => onChange(id, !checked)}
    //     >
    //       {value.includes(profession) && (
    //         <Ionicons name="checkmark" size={14} color="white" />
    //       )}
    //     </Pressable>
    //     <Pressable onPress={() => {
    //       const newValue = value.includes(profession)
    //         ? value.filter((item) => item !== profession)
    //         : [...value, profession];
    //       onChange(newValue);
    //     }}>
    //       <Text style={styles.label}>{label}</Text>
    //     </Pressable>
    //   </View>
    // </View>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 17,
    height: 17,
    borderWidth: 2,
    borderColor: '#808080',
    marginRight: 10,
  },
  label: {
    fontSize: 14,
    color: "#535665",
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




  checkRedText: {
    // color: "#FF6666",
    color: "#535665",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "inter",
    alignSelf: "flex-start",
    // paddingHorizontal: 10,
    marginBottom: 10,
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

});

export default Checkbox;
