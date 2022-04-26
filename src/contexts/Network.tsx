import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import React, { FC, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import { clusterApiUrl } from "@solana/web3.js";
import {
  getNetworkConfig,
  getNetworkConfigFromPathParam,
  getPathForNetwork,
  getWalletAdapterNetwork,
  NetworkXYZ,
} from "../utils/network";
import { useParams } from "react-router-dom";
import { walletConnectClickOnce } from "../components/network/Wallet/Wallet";

export const NetworkContext = React.createContext({
  changeNetwork: (network: NetworkXYZ, pathname: string) => { },
  config: getNetworkConfig(NetworkXYZ.Mainnet),
  // getPathWithNetwork: (href: string): string => ''
});

export const useNetwork = () => React.useContext(NetworkContext);

/* const STORAGE_KEY_PREFERRED_NETWORK = "settings.network"
const getPreferedNetwork = () => {
    const n = localStorage.get(STORAGE_KEY_PREFERRED_NETWORK);
    if (!n)
        return undefined
    return getNetworkConfig(WalletAdapterNetwork[n as keyof typeof WalletAdapterNetwork]);

}
const PREFERRED_NETWORK = getPreferedNetwork(); */
const getMasterNetwork = (): NetworkXYZ => {
  if (!process.env.REACT_APP_NETWORK) return NetworkXYZ.Mainnet;
  if (process.env.REACT_APP_NETWORK == "devnet") return NetworkXYZ.Devnet;
  if (process.env.REACT_APP_NETWORK == "testnet") return NetworkXYZ.Testnet;
  if (process.env.REACT_APP_NETWORK == "localhost") return NetworkXYZ.Localhost;
  throw Error("Undefiend network from configuration: " + process.env);
};
export const Network = ({ children }: { children: JSX.Element }) => {
  const config = getNetworkConfigFromPathParam(useParams());
  const [network, setNetwork] = React.useState<NetworkXYZ>(getMasterNetwork()); // config?.type ? config?.type :

  //const [autoConnect, setAutoConnect] = React.useState(true);

  const networkMemo = React.useMemo(
    () => ({
      // The dark mode switch would invoke this method
      changeNetwork: (network: NetworkXYZ, pathname: string) => {
        window.location.href =
          window.location.origin + getPathForNetwork(network, pathname);
        setNetwork(network);
      },
      config: getNetworkConfig(network),
      /*   getPathWithNetwork: (href: string) => {
                  const path = "/" + getNetworkConfig(network).path;
                  if (href)
                      return path + "/" + href;
                  return path
              } */
    }),
    [network]
  );
  const endpoint = useMemo(() => {
    const networkWallet = getWalletAdapterNetwork(network);
    if (network) {
      return clusterApiUrl(networkWallet);
    } else {
      return "http://localhost:8899";
    }
  }, [network]);
  const walletConnectedOnce = walletConnectClickOnce();
  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking --
  // Only the wallets you configure here will be compiled into your application
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network: getWalletAdapterNetwork(network) }),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network: getWalletAdapterNetwork(network) }),
      new SolletExtensionWalletAdapter({
        network: getWalletAdapterNetwork(network),
      }),
    ],
    [network]
  );

  return (
    <NetworkContext.Provider value={networkMemo}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect={walletConnectedOnce}>
          {children}
        </WalletProvider>
      </ConnectionProvider>
    </NetworkContext.Provider>
  );
};
