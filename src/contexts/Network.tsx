import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import React, { FC, useMemo } from "react";
import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react";
import {
    getLedgerWallet,
    getPhantomWallet,
    getSlopeWallet,
    getSolflareWallet,
    getSolletExtensionWallet,
    getSolletWallet,
    getTorusWallet,
} from "@solana/wallet-adapter-wallets";

import { clusterApiUrl } from "@solana/web3.js";
import { getNetworkConfig, getNetworkConfigFromPathParam, getPathForNetwork } from "../services/network";
import { useParams } from "react-router-dom";
import { walletConnectClickOnce } from "../components/network/Wallet/Wallet";

export const NetworkContext = React.createContext({
    changeNetwork: (network: WalletAdapterNetwork, pathname: string) => { },
    config: getNetworkConfig(WalletAdapterNetwork.Testnet),
    getPathWithNetwork: (href: string): string => ''
});

/* const STORAGE_KEY_PREFERRED_NETWORK = "settings.network"
const getPreferedNetwork = () => {
    const n = localStorage.get(STORAGE_KEY_PREFERRED_NETWORK);
    if (!n)
        return undefined
    return getNetworkConfig(WalletAdapterNetwork[n as keyof typeof WalletAdapterNetwork]);

}
const PREFERRED_NETWORK = getPreferedNetwork(); */

export const Network = ({ children }: { children: JSX.Element }) => {
    const params = useParams()

    const config = getNetworkConfigFromPathParam(useParams());
    const [network, setNetwork] = React.useState<WalletAdapterNetwork>(config?.type ? config?.type : WalletAdapterNetwork.Testnet);
    //const [autoConnect, setAutoConnect] = React.useState(true);

    const networkMemo = React.useMemo(
        () => ({
            // The dark mode switch would invoke this method
            changeNetwork: (network: WalletAdapterNetwork, pathname: string) => {
                window.location.href = window.location.origin + getPathForNetwork(network, pathname)
                setNetwork(network)

            },
            config: getNetworkConfig(network),
            getPathWithNetwork: (href: string) => {
                const path = "/" + getNetworkConfig(network).path;
                if (href)
                    return path + "/" + href;
                return path
            }

        }),
        [network]
    );
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const walletConnectedOnce = walletConnectClickOnce()
    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking --
    // Only the wallets you configure here will be compiled into your application
    const wallets = useMemo(
        () => [
            getPhantomWallet(),
            getSlopeWallet(),
            getSolflareWallet(),
            getTorusWallet({
                options: { clientId: "Get a client ID @ https://developer.tor.us" },
            }),
            getLedgerWallet(),
            getSolletWallet({ network }),
            getSolletExtensionWallet({ network }),
        ],
        [network]
    );


    return (
        <NetworkContext.Provider value={networkMemo}>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect={walletConnectedOnce} >
                    {children}
                </WalletProvider>
            </ConnectionProvider>
        </NetworkContext.Provider>
    );
}
