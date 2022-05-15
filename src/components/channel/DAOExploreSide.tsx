import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { ChannelAccount, ChannelType, getChannel } from '@dao-xyz/sdk-social';
import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { ChannelTree } from "./ChannelTree";
import { Box, Typography } from "@mui/material";
import { useChannels } from "../../contexts/ChannelsContext";
import { useNetwork } from "../../contexts/Network";

export const DAOExploreSide: FC = () => {
    const { connection } = useConnection();
    const { selection } = useChannels();
    const { isMock } = useNetwork();

    const [notFound, setNotFound] = React.useState(false);
    return <Box sx={{}}>

        {
            selection.selectionPath?.length > 0 || isMock ?
                <ChannelTree></ChannelTree> :
                <Typography sx={{ ml: 2, mr: 2 }} color="text.secondary">No channel selected</Typography>
        }
    </Box >
}