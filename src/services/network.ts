import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PublicKey } from "@solana/web3.js";
import { NetworkType } from "../types/chain";

export interface NetworkConfig {
    rpcUrl: string,
    programId: PublicKey
}

const MAIN_NET: NetworkConfig = {
    rpcUrl: "https://api.mainnet-beta.solana.com",
    programId: new PublicKey("5mjy8kWLEFyLCyoZBSrWSSh7TioQevz93TqeA5D8PguP") // TODO FIX WRONG ADDRESS
};
const DEV_NET: NetworkConfig = {
    rpcUrl: "https://api.devnet.solana.com",
    programId: new PublicKey("5mjy8kWLEFyLCyoZBSrWSSh7TioQevz93TqeA5D8PguP")
};


export const getNetworkConfig = (type: NetworkType) => {
    if (type == 'devnet')
        return DEV_NET
    throw MAIN_NET
}
export const getWalletAdapterNetwork = (type: NetworkType) => {
    if (type == 'devnet')
        return WalletAdapterNetwork.Devnet
    return WalletAdapterNetwork.Mainnet
}

