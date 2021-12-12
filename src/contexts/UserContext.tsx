import React, { useEffect } from "react";
import {
    useConnection,
    useWallet,
} from "@solana/wallet-adapter-react";
import { UserAccount } from "@solvei/solvei-client/schema";
import { AccountDeserialized } from "@solvei/solvei-client/models";
import { createUserTransaction, getUserByName, getUsersByOwner } from "@solvei/solvei-client";
import { NetworkContext } from "./Network";
import RedirectDialog from "../components/dialogs/RedirectDialog/RedirectDialog";
import { Transaction } from "@solana/web3.js";
import { USER_NEW } from "../routes/routes";
import { useLocation } from "react-router";

interface IUserContext {
    createUser: (username: string) => Promise<void>,
    setUser: (user: AccountDeserialized<UserAccount>) => void,
    user: AccountDeserialized<UserAccount> | null
}
export const UserContext = React.createContext<IUserContext>({
    createUser: async (_: string) => { },
    setUser: (_: AccountDeserialized<UserAccount>) => { },
    user: null

});
const STORAGE_KEY_MISSING_USER_EVENT = "dialogs.missing_user"
const STORAGE_KEY_PREFRERRED_USER = "settings.preffered_user"

export const UserProvider = ({ children }: { children: JSX.Element }) => {

    const { connection } = useConnection();
    const location = useLocation();
    const { publicKey, sendTransaction } = useWallet();
    const [user, setUser] = React.useState<AccountDeserialized<UserAccount> | null>(null);
    const [missingUserNotified, setMissingUserNotified] = React.useState<boolean>(localStorage.getItem(STORAGE_KEY_MISSING_USER_EVENT) === "true");

    const network = React.useContext(NetworkContext);
    const preferredUser = localStorage.getItem(STORAGE_KEY_PREFRERRED_USER);

    useEffect(() => {
        if (publicKey) {
            // check if user exist

            if (preferredUser) {

                getUserByName(preferredUser, connection, network.config.programId).then((userByName) => {
                    if (userByName) {

                        setUser(userByName);
                    }
                    console.log("FOUND USER?", userByName)

                })
            }
            else {
                // get first user

                getUsersByOwner(publicKey, connection, network.config.programId).then((users) => {
                    if (users?.length > 0) {
                        const user = users[0];
                        if (!user) {
                            setMissingUserNotified(false);
                        }
                        else {
                            setUser(user);
                        }
                    }
                })

            }


        }
    }, [publicKey, user?.data?.name])

    const userMemo = React.useMemo(
        () => ({

            createUser: async (username: string) => {
                if (publicKey) {
                    const [transaction, c] = await createUserTransaction(username, publicKey, network.config.programId);
                    const signature = await sendTransaction(new Transaction().add(transaction), connection);
                    await connection.confirmTransaction(signature);
                    const newUser = await getUserByName(username, connection, network.config.programId)
                    // Set user to new user
                    localStorage.setItem(STORAGE_KEY_PREFRERRED_USER, newUser.data.name);
                    setUser(newUser)
                }
                else {
                    throw new Error("Can not create user since no Wallet is connected");

                }
            },

            setUser: (user: AccountDeserialized<UserAccount>) => {
                localStorage.setItem(STORAGE_KEY_PREFRERRED_USER, user.data.name);
                setUser(user);
            },
            user: user
        }),
        [publicKey, user]
    );


    // If connected but no user account exist then create it!

    return (
        <UserContext.Provider value={userMemo}>
            <RedirectDialog
                title={"No user account associated with this wallet on this network: " + network.config.name}
                content="In order to create posts, channels and interact with the content on this site you need a user account. Create one now?"
                redirectPath={network.getPathWithNetwork(USER_NEW)}
                open={!!publicKey && !missingUserNotified && network.getPathWithNetwork(USER_NEW) != location.pathname}
                onClose={() => {
                    localStorage.setItem(STORAGE_KEY_MISSING_USER_EVENT, "true");
                    setMissingUserNotified(true);
                }}
            />
            {children}
        </UserContext.Provider>
    );
}
