import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PublicKey } from "@solana/web3.js";
import { config } from "process";
import { Params, useParams } from "react-router";

export interface NetworkConfig {
    type: WalletAdapterNetwork,
    name: string,
    rpcUrl: string,
    programId: PublicKey,
    path: string
}

const MAIN_NET: NetworkConfig = {
    type: WalletAdapterNetwork.Mainnet,
    name: "Mainnet",
    rpcUrl: "https://api.mainnet-beta.solana.com",
    programId: new PublicKey("DYTqD3bSsCwCqTuV9Ver7LjHhghqLLsVmQVxHsD8pjMs"), // TODO FIX WRONG ADDRESS
    path: 'main'
};
const DEV_NET: NetworkConfig = {
    type: WalletAdapterNetwork.Devnet,
    name: "Devnet",
    rpcUrl: "https://api.devnet.solana.com",
    programId: new PublicKey("DYTqD3bSsCwCqTuV9Ver7LjHhghqLLsVmQVxHsD8pjMs"),
    path: 'dev'
};
export const ALL_CONFIGS = [MAIN_NET, DEV_NET]

export const getNetworkConfig = (type: WalletAdapterNetwork) => {
    if (type == WalletAdapterNetwork.Devnet)
        return DEV_NET
    if (type == WalletAdapterNetwork.Testnet) {
        throw new Error("Unsupported network")
    }
    return MAIN_NET
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

    const currentNetworkFromPath = getNetworkConfigFromPath(currentPath);

    if (currentNetworkFromPath.type == network) {
        return currentPath;
    }
    const configFromNetwork = getNetworkConfig(network);
    if (currentPath == `/${currentNetworkFromPath.path}`)
        return '/' + configFromNetwork.path

    if (currentPath.startsWith(`/${currentNetworkFromPath.path}/`))
        return '/' + configFromNetwork.path + currentPath.split(`/${currentNetworkFromPath.path}`)[1];
    return currentPath;

}