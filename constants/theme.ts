import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#3498db',
    secondary: '#f1c40f',
    accent: '#2ecc71',
    background: '#f9f9f9',
    surface: '#ffffff',
    error: '#e74c3c',
    text: '#2c3e50',
    disabled: '#95a5a6',
    placeholder: '#bdc3c7',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: '#e74c3c',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#3498db',
    secondary: '#f1c40f',
    accent: '#2ecc71',
    background: '#121212',
    surface: '#1e1e1e',
    error: '#e74c3c',
    text: '#ecf0f1',
    disabled: '#95a5a6',
    placeholder: '#7f8c8d',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: '#e74c3c',
  },
}; 