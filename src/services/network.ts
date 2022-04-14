import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { Params, useParams } from "react-router";

export interface NetworkConfig {
    type: WalletAdapterNetwork,
    name: string,
    rpcUrl: string,
    path: string
}

const MAIN_NET: NetworkConfig = {
    type: WalletAdapterNetwork.Mainnet,
    name: "Mainnet",
    rpcUrl: "https://api.mainnet-beta.solana.com",
    path: 'main'
};
const TEST_NET: NetworkConfig = {
    type: WalletAdapterNetwork.Testnet,
    name: "Testnet",
    rpcUrl: "https://api.testnet.solana.com",
    path: 'testnet'
};

const DEV_NET: NetworkConfig = {
    type: WalletAdapterNetwork.Devnet,
    name: "devnet",
    rpcUrl: "https://api.devnet.solana.com",
    path: 'devnet'
};

export const ALL_CONFIGS = [MAIN_NET, TEST_NET, DEV_NET]

export const getNetworkConfig = (type: WalletAdapterNetwork): NetworkConfig => {
    const network = ALL_CONFIGS.find((config) => config.type === type)
    if (!network) {
        throw Error("No network found for type: " + type)
    }
    return network as NetworkConfig;
}



export const getNetworkConfigFromPathParam = (params: Readonly<Params<"network">>) => {
    for (const config of ALL_CONFIGS) {
        if (params.network == config.path)
            return config
    }
    return undefined
}



export const getNetworkConfigFromPath = (currentPath: string): NetworkConfig => {
    for (const config of ALL_CONFIGS) {
        if (currentPath.startsWith(`/${config.path}/`) || (currentPath == `/${config.path}`))
            return config
    }

    return MAIN_NET;
}



export const getPathForNetwork = (network: WalletAdapterNetwork, currentPath: string) => {

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

}