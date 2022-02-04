import React, { FC, useMemo } from "react";

import { IpfsServiceMultiButtonMui } from "./IpfsServiceMultiButton";
import { ButtonProps } from "@mui/material";
import { IpfsServiceModalProvider } from "./IpfsServiceModalProvider";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");
const STORAGE_KEY_CONNECT_CLICK_ONCE = "wallet.connected_click_once"

export const walletConnectClickOnce = (): boolean => localStorage.getItem(STORAGE_KEY_CONNECT_CLICK_ONCE) === "true"
const walletConnectClicked = (): void => localStorage.setItem(STORAGE_KEY_CONNECT_CLICK_ONCE, "true")

export const IpfsServiceProviderButton: FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <IpfsServiceModalProvider logo="https://avatars.githubusercontent.com/u/10536621?s=200&v=4">
      <IpfsServiceMultiButtonMui onWalletModalClick={walletConnectClicked} {...props} />
    </IpfsServiceModalProvider>
  )
};

// onClick={() => localStorage.setItem(STORAGE_KEY_CONNECT_CLICK_ONCE, "true")}