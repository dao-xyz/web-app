import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import React, { FC, useContext, useMemo } from "react";
import {
    ConnectionProvider,
    useConnection,
    useWallet,
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

import { clusterApiUrl, Transaction } from "@solana/web3.js";
import { UserAccount } from "@solvei/solvei-client/schema";
import { createUserTransaction, getUser } from "@solvei/solvei-client";
import { NetworkContext } from "../components/Wallet/Network";

export const UserContext = React.createContext({
    createUser: async (username: string) => { }

});

export const UserNetwork = ({ children }: { children: JSX.Element }) => {

    const [user, setUser] = React.useState<UserAccount | null>(null);
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const { config } = useContext(NetworkContext);
    const userMemo = React.useMemo(
        () => ({
            // The dark mode switch would invoke this method
            createUser: async (username: string) => {
                if (publicKey) {
                    const [transaction, userKey] = await createUserTransaction(username, publicKey, config.programId);
                    await sendTransaction(new Transaction().add(transaction), connection)
                    const newUser = await getUser(userKey, connection)
                    setUser(newUser)
                }

                throw new Error("Can not create user since no Wallet is connected");
            }
        }),
        []
    );



    return (
        <UserContext.Provider value={userMemo}>
            {children}
        </UserContext.Provider>
    );
}
