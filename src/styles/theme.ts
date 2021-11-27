/* export const lightTheme: ThemeInterface = {
    body: '#E2E2E2',
    text: '#363537',
    toggleBorder: '#FFF',
    gradient: 'linear-gradient(#39598A, #79D7ED)',
}
  
export const darkTheme: ThemeInterface = {
    body: '#363537',
    text: '#FAFAFA',
    toggleBorder: '#6B8096',
    gradient: 'linear-gradient(#091236, #1E215D)',
}


export  interface ThemeInterface {
    body: string,
    text: string,
    toggleBorder: string,
    gradient: string,
} */

import { createTheme, PaletteMode } from "@mui/material";
import { amber, blue, deepOrange, grey, lightBlue } from "@mui/material/colors";

declare module "@mui/material/styles" {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // palette values for light mode
          primary: blue,
          divider: blue[200],
          text: {
            primary: grey[900],
            secondary: grey[800],
          },
        }
      : {
          // palette values for dark mode
          primary: lightBlue,
          divider: lightBlue[200],
          background: {
            //default: deepOrange[900],
            //paper: deepOrange[900],
          },
          text: {
            primary: grey[100],
            secondary: grey[500],
          },
        }),
  },
});
