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
import { Params, useParams } from "react-router";

import { clusterApiUrl } from "@solana/web3.js";
import {
  NetworkXYZ,
} from "../utils/network";
import { walletConnectClickOnce } from "../components/network/Wallet/Wallet";
import { MetaMaskWalletAdapter } from "./MetamaskWallet";


export interface NetworkConfig {
  type: NetworkXYZ;
  name: string;
  rpcUrl: string;
  path: string;
}



const MAIN_NET: NetworkConfig = {
  type: NetworkXYZ.Mainnet,
  name: "Mainnet",
  rpcUrl: "https://api.mainnet-beta.solana.com",
  path: "main",
};
const TEST_NET: NetworkConfig = {
  type: NetworkXYZ.Testnet,
  name: "Testnet",
  rpcUrl: "https://api.testnet.solana.com",
  path: "testnet",
};

const DEV_NET: NetworkConfig = {
  type: NetworkXYZ.Devnet,
  name: "devnet",
  rpcUrl: "https://api.devnet.solana.com",
  path: "devnet",
};

const MOCK_NET: NetworkConfig = {
  ...DEV_NET,
  name: "mock",
  path: "mock",
  type: NetworkXYZ.Mock,

};

const LOCALHOST: NetworkConfig = {
  type: NetworkXYZ.Localhost,
  name: "localhost",
  rpcUrl: "http://localhost:8899",
  path: "localhost",
};

export const ALL_CONFIGS = [MAIN_NET, TEST_NET, DEV_NET, MOCK_NET];

export const getNetworkConfig = (type: NetworkXYZ): NetworkConfig => {
  const network = ALL_CONFIGS.find((config) => config.type === type);
  if (!network) {
    throw Error("No network found for type: " + type);
  }
  return network as NetworkConfig;
};

export const getNetworkConfigFromPathParam = (
  params: Readonly<Params<"network">>
) => {
  for (const config of ALL_CONFIGS) {
    if (params.network == config.path) return config;
  }
  return undefined;
};

export const getNetworkConfigFromPath = (
  currentPath: string
): NetworkConfig => {
  for (const config of ALL_CONFIGS) {
    if (
      currentPath.startsWith(`/${config.path}/`) ||
      currentPath == `/${config.path}`
    )
      return config;
  }

  return MAIN_NET;
};

export const getPathForNetwork = (network: NetworkXYZ, currentPath: string) => {

  return currentPath;
};


export const NetworkContext = React.createContext({
  /*  changeNetwork: (network: NetworkXYZ, pathname: string) => { },*/
  config: getNetworkConfig(NetworkXYZ.Mainnet),
  /*   isMock: false, */
  // getPathWithNetwork: (href: string): string => ''
});

export const useNetwork = () => React.useContext(NetworkContext);

const STORAGE_KEY_PREFERRED_NETWORK = "settings.network"
/* const getPreferedNetwork = () => {
  const n = localStorage.get(STORAGE_KEY_PREFERRED_NETWORK);
  if (!n)
    return undefined
  return getNetworkConfig(WalletAdapterNetwork[n as keyof typeof WalletAdapterNetwork]);

} */
const PREFERRED_NETWORK = NetworkXYZ.Mainnet; //getPreferedNetwork();
const getMasterNetwork = (): NetworkXYZ => {
  if (!process.env.REACT_APP_NETWORK) return NetworkXYZ.Mock;
  if (process.env.REACT_APP_NETWORK == "devnet") return NetworkXYZ.Devnet;
  if (process.env.REACT_APP_NETWORK == "testnet") return NetworkXYZ.Testnet;
  if (process.env.REACT_APP_NETWORK == "localhost") return NetworkXYZ.Localhost;
  if (process.env.REACT_APP_NETWORK == "mainnet") return NetworkXYZ.Mainnet;
  if (process.env.REACT_APP_NETWORK == "mock") return NetworkXYZ.Mock;
  throw Error("Undefiend network from configuration: " + process.env);
};


export const getWalletAdapterNetwork = (
  network: NetworkXYZ
): WalletAdapterNetwork | undefined => {
  switch (network) {
    case NetworkXYZ.Devnet:
      return WalletAdapterNetwork.Devnet;
    case NetworkXYZ.Testnet:
      return WalletAdapterNetwork.Testnet;
    case NetworkXYZ.Mainnet:
      return WalletAdapterNetwork.Mainnet;
    case NetworkXYZ.Mock:
      return WalletAdapterNetwork.Devnet;
    default:
      return undefined;
  }
};

/* const currentNetworkFromPath = getNetworkConfigFromPath(currentPath);

   if (currentNetworkFromPath.type == network) {
       return currentPath;
   }
   const configFromNetwork = getNetworkConfig(network);
   if (currentPath == `/${currentNetworkFromPath.path}`)
       return '/' + configFromNetwork.path

   if (currentPath.startsWith(`/${currentNetworkFromPath.path}/`))
       return '/' + configFromNetwork.path + currentPath.split(`/${currentNetworkFromPath.path}`)[1];
   return currentPath; */


export const Network = ({ children }: { children: JSX.Element }) => {
  /*   const config = getNetworkConfigFromPathParam(useParams());
   */
  const [network, setNetwork] = React.useState<NetworkXYZ>(getMasterNetwork()); // config?.type ? config?.type :

  //const [autoConnect, setAutoConnect] = React.useState(true);

  const networkMemo = React.useMemo(
    () => ({
      // The dark mode switch would invoke this method
      /*  changeNetwork: (network: NetworkXYZ, pathname: string) => {
         window.location.href =
           window.location.origin + getPathForNetwork(network, pathname);
         setNetwork(network);
       },
       isMock: network == NetworkXYZ.Mock, */
      config: getNetworkConfig(network),

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
      new MetaMaskWalletAdapter(),
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
