import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate, HashRouter } from "react-router-dom";
import {
  createTheme,
  CssBaseline,
  PaletteMode,
  ThemeProvider,
} from "@mui/material";
import { getDesignTokens } from "./styles/theme";
import Box from "@mui/material/Box";
/* import { Network } from "./contexts/Network";*/
import { UserProvider } from "./contexts/UserContext";
import { AlertProvider } from "./contexts/AlertContext";
import { IpfsServiceProvider } from "./contexts/IpfsServiceContext";
import { AccountProvider } from "./contexts/AccountContext";
import ContentOutlet from "./pages/channel/ContentOutlet";
import { PostsProvider } from "./contexts/PostContext";
import { FeatureProvider } from "./contexts/FeatureContext";
import { PeerProvider } from "./contexts/PeerContext";
import { ConfigProvider } from "./contexts/ConfigContext";
import { WalletProvider } from "@solana/wallet-adapter-react";
import { AnyWalletProvider } from "./contexts/AnyWalletContext";
import { ConnectContextProvider } from "./contexts/ConnectContext";
import { Network, NetworkContext } from "./contexts/SolanaNetwork";
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
            <ConfigProvider>
              <Network>
                <AnyWalletProvider>
                  <ConnectContextProvider>
                    <PeerProvider>
                      <AlertProvider>
                        <AccountProvider>
                          <IpfsServiceProvider>

                            <UserProvider>
                              <PostsProvider>
                                <FeatureProvider>
                                  <Box className="column" sx={{ width: "100%" }}>
                                    <ContentOutlet />

                                  </Box>
                                </FeatureProvider>
                              </PostsProvider>
                            </UserProvider>
                          </IpfsServiceProvider>

                        </AccountProvider>
                      </AlertProvider>
                    </PeerProvider>
                  </ConnectContextProvider>
                </AnyWalletProvider>
              </Network>
            </ConfigProvider>
          </CssBaseline>
        </HashRouter>

      </ThemeProvider>
    </ColorModeContext.Provider >
  );
}
export default App;
