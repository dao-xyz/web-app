import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { ChannelAccount, ChannelType, getChannel } from '@dao-xyz/sdk-social';
import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { AccountInfoDeserialized } from "@dao-xyz/sdk-common";
import { Chat } from "./Chat";
import { Forum } from "./Forum";
import { Collection } from "./Collection";
import { ChannelTree } from "./ChannelTree";
import { Box, Typography } from "@mui/material";

export const DAOExploreSide: FC = () => {
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

    return <Box sx={{ m: 2 }}>{
        channel?.data ?
            <ChannelTree channel={channel}></ChannelTree> :
            <Typography color="text.secondary">No channel selected</Typography>
    }</Box>
}