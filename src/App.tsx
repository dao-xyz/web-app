import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import { Network } from "./contexts/Network";
import { UserProvider } from "./contexts/UserContext";
import { ConditionalRedirect } from "./components/navigation/ConditionalRedirect";
import { getNetworkConfigFromPathParam } from "./services/network";
import { AlertProvider } from "./contexts/AlertContext";
import { ContentRoutes } from "./routes/routes";
import { ChannelsProvider } from "./contexts/ChannelsContext";

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

        <Box >
          <CssBaseline>
            <Router basename='/' >
              <Routes >
                <Route path="/" element={
                  <Navigate to="/main" />
                } />
                {<Route path=":network/*" element={<>
                  <Network>
                    <AlertProvider>
                      <ChannelsProvider>
                        <UserProvider>
                          <ConditionalRedirect validatePath={(_, params) => !!getNetworkConfigFromPathParam(params)} to="/" >
                            <Header />
                            <Box className="column" sx={{ width: "100%" }}>
                              <Toolbar />
                              <Box sx={{ padding: 2 }}>
                                <ContentRoutes />
                              </Box>
                            </Box>
                          </ConditionalRedirect>
                        </UserProvider>
                      </ChannelsProvider>
                    </AlertProvider>
                  </Network>
                </>} />}


              </Routes>
            </Router>
          </CssBaseline>
        </Box>

      </ThemeProvider>
    </ColorModeContext.Provider >
  );
}
export default App;
