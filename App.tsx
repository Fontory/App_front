// App.tsx
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// screens import
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/Login/LoginScreen';
import RegisterScreen from './screens/Login/RegisterScreen';
import SetPasswordScreen from './screens/Login/SetPasswordScreen';
import ResetPasswordScreen from './screens/Login/ResetPasswordScreen';
import PrivacyScreen from './screens/Login/PrivacyScreen';
import BoardScreen from './screens/Board/BoardScreen';
import QuoteDetailScreen from './screens/Board/QuoteDetailScreen';
import QuoteNotebookScreen from './screens/Board/QuoteNotebookScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  SetPassword: undefined;
  ResetPassword: undefined;
  Privacy: undefined;
  Board: undefined;
  QuoteDetail: undefined;
  QuoteNotebook: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="SetPassword" component={SetPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
      <Stack.Screen name="Board" component={BoardScreen} />
      <Stack.Screen name="QuoteDetail" component={QuoteDetailScreen} />
      <Stack.Screen name="QuoteNotebook" component={QuoteNotebookScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
