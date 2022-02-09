import { Location } from "history";
import { getNetworkConfigFromPath, getPathForNetwork, NetworkConfig } from "../services/network";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

export const REDIRECT_URL_PARAM_KEY = "redir"

export const getRedirect = (location: Location, network: WalletAdapterNetwork): string | null => {
    const urlSearchParams = new URLSearchParams(location.search);
    const path = urlSearchParams.get(REDIRECT_URL_PARAM_KEY)
    if (path)
        return getPathForNetwork(network, path)
    return null

}