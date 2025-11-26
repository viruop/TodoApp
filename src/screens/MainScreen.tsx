import React, { useEffect, useMemo } from 'react';
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
  toggleTodo,
  deleteTodo,
  editTodo,
  setFilter,
  setSortBy,
  selectTodos,
  selectFilter,
  selectSortBy,
  selectIsLoading,
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

  const allTodos = useSelector(selectTodos);
  const filter = useSelector(selectFilter);
  const sortBy = useSelector(selectSortBy);
  const isLoading = useSelector(selectIsLoading);

  const filteredAndSortedTodos = useMemo(() => {
    let filtered = [...allTodos];

    if (filter === 'Active') {
      filtered = filtered.filter(todo => !todo.completed);
    } else if (filter === 'Done') {
      filtered = filtered.filter(todo => todo.completed);
    }

    if (sortBy === 'MostRecent') {
      filtered.sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      );
    } else {
      filtered.sort((a, b) => a.id - b.id);
    }

    return filtered;
  }, [allTodos, filter, sortBy]);

  const totalCount = useMemo(() => allTodos.length, [allTodos]);
  const completedCount = useMemo(
    () => allTodos.filter(todo => todo.completed).length,
    [allTodos],
  );

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleToggle = React.useCallback(
    (id: number) => {
      dispatch(toggleTodo(id));
    },
    [dispatch],
  );

  const handleDelete = React.useCallback(
    (id: number) => {
      dispatch(deleteTodo(id));
    },
    [dispatch],
  );

  const handleEdit = React.useCallback(
    (id: number, title: string) => {
      dispatch(editTodo({ id, title }));
    },
    [dispatch],
  );

  const handleFilterChange = React.useCallback(
    (newFilter: typeof filter) => {
      dispatch(setFilter(newFilter));
    },
    [dispatch],
  );

  const handleSortChange = React.useCallback(
    (newSort: typeof sortBy) => {
      dispatch(setSortBy(newSort));
    },
    [dispatch],
  );

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
