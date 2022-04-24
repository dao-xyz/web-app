import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { ChannelAccount, ChannelType, getChannel } from '@dao-xyz/sdk-social';
import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { AccountInfoDeserialized } from "@dao-xyz/sdk-common";
import { Chat } from "./chat/Chat";
import { Forum } from "./forum/Forum";
import { Collection } from "./Collection";
import { ChannelTree } from "./ChannelTree";
import { Box, Typography } from "@mui/material";
import { useChannels } from "../../contexts/ChannelsContext";

export const DAOExploreSide: FC = () => {
    const { connection } = useConnection();
    const { selection } = useChannels();
    const [notFound, setNotFound] = React.useState(false);
    return <Box sx={{ mt: 2, mb: 2 }}>{
        selection.selectionPath?.length > 0 ?
            <ChannelTree></ChannelTree> :
            <Typography sx={{ ml: 2, mr: 2 }} color="text.secondary">No channel selected</Typography>
    }</Box>
}