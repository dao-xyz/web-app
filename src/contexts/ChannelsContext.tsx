import React, { useEffect } from "react";
import {
    useConnection,
    useWallet,
} from "@solana/wallet-adapter-react";
import { ChannelAccount, UserAccount } from "@solvei/solvei-client/schema";
import { AccountDeserialized } from "@solvei/solvei-client/models";
import { createUserTransaction, getChannels, getUserByName, getUsersByOwner } from "@solvei/solvei-client";
import { NetworkContext } from "./Network";
import RedirectDialog from "../components/dialogs/RedirectDialog/RedirectDialog";
import { Transaction } from "@solana/web3.js";
import { USER_NEW } from "../routes/routes";
import { useLocation } from "react-router";

interface IUserContext {
    channels: AccountDeserialized<ChannelAccount>[]
}
export const ChannelsContext = React.createContext<IUserContext>({
    channels: []

});

export const ChannelsProvider = ({ children }: { children: JSX.Element }) => {

    const { connection } = useConnection();
    const [channels, setChannels] = React.useState<AccountDeserialized<ChannelAccount>[]>([]);
    const network = React.useContext(NetworkContext);

    useEffect(() => {
        getChannels(connection, network.config.programId).then((channels) => {
            if (channels !== null)
                setChannels(channels)
        })

    }, [network.config.type])

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
