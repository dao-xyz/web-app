import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { ChannelAccount, ChannelType, getChannel } from '@dao-xyz/sdk-social';
import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { AccountInfoDeserialized } from "@dao-xyz/sdk-common";
import { Chat } from "./chat/Chat";
import { Forum } from "./forum/Forum";
import { Collection } from "./Collection";
import { ChannelLabelBreadcrumb } from "./ChannelLabelBreadcrumb";
import { Box } from "@mui/material";

export const Channel: FC = () => {

    const { key } = useParams();
    const { connection } = useConnection();
    const [channel, setChannel] = React.useState<AccountInfoDeserialized<ChannelAccount> | null>(null);
    const [notFound, setNotFound] = React.useState(false);
    React.useEffect(() => {
        if (!key) {
            setNotFound(true)
            return;
        }
        try {
            const channelKey = new PublicKey(key as string);
            getChannel(channelKey, connection).then((channel) => {
                setChannel(channel);
            }).catch((error) => {
                console.log(error)
            })
        }
        catch (error) {
            console.log(key, error)
            // bad id
            setNotFound(true)

        }

    }, [key])

    return <Box sx={{ p: 3 }}>
        <ChannelLabelBreadcrumb />
        {

            channel?.data ?
                { [ChannelType.Chat]: (<Chat channel={channel}></Chat>), [ChannelType.Forum]: (<Forum channel={channel}></Forum>), [ChannelType.Collection]: (<Collection channel={channel}></Collection>) }
                [channel.data.channelType] :
                <>Channel could not be loaded</>
        }
    </Box>
}