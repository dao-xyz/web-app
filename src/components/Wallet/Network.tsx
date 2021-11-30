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
import { getNetworkConfig } from "../../services/network";

export const NetworkContext = React.createContext({
    changeNetwork: (network: WalletAdapterNetwork) => { },
    config: getNetworkConfig(WalletAdapterNetwork.Devnet)
});

export const Network = ({ children }: { children: JSX.Element }) => {

    const [network, setNetwork] = React.useState<WalletAdapterNetwork>(WalletAdapterNetwork.Mainnet);
    const [autoConnect, setAutoConnect] = React.useState(true);

    const networkMemo = React.useMemo(
        () => ({
            // The dark mode switch would invoke this method
            changeNetwork: (network: WalletAdapterNetwork) => {
                setNetwork((_) => {
                    // we have to disable autoconnect when changing network for some reason
                    setAutoConnect(false)
                    setTimeout(() => {
                        setAutoConnect(true)
                    }, 1000);
                    return network
                })

            },
            config: getNetworkConfig(network)
        }),
        [network]
    );
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

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
                <WalletProvider wallets={wallets} autoConnect={autoConnect}>
                    {children}
                </WalletProvider>
            </ConnectionProvider>
        </NetworkContext.Provider>
    );
}
