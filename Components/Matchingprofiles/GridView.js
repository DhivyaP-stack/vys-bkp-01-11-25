import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const ViewToggle = ({ currentView, onViewChange }) => {
  return (
    <View style={styles.toggleContainer}>
      <TouchableOpacity
        onPress={() => onViewChange('list')}
        style={[
          styles.toggleButton,
          currentView === 'list' && styles.activeButton
        ]}
      >
        <MaterialIcons
          name="view-list"
          size={24}
          color={currentView === 'list' ? '#BD1225' : '#85878C'}
        />
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => onViewChange('grid')}
        style={[
          styles.toggleButton,
          currentView === 'grid' && styles.activeButton
        ]}
      >
        <MaterialIcons
          name="view-module"
          size={24}
          color={currentView === 'grid' ? '#BD1225' : '#85878C'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    padding: 8,
    borderRadius: 6,
  },
  activeButton: {
    backgroundColor: '#FFF',
  },
});