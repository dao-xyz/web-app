import React, { createContext, useContext, useEffect } from "react";
import {
    useConnection,
    useWallet,
} from "@solana/wallet-adapter-react";
import { AccountInfoDeserialized } from "@s2g/program";
import { createUserTransaction, ChannelAccount, UserAccount, getUserByName, getChannels } from "@s2g/social";
import { NetworkContext } from "./Network";
import RedirectDialog from "../components/dialogs/RedirectDialog/RedirectDialog";
import { Transaction } from "@solana/web3.js";
import { USER_NEW } from "../routes/routes";
import { useLocation } from "react-router";

interface IUserContext {
    channels: AccountInfoDeserialized<ChannelAccount>[]
}
export const ChannelsContext = React.createContext<IUserContext>({
    channels: []

});

export const useChannels = () => useContext(ChannelsContext)
export const ChannelsProvider = ({ children }: { children: JSX.Element }) => {

    const { connection } = useConnection();
    const [channels, setChannels] = React.useState<AccountInfoDeserialized<ChannelAccount>[]>([]);
    const network = React.useContext(NetworkContext);

    useEffect(() => {
        getChannels(connection, network.config.programId).then((channels) => {
            if (channels !== null)
                setChannels(channels)
        })

    }, [connection, network.config.type])

    const userMemo = React.useMemo(
        () => ({
            channels: channels
        }),
        [network.config.type, channels]
    );

    return (
        <ChannelsContext.Provider value={userMemo}>
            {children}
        </ChannelsContext.Provider>
    );
}
