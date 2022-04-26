import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate, HashRouter } from "react-router-dom";
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
import { getNetworkConfigFromPathParam } from "./utils/network";
import { AlertProvider } from "./contexts/AlertContext";
import { BaseRoutes } from "./routes/routes";
import { EncryptionProvider } from "./contexts/EncryptionContext";
import { IpfsServiceProvider } from "./contexts/IpfsServiceContext";
import { AccountProvider } from "./contexts/AccountContext";
import ResponsiveDrawer from "./pages/channel/ContentOutlet";
import ContentOutlet from "./pages/channel/ContentOutlet";
import { ChannelsProvider } from "./contexts/ChannelsContext";
import { SmartWalletProvider } from "./contexts/SmartWalletContext";
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
        <HashRouter basename="/">

          <CssBaseline>
            <Network>
              <AlertProvider>
                <AccountProvider>
                  <IpfsServiceProvider>
                    {/*               <EncryptionProvider>
                 */}
                    <UserProvider>
                      <SmartWalletProvider>
                        <ChannelsProvider>
                          <Box>
                            <Box className="column" sx={{ width: "100%" }}>
                              {/*  <Toolbar variant="dense" />*/}
                              <ContentOutlet />
                              {/*  <Box sx={{ padding: 2 }}>
                           
                          </Box> */}
                            </Box>
                          </Box>
                        </ChannelsProvider>
                      </SmartWalletProvider>
                    </UserProvider>
                  </IpfsServiceProvider>
                  {/*                  
                </EncryptionProvider> */}
                </AccountProvider>
              </AlertProvider>
            </Network>
          </CssBaseline>
        </HashRouter>

      </ThemeProvider>
    </ColorModeContext.Provider >
  );
}
export default App;
