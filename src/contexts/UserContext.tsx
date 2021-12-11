import React, { useEffect } from "react";
import {
    useConnection,
    useWallet,
} from "@solana/wallet-adapter-react";
import { UserAccount } from "@solvei/solvei-client/schema";
import { createUserTransaction, getUserByName, getUsersByOwner } from "@solvei/solvei-client";
import { NetworkContext } from "./Network";
import RedirectDialog from "../components/dialogs/RedirectDialog/RedirectDialog";
import { Transaction } from "@solana/web3.js";
import { USER_NEW } from "../routes/routes";
import { useLocation } from "react-router";

interface IUserContext {
    createUser: (username: string) => Promise<void>,
    setUser: (user: UserAccount) => void,
    user: UserAccount | null
}
export const UserContext = React.createContext<IUserContext>({
    createUser: async (_: string) => { },
    setUser: (_: UserAccount) => { },
    user: null

});
const STORAGE_KEY_MISSING_USER_EVENT = "dialogs.missing_user"
const STORAGE_KEY_PREFRERRED_USER = "settings.preffered_user"

export const UserProvider = ({ children }: { children: JSX.Element }) => {

    const { connection } = useConnection();
    const location = useLocation();
    const { publicKey, sendTransaction } = useWallet();
    const [user, setUser] = React.useState<UserAccount | null>(null);
    const [missingUserNotified, setMissingUserNotified] = React.useState<boolean>(localStorage.getItem(STORAGE_KEY_MISSING_USER_EVENT) === "true");

    const network = React.useContext(NetworkContext);
    useEffect(() => {
        if (publicKey) {
            // check if user exist
            const preferredUser = localStorage.getItem(STORAGE_KEY_PREFRERRED_USER);
            console.log("PREFERED USER?", user)

            if (preferredUser) {
                getUserByName(preferredUser, connection, network.config.programId).then((users) => {
                    if (user) {
                        console.log("PREFERED USER", user)

                        setUser(user);
                    }
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
    }, [publicKey, user?.name])

    const userMemo = React.useMemo(
        () => ({

            createUser: async (username: string) => {
                if (publicKey) {
                    const [transaction, c] = await createUserTransaction(username, publicKey, network.config.programId);
                    const signature = await sendTransaction(new Transaction().add(transaction), connection);
                    await connection.confirmTransaction(signature);
                    const newUser = await getUserByName(username, connection, network.config.programId)
                    // Set user to new user
                    localStorage.setItem(STORAGE_KEY_PREFRERRED_USER, newUser.name);
                    setUser(newUser)
                }
                throw new Error("Can not create user since no Wallet is connected");
            },

            setUser: (user: UserAccount) => {
                localStorage.setItem(STORAGE_KEY_PREFRERRED_USER, user.name);
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
                open={!missingUserNotified && network.getPathWithNetwork(USER_NEW) != location.pathname}
                onClose={() => {
                    localStorage.setItem(STORAGE_KEY_MISSING_USER_EVENT, "true");
                    setMissingUserNotified(true);
                }}
            />
            {children}
        </UserContext.Provider>
    );
}
