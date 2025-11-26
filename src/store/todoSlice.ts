import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { TodoState, FilterType, SortType } from './types';
import { Todo } from '../types';

const initialState: TodoState = {
  todos: [],
  filter: 'All',
  sortBy: 'ID',
  isLoading: false,
  error: null,
};

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos');
  const data = await response.json();

  const todosWithTimestamps: Todo[] = data.slice(0, 20).map((todo: any) => ({
    ...todo,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  return todosWithTimestamps;
});

// Async thunk to load todos from AsyncStorage
// export const loadTodosFromStorage = createAsyncThunk(
//   'todos/loadFromStorage',
//   async () => {
//     const todosString = await AsyncStorage.getItem('todos');
//     if (todosString) {
//       return JSON.parse(todosString) as Todo[];
//     }
//     return [];
//   },
// );

// Async thunk to save todos to AsyncStorage
// export const saveTodosToStorage = createAsyncThunk(
//   'todos/saveToStorage',
//   async (todos: Todo[]) => {
//     await AsyncStorage.setItem('todos', JSON.stringify(todos));
//     return todos;
//   },
// );

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // Add new todo
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo: Todo = {
        id:
          state.todos.length > 0
            ? Math.max(...state.todos.map(t => t.id)) + 1
            : 1,
        title: action.payload,
        completed: false,
        userId: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      state.todos.push(newTodo);

      // Save to storage after adding
      //   saveTodosToStorage(state.todos);
    },

    // Edit todo
    editTodo: (state, action: PayloadAction<{ id: number; title: string }>) => {
      const todo = state.todos.find(t => t.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        todo.updated_at = new Date().toISOString();

        // Save to storage after editing
        // saveTodosToStorage(state.todos);
      }
    },

    // Toggle todo completion
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        todo.updated_at = new Date().toISOString();

        // Save to storage after toggling
        // saveTodosToStorage(state.todos);
      }
    },

    // Delete todo
    deleteTodo: (state, action: PayloadAction<number>) => {
      state.todos = state.todos.filter(t => t.id !== action.payload);

      // Save to storage after deleting
      //   saveTodosToStorage(state.todos);
    },

    // Set filter
    setFilter: (state, action: PayloadAction<FilterType>) => {
      state.filter = action.payload;
    },

    // Set sort
    setSortBy: (state, action: PayloadAction<SortType>) => {
      state.sortBy = action.payload;
    },
  },
  extraReducers: builder => {
    // Handle fetchTodos async actions
    builder
      .addCase(fetchTodos.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todos = action.payload;
        // Save to storage after fetching
        // saveTodosToStorage(action.payload);
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch todos';
      });
    // Handle loadTodosFromStorage async actions
    //   .addCase(loadTodosFromStorage.fulfilled, (state, action) => {
    //     if (action.payload.length > 0) {
    //       state.todos = action.payload;
    //     }
    //   });
  },
});

export const {
  addTodo,
  editTodo,
  toggleTodo,
  deleteTodo,
  setFilter,
  setSortBy,
} = todoSlice.actions;

// Selectors
export const selectTodos = (state: { todos: TodoState }) => state.todos.todos;
export const selectFilter = (state: { todos: TodoState }) => state.todos.filter;
export const selectSortBy = (state: { todos: TodoState }) => state.todos.sortBy;
export const selectIsLoading = (state: { todos: TodoState }) =>
  state.todos.isLoading;

export const selectFilteredAndSortedTodos = (state: { todos: TodoState }) => {
  let filtered = [...state.todos.todos];

  if (state.todos.filter === 'Active') {
    filtered = filtered.filter(todo => !todo.completed);
  } else if (state.todos.filter === 'Done') {
    filtered = filtered.filter(todo => todo.completed);
  }

  if (state.todos.sortBy === 'MostRecent') {
    filtered.sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );
  } else {
    filtered.sort((a, b) => a.id - b.id);
  }

  return filtered;
};

export const selectTotalCount = (state: { todos: TodoState }) =>
  state.todos.todos.length;

export const selectCompletedCount = (state: { todos: TodoState }) =>
  state.todos.todos.filter(todo => todo.completed).length;

export default todoSlice.reducer;
