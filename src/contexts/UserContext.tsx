import React, { useEffect, useContext } from "react";
import {
    useConnection,
    useWallet,
} from "@solana/wallet-adapter-react";
import { UserAccount, getUsersByOwner, createUserTransaction, updateUserTransaction, getUserByName } from "@dao-xyz/sdk-user";
import { Profile, createProfile } from "@dao-xyz/sdk-social";
import { AccountInfoDeserialized } from "@dao-xyz/sdk-common";

import { NetworkContext, useNetwork } from "./Network";
import RedirectDialog from "../components/dialogs/RedirectDialog/RedirectDialog";
import { Transaction } from "@solana/web3.js";
import { USER_NEW } from "../routes/routes";
import { useLocation } from "react-router";
import { useIpfsService } from "./IpfsServiceContext";

import BN from 'bn.js'
import { ContentSource, ContentSourceExternal, ContentSourceString } from "@dao-xyz/sdk-common";
interface IUserContext {
    createUser: (username: string) => Promise<void>,
    setUser: (user: AccountInfoDeserialized<UserAccount>) => void,
    user: AccountInfoDeserialized<UserAccount> | undefined,
    createProfile: (profile: Profile, password?: string) => Promise<void>,
    getProfileImageUrl: (profile: Profile) => Promise<string | undefined>,
    profile: Profile | undefined
}
export const UserContext = React.createContext<IUserContext>({} as IUserContext);
export function useUser(): IUserContext {
    return useContext(UserContext);
}

export const fetchNFTManifestImageUrl = async (uri: string) => {
    try {
        const response = await fetch(uri).catch(() => { return undefined });
        const body = await response?.json();
        if (!body || !body.image) {
            return undefined;
        }
        return body.image;
    }
    catch {
        return undefined
    }
}

export const fetchProfile = async (source: ContentSource): Promise<Profile | undefined> => {
    try {

        if (source instanceof ContentSourceExternal) {
            const response = await fetch(source.url).catch(() => { return undefined });
            return await response?.json();
        }
        else if (source instanceof ContentSourceString) {
            return JSON.parse(source.string);
        }

    }
    catch {
        return Promise.resolve(undefined)
    }
}

const STORAGE_KEY_MISSING_USER_EVENT = "dialogs.missing_user"
const STORAGE_KEY_PREFRERRED_USER = "settings.preffered_user"


export const UserProvider = ({ children }: { children: JSX.Element }) => {

    const { connection } = useConnection();
    const location = useLocation();
    const { publicKey, sendTransaction, } = useWallet();
    const [user, setUser] = React.useState<AccountInfoDeserialized<UserAccount> | undefined>(undefined);
    const [profile, setProfile] = React.useState<Profile | undefined>(undefined);

    const { getAdapter } = useIpfsService();
    const [missingUserNotified, setMissingUserNotified] = React.useState<boolean>(localStorage.getItem(STORAGE_KEY_MISSING_USER_EVENT) === "true");
    const network = useNetwork();
    const preferredUser = localStorage.getItem(STORAGE_KEY_PREFRERRED_USER);

    useEffect(() => {
        if (publicKey) {
            // check if user exist

            if (preferredUser) {
                getUserByName(preferredUser, connection).then((userByName) => {
                    if (userByName) {

                        setUser(userByName);
                    }
                })
            }
            else {
                getUsersByOwner(publicKey, connection).then((users) => {
                    if (users.length === 0) {
                        setMissingUserNotified(false);
                    }
                    else {
                        setUser(users[0]); // assume one user for now
                    }
                })

            }

            if (user) {
                if (user.data.profile) {
                    fetchProfile(user.data.profile).then((profile) => {
                        setProfile(profile);
                    })
                }
                else {
                    setProfile(undefined);
                }
            }
        }
    }, [connection, preferredUser, publicKey, user?.data?.name])

    const userMemo = React.useMemo(
        () => ({

            createUser: async (username: string) => {
                if (publicKey) {
                    const [transaction, _] = await createUserTransaction(publicKey, publicKey, username, new ContentSourceString({ string: "" }));
                    const signature = await sendTransaction(new Transaction().add(transaction), connection);
                    await connection.confirmTransaction(signature);
                    const newUser = await getUserByName(username, connection)
                    // Set user to new user
                    if (!newUser) {
                        throw new Error("Could not find newly created user");  // Most likely connection error
                    }
                    localStorage.setItem(STORAGE_KEY_PREFRERRED_USER, newUser.data.name);
                    setUser(newUser)
                }
                else {
                    throw new Error("Can not create user since no Wallet is connected");

                }
            },

            setUser: (user: AccountInfoDeserialized<UserAccount>) => {
                localStorage.setItem(STORAGE_KEY_PREFRERRED_USER, user.data.name);
                setUser(user);
            },

            createProfile: async (profile: Profile, password?: string) => {
                if (!publicKey)
                    throw new Error("Can not create profile since no Wallet is connected");
                if (!user)
                    throw new Error("Can not create profile since no user exist for this wallet");
                const adapter = await getAdapter(password);
                if (!adapter)
                    throw new Error('Could not get IPFS adapter')
                const { url } = await createProfile(profile, adapter);
                const transaction = await updateUserTransaction(user.pubkey, publicKey, new ContentSourceExternal({
                    url
                }));
                const signature = await sendTransaction(new Transaction().add(transaction), connection);
                await connection.confirmTransaction(signature);
                setProfile(profile);

            },
            getProfileImageUrl: async (profile: Profile): Promise<string | undefined> => {
                if (!profile.image)
                    return undefined
                return fetchNFTManifestImageUrl(profile.image);
            },

            user,
            profile
        }),
        [publicKey, user, profile]
    );


    // If connected but no user account exist then create it!
    console.log(USER_NEW, location.pathname)
    return (
        <UserContext.Provider value={userMemo}>
            <RedirectDialog
                title={"No user account associated with this wallet on this network: " + network.config.name}
                content="In order to create posts, channels and interact with the content on this site you need a user account. Create one now?"
                redirectPath={USER_NEW}
                open={!!publicKey && !missingUserNotified && '/' + USER_NEW != location.pathname}
                onClose={() => {
                    localStorage.setItem(STORAGE_KEY_MISSING_USER_EVENT, "true");
                    setMissingUserNotified(true);
                }}
            />
            {children}
        </UserContext.Provider>
    );
}
