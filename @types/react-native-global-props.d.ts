declare module 'react-native-global-props' {
  import { TextStyle, TextInputProps, TouchableOpacityProps } from 'react-native';

  const GlobalProps: {
    setCustomText(customProps: { style?: TextStyle }): void;
    setCustomTextInput(customProps: { style?: TextInputProps['style'] }): void;
    setCustomTouchableOpacity(customProps: { style?: TouchableOpacityProps['style'] }): void;
  };

  export default GlobalProps;
}
