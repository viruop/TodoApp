import AppNavigator from './src/navigation/AppNavigator';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App() {
  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
