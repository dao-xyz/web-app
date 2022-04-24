import React, { createContext, useContext, useEffect, useState } from "react";
import {
    useConnection,
    useWallet,
} from "@solana/wallet-adapter-react";
import { AccountInfoDeserialized } from "@dao-xyz/sdk-common";
import { ChannelAccount, getChannel, getChannels } from "@dao-xyz/sdk-social";
import { createUserTransaction, UserAccount, getUserByName } from "@dao-xyz/sdk-user"
import { NetworkContext } from "./Network";
import RedirectDialog from "../components/dialogs/RedirectDialog/RedirectDialog";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { USER_NEW } from "../routes/routes";
import { useLocation, useParams } from "react-router";
import { ChannelTree, getParentChannelChain, getParentChannelChainTree } from "../services/channelUtils";

interface ChannelSelection {
    selectionPath: AccountInfoDeserialized<ChannelAccount>[],
    selectionTree: ChannelTree
}
interface IChannelContext {
    loading: boolean,
    selection: ChannelSelection,
    select: (channel: PublicKey) => Promise<void>,
}
export const ChannelsContext = React.createContext<IChannelContext>({} as any);
export const useChannels = () => useContext(ChannelsContext)

export const ChannelsProvider = ({ children }: { children: JSX.Element }) => {
    const { connection } = useConnection();
    const [selection, setSelection] = React.useState<ChannelSelection>({
        selectionPath: undefined,
        selectionTree: undefined
    });
    const network = React.useContext(NetworkContext);
    const [loading, setLoading] = useState(false);
    const selectionMemo = React.useMemo(
        () => ({
            selection,
            loading,
            select: async (channel: PublicKey) => {
                setLoading(true);
                let channelAccount = await getChannel(channel, connection);
                let parents = [channelAccount, ...await getParentChannelChain(channelAccount, connection)];
                let parentTree = await getParentChannelChainTree(parents, connection);
                let previousParentTree = selection.selectionTree;

                // If same DAO, then keep memory
                if (selection.selectionPath && parents[parents.length - 1].pubkey.equals(selection.selectionPath[selection.selectionPath.length - 1].pubkey)) {
                    for (const key in previousParentTree) {
                        if (!parentTree[key]) {
                            parentTree[key] = previousParentTree[key]; // Remember last previous things
                        }
                    }
                }

                setSelection({
                    selectionPath: parents,
                    selectionTree: parentTree
                });
                setLoading(false);
            }
        }),
        [network.config.type, selection, loading]
    );

    return (
        <ChannelsContext.Provider value={selectionMemo}>
            {children}
        </ChannelsContext.Provider>
    );
}
