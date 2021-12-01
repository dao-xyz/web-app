import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import React, { FC, useContext, useEffect, useMemo } from "react";
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
import { createUserTransaction, getUser, getUserByOwner } from "@solvei/solvei-client";
import { NetworkContext } from "../components/Wallet/Network";
import RedirectDialog from "../components/dialogs/RedirectDialog/RedirectDialog";
import { useLocation } from "react-router";

interface IUserContext {
    createUser: (username: string) => Promise<void>,
    user: UserAccount | null
}
export const UserContext = React.createContext<IUserContext>({
    createUser: async (username: string) => { },
    user: null

});

export const UserProvider = ({ children }: { children: JSX.Element }) => {

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [user, setUser] = React.useState<UserAccount | null>(null);
    const [missingUser, setMissingUser] = React.useState<boolean>(false);
    const { config, getPathWithNetwork } = React.useContext(NetworkContext);

    useEffect(() => {
        if (publicKey) {
            // check if user exist
            getUserByOwner(publicKey, connection, config.programId).then((user) => {
                if (!user) {
                    setMissingUser(true);
                }
                else {
                    setUser(user);
                }
            })
        }
    }, [publicKey])

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
            },
            user: user
        }),
        []
    );


    // If connected but no user account exist then create it!

    return (
        <UserContext.Provider value={userMemo}>
            <RedirectDialog
                title={"No user account associated with this wallet on this network: " + config.name}
                content="In order to create posts, channels and interact with the content on this site you need a user account. Create one now?"
                redirectPath={getPathWithNetwork("/user/new")}
                open={missingUser} onClose={() => {
                    setMissingUser(false);
                }} />
            {children}
        </UserContext.Provider>
    );
}
