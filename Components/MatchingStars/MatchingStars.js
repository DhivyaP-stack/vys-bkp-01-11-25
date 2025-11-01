import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Checkbox from './Checkbox';

const MatchingStars = ({ matchCountValue, starAndRasi, selectedStarIds, onCheckboxChange }) => {
  const handleCheckboxChange = (id, checked) => {
    if (checked) {
      // Add the item
      const item = starAndRasi.find(item => item.id === id);
      if (item && !selectedStarIds.some(selected => selected.id === id)) {
        const newItem = {
          id: item.id,
          rasi: item.matching_rasiId || '',
          star: item.matching_starId || '',
          label: `${item.matching_starname || ''} - ${item.matching_rasiname || ''}`,
        };
        onCheckboxChange([...selectedStarIds, newItem]);
      }
    } else {
      // Remove only the unchecked item
      const updatedSelections = selectedStarIds.filter(selected => selected.id !== id);
      onCheckboxChange(updatedSelections);
    }
  };

  // --- Select All logic ---
  const allSelected = starAndRasi.length > 0 &&
  starAndRasi.every(item =>
    selectedStarIds.some(selected => selected.id === item.id)
  );


  const handleSelectAllCheckbox = () => {
    const unselectedItems = starAndRasi.filter(item =>
      !selectedStarIds.some(selected => selected.id === item.id)
    );

    if (unselectedItems.length > 0) {
      // Select all: add missing items
      const newSelections = unselectedItems.map(item => ({
        id: item.id,
        rasi: item.matching_rasiId || '',
        star: item.matching_starId || '',
        label: `${item.matching_starname || ''} - ${item.matching_rasiname || ''}`,
      }));
      const updatedSelections = [...selectedStarIds, ...newSelections];
      onCheckboxChange(updatedSelections);
    } else {
      // All selected: deselect only the items in this group
      const filteredSelections = selectedStarIds.filter(
        selected => !starAndRasi.some(item => item.id === selected.id)
      );
      onCheckboxChange(filteredSelections);
    }
  };  
  

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center' }}
        onPress={handleSelectAllCheckbox}
        activeOpacity={0.7}
      >
        <Checkbox
          id="selectAll"
          checked={allSelected}
          onChange={handleSelectAllCheckbox}
        />
        <Text style={styles.title}>
          {matchCountValue === 0
            ? "Unmatching Stars"
            : matchCountValue === 15
              ? "Yega Porutham"
              : `Matching Stars (${matchCountValue} Poruthams)`}
        </Text>
      </TouchableOpacity>
      {starAndRasi.map(item => (
        <Checkbox
          key={item.id}
          id={item.id}
          label={`${item.matching_starname} - ${item.matching_rasiname}`}
          checked={selectedStarIds.some(selectedItem => selectedItem.id === item.id)}
          onChange={handleCheckboxChange}
        />
      ))}
    </View>



  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop : -10
  },
  selectAllContainer: {
    marginBottom: 8,
    padding: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  selectAllText: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
});

export default MatchingStars;
