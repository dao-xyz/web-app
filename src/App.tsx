import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import {
  createTheme,
  CssBaseline,
  PaletteMode,
  ThemeProvider,
} from "@mui/material";
import { getDesignTokens } from "./styles/theme";
import Box from "@mui/material/Box";
import Header from "./components/Header/Header";
import { NewChannel } from "./pages/channels/NewChannnel/NewChannel";
import { MyChannels } from "./pages/channels/MyChannels/MyChannels";

import { Network } from "./components/Wallet/Network";

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
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <Network>
          <Box sx={{ display: "flex" }}>
            <CssBaseline>
              <Router basename='/' >
                <Header />
                <Routes >
                  <Route path="/channels/my" element={<MyChannels />} />
                </Routes>
                <Routes >
                  <Route path="/channels/new" element={<NewChannel />} />
                </Routes>
                <Routes >
                  <Route path="/" element={<Home />} />
                </Routes>
              </Router>
            </CssBaseline>
          </Box>
        </Network>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
export default App;
