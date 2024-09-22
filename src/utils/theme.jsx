import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#39C7AD',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#39C7AD',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#303030',
      paper: '#424242',
    },
  },
});