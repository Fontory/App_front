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
import QuoteCompleteScreen from './screens/Board/QuoteCompleteScreen';
import BoardPostScreen from './screens/Board/BoardPostScreen';
import BoardDetailScreen from './screens/Board/BoardDetailScreen';
import OtherProfileScreen from './screens/Board/OtherProfileScreen';
import MyPageScreen from './screens/Mypage/MyPageScreen';
import MyProfileScreen from './screens/Mypage/MyProfileScreen';
import LevelInfoScreen from './screens/Mypage/LevelInfoScreen';
import MyFontScreen from './screens/Mypage/MyFontScreen';
import BoardEditScreen from './screens/Mypage/BoardEditScreen';
import SaveFontScreen from './screens/Mypage/SaveFontScreen';
import LikeFontScreen from './screens/Mypage/LikeFontScreen';
import MyBoardScreen from './screens/Mypage/MyBoardScreen';
import MyNoteBookScreen from './screens/Mypage/MyNoteBookScreen';
import HomeScreen from './screens/HomeScreen';
import FontGenerationScreen from './screens/Font/FontGenerationScreen';
import FontDownloadScreen from './screens/Font/FontDownloadScreen';
import FontListScreen from './screens/Font/FontListScreen';
import FontDetailScreen from './screens/Font/FontDetailScreen';
import ExerciseBookScreen from './screens/ExerciseBook/ExerciseBookScreen';
import ExerciseBook2Screen from './screens/ExerciseBook/ExerciseBook2Screen';

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
  QuoteComplete: undefined;
  BoardPost: undefined;
  BoardDetail: undefined;
  OtherProfile: undefined;
  MyPage: undefined;
  MyProfile: undefined;
  LevelInfo: undefined;
  MyFont: undefined;
  BoardEdit: undefined;
  SaveFont: undefined;
  LikeFont: undefined;
  MyBoard: undefined;
  MyNoteBook: undefined;
  Home: undefined;
  FontGeneration: { imageUri: string };
  FontDownload: { fontName: string };
  FontList: undefined;
  FontDetail: { font: any };
  ExerciseBook: { fontName: string };
  ExerciseBook2: {
    background: { id: string; name: string; image: any };
    fontName: string;
    quote: string;
  };
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
      <Stack.Screen name="QuoteComplete" component={QuoteCompleteScreen} />
      <Stack.Screen name="BoardPost" component={BoardPostScreen} />
      <Stack.Screen name="BoardDetail" component={BoardDetailScreen} />
      <Stack.Screen name="OtherProfile" component={OtherProfileScreen} />
      <Stack.Screen name="MyPage" component={MyPageScreen} />
      <Stack.Screen name="MyProfile" component={MyProfileScreen} />
      <Stack.Screen name="LevelInfo" component={LevelInfoScreen} />
      <Stack.Screen name="MyFont" component={MyFontScreen} />
      <Stack.Screen name="BoardEdit" component={BoardEditScreen} />
      <Stack.Screen name="SaveFont" component={SaveFontScreen} />
      <Stack.Screen name="LikeFont" component={LikeFontScreen} />
      <Stack.Screen name="MyBoard" component={MyBoardScreen} />
      <Stack.Screen name="MyNoteBook" component={MyNoteBookScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="FontGeneration" component={FontGenerationScreen} />
      <Stack.Screen name="FontDownload" component={FontDownloadScreen} />
      <Stack.Screen name="FontList" component={FontListScreen} />
      <Stack.Screen name="FontDetail" component={FontDetailScreen} />
      <Stack.Screen name="ExerciseBook" component={ExerciseBookScreen} />
      <Stack.Screen name="ExerciseBook2" component={ExerciseBook2Screen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
