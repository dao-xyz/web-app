import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import {
  createTheme,
  CssBaseline,
  PaletteMode,
  ThemeProvider,
  Toolbar,
} from "@mui/material";
import { getDesignTokens } from "./styles/theme";
import Box from "@mui/material/Box";
import Header from "./components/Header/Header";
import { NewChannel } from "./pages/channels/NewChannnel/NewChannel";
import { MyChannels } from "./pages/channels/MyChannels/MyChannels";

import { Network } from "./components/Wallet/Network";
import { UserProvider } from "./contexts/UserContext";
import { NewUser } from "./pages/user/NewUser/NewUser";
import { ConditionalRedirect } from "./components/navigation/ConditionalRedirect";
import { getNetworkConfigFromPath, getNetworkConfigFromPathParam } from "./services/network";

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
          <UserProvider>
            <Box sx={{ display: "flex" }}>
              <CssBaseline>
                <Router basename='/' >
                  <Routes >
                    <Route path=":network/*" element={<>
                      <ConditionalRedirect validatePath={(_, params) => !!getNetworkConfigFromPathParam(params)} to="/main" >
                        <Header />
                        <Box className="column" sx={{ width: "100%" }}>
                          <Toolbar />
                          <Box sx={{ padding: 2 }}>
                            <Routes>
                              <Route path="user/new" element={<NewUser />} />
                              <Route path="channels/my" element={<MyChannels />} />
                              <Route path="channels/new" element={<NewChannel />} />
                              <Route path="/" element={<Home />} />
                            </Routes>
                          </Box>
                        </Box>
                      </ConditionalRedirect>
                    </>} />
                  </Routes>
                </Router>
              </CssBaseline>
            </Box>
          </UserProvider>
        </Network>
      </ThemeProvider>
    </ColorModeContext.Provider >
  );
}
export default App;
