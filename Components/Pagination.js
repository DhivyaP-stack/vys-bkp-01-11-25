import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalRecords = 0,
  recordsPerPage = 20,
  onPageChange,
  showRecordsInfo = true,
}) => {
  const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * recordsPerPage + 1;
  const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageInput = (text) => {
    const page = parseInt(text, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <View style={styles.container}>
      {showRecordsInfo && (
        <Text style={styles.recordsText}>
          Showing {startRecord} to {endRecord} of {totalRecords} results
        </Text>
      )}

      <View style={styles.paginationControls}>
        <TouchableOpacity
          style={[styles.navButton, currentPage === 1 && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={currentPage === 1}
        >
          <MaterialIcons
            name="chevron-left"
            size={24}
            color={currentPage === 1 ? '#ccc' : '#333'}
          />
        </TouchableOpacity>

        <View style={styles.pageInputContainer}>
          <TextInput
            style={styles.pageInput}
            value={currentPage.toString()}
            keyboardType="number-pad"
            onChangeText={handlePageInput}
            maxLength={totalPages.toString().length}
          />
          <Text style={styles.pageText}>of {totalPages}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.navButton,
            currentPage === totalPages && styles.navButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={currentPage === totalPages}
        >
          <MaterialIcons
            name="chevron-right"
            size={24}
            color={currentPage === totalPages ? '#ccc' : '#333'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  recordsText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  paginationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navButton: {
    padding: 4,
    borderRadius: 4,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  pageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pageInput: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 50,
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
  pageText: {
    fontSize: 14,
    color: '#666',
  },
});

// // Example usage component
// export default function PaginationExample() {
//   const [currentPage, setCurrentPage] = React.useState(1);
//   const totalRecords = 473;
//   const recordsPerPage = 20;
//   const totalPages = Math.ceil(totalRecords / recordsPerPage);

//   return (
//     <View style={exampleStyles.container}>
//       <View style={exampleStyles.content}>
//         <Text style={exampleStyles.title}>Pagination Example</Text>
//         <Text style={exampleStyles.subtitle}>
//           This is where your content would go
//         </Text>
//       </View>

//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         totalRecords={totalRecords}
//         recordsPerPage={recordsPerPage}
//         onPageChange={setCurrentPage}
//         showRecordsInfo={true}
//       />
//     </View>
//   );
// }

// const exampleStyles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#666',
//   },
// });