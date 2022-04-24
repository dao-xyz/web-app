import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { Params, useParams } from "react-router";

export interface NetworkConfig {
  type: NetworkXYZ;
  name: string;
  rpcUrl: string;
  path: string;
}

export enum NetworkXYZ {
  Mainnet = "Mainnet",
  Testnet = "Testnet",
  Devnet = "Devnet",
  Localhost = "Localhost",
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

const LOCALHOST: NetworkConfig = {
  type: NetworkXYZ.Localhost,
  name: "localhost",
  rpcUrl: "http://localhost:8899",
  path: "localhost",
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
    default:
      return undefined;
  }
};
export const ALL_CONFIGS = [MAIN_NET, TEST_NET, DEV_NET];

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
  return currentPath;
};
