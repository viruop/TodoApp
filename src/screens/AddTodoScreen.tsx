import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { addTodo } from '../store/todoSlice';
import { AppDispatch } from '../store/store';

type RootStackParamList = {
  Main: undefined;
  AddTodo: undefined;
};

type AddTodoScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddTodo'
>;

interface AddTodoScreenProps {
  navigation: AddTodoScreenNavigationProp;
}

const AddTodoScreen: React.FC<AddTodoScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState('');

  const handleAdd = () => {
    const trimmedTitle = title.trim();

    if (trimmedTitle) {
      dispatch(addTodo(trimmedTitle));
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Please enter a todo title');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.label}>Todo Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter todo title..."
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
          autoFocus
          multiline
          maxLength={200}
        />

        <Text style={styles.characterCount}>{title.length}/200 characters</Text>

        <TouchableOpacity style={styles.button} onPress={handleAdd}>
          <Text style={styles.buttonText}>Add Todo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#000',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddTodoScreen;
