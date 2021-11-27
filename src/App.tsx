import React, { useState } from "react";
import logo from "./logo.png";
import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import {
  createTheme,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  PaletteMode,
  ThemeProvider,
} from "@mui/material";
import { getDesignTokens } from "./styles/theme";
import Box from "@mui/material/Box";
import Header from "./components/Header";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
export const ColorModeContext = React.createContext({
  toggleColorMode: () => { }, // For some reason this should just be like this
});
const drawerWidth = 250;

function App() {
  const [mode, setMode] = React.useState<PaletteMode>("dark");
  const colorMode = React.useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === "light" ? "dark" : "light"
        );
      },
    }),
    []
  );

  // Update the theme only if the mode changes
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  //const [theme, setTheme] = useState(lightTheme);

  return (
    <div className="App">
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <Box sx={{ display: "flex" }}>
            <CssBaseline>
              {/* <Header/>
              
              <Button onClick={toggleTheme} variant="contained" color="primary">Toggle theme</Button>
              <h1>It's a light theme!</h1> */}

              <Header />
              <Router basename='/' >
                <Routes >
                  <Route path="/" element={<Home />} />
                </Routes>
              </Router>
            </CssBaseline>
          </Box>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </div>
  );
}
export default App;
