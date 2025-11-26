import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FilterType, SortType } from '../types';

interface FilterSortProps {
  filter: FilterType;
  sortBy: SortType;
  onFilterChange: (filter: FilterType) => void;
  onSortChange: (sort: SortType) => void;
}

const FilterSort: React.FC<FilterSortProps> = memo(
  ({ filter, sortBy, onFilterChange, onSortChange }) => {
    const filters: FilterType[] = ['All', 'Active', 'Done'];
    const sorts: SortType[] = ['ID', 'MostRecent'];

    return (
      <View style={styles.container}>
        {/* Filter Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Filter:</Text>
          <View style={styles.buttonGroup}>
            {filters.map(f => (
              <TouchableOpacity
                key={f}
                style={[styles.button, filter === f && styles.activeButton]}
                onPress={() => onFilterChange(f)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    filter === f && styles.activeButtonText,
                  ]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sort Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Sort:</Text>
          <View style={styles.buttonGroup}>
            {sorts.map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.button, sortBy === s && styles.activeButton]}
                onPress={() => onSortChange(s)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    sortBy === s && styles.activeButtonText,
                  ]}
                >
                  {s === 'MostRecent' ? 'Recent' : s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  section: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  activeButton: {
    backgroundColor: '#000',
  },
  buttonText: {
    fontSize: 13,
    color: '#000',
    fontWeight: '500',
  },
  activeButtonText: {
    color: '#fff',
  },
});

export default FilterSort;
