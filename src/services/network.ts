import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PublicKey } from "@solana/web3.js";

export interface NetworkConfig {
    rpcUrl: string,
    programId: PublicKey
}

const MAIN_NET: NetworkConfig = {
    rpcUrl: "https://api.mainnet-beta.solana.com",
    programId: new PublicKey("DYTqD3bSsCwCqTuV9Ver7LjHhghqLLsVmQVxHsD8pjMs") // TODO FIX WRONG ADDRESS
};
const DEV_NET: NetworkConfig = {
    rpcUrl: "https://api.devnet.solana.com",
    programId: new PublicKey("DYTqD3bSsCwCqTuV9Ver7LjHhghqLLsVmQVxHsD8pjMs")
};


export const getNetworkConfig = (type: WalletAdapterNetwork) => {
    if (type == WalletAdapterNetwork.Devnet)
        return DEV_NET
    if (type == WalletAdapterNetwork.Testnet)
        throw new Error("Unsupported network")
    throw MAIN_NET
}

