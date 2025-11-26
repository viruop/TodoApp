import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  fetchTodos,
  //   loadTodosFromStorage,
  toggleTodo,
  deleteTodo,
  editTodo,
  setFilter,
  setSortBy,
  selectFilteredAndSortedTodos,
  selectFilter,
  selectSortBy,
  selectIsLoading,
  selectTotalCount,
  selectCompletedCount,
  selectTodos,
} from '../store/todoSlice';
import { AppDispatch } from '../store/store';
import TodoItem from '../components/TodoItem';
import FilterSort from '../components/FilterSort';

type RootStackParamList = {
  Main: undefined;
  AddTodo: undefined;
};

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface MainScreenProps {
  navigation: MainScreenNavigationProp;
}

const MainScreen: React.FC<MainScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();

  // Select data from Redux store using selectors
  const filteredAndSortedTodos = useSelector(selectFilteredAndSortedTodos);
  const filter = useSelector(selectFilter);
  const sortBy = useSelector(selectSortBy);
  const isLoading = useSelector(selectIsLoading);
  const totalCount = useSelector(selectTotalCount);
  const completedCount = useSelector(selectCompletedCount);
  const allTodos = useSelector(selectTodos);

  useEffect(() => {
    // Load todos from local storage first
    // dispatch(loadTodosFromStorage()).then((result) => {
    //   // If no local data, fetch from API
    //   if (!result.payload || (result.payload as any[]).length === 0) {
    //     dispatch(fetchTodos());
    //   }
    // });
    dispatch(fetchTodos());
  }, [dispatch]);

  // Handler functions
  const handleToggle = (id: number) => {
    dispatch(toggleTodo(id));
  };

  const handleDelete = (id: number) => {
    dispatch(deleteTodo(id));
  };

  const handleEdit = (id: number, title: string) => {
    dispatch(editTodo({ id, title }));
  };

  const handleFilterChange = (newFilter: typeof filter) => {
    dispatch(setFilter(newFilter));
  };

  const handleSortChange = (newSort: typeof sortBy) => {
    dispatch(setSortBy(newSort));
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading todos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with counts */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Todos</Text>
        <View style={styles.counts}>
          <Text style={styles.countText}>
            Total: {totalCount} | Completed: {completedCount}
          </Text>
        </View>
      </View>

      {/* Filter and Sort Controls */}
      <FilterSort
        filter={filter}
        sortBy={sortBy}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />

      {/* Todo List */}
      <FlatList
        data={filteredAndSortedTodos}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {allTodos.length === 0
                ? 'No todos yet. Tap + to add one!'
                : 'No todos match the current filter'}
            </Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTodo')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#000',
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  counts: {
    flexDirection: 'row',
  },
  countText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
  },
});

export default MainScreen;
