import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { ChannelAccount, ChannelType, getChannel } from '@dao-xyz/sdk-social';
import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { useChannels } from "../../contexts/ChannelsContext";
import { Breadcrumbs } from "@mui/material";
import Link from '@mui/material/Link';
import { Box } from "@mui/system";

export const ChannelLabelBreadcrumb: FC = () => {

    const { selection } = useChannels();
    return <Box sx={{ m: 1 }}>
        <Breadcrumbs separator="›" aria-label="channel-path">    {
            selection.selectionPath ? [...selection.selectionPath].reverse().map((channel, ix) =>
                <Link key={ix}
                    underline="hover"
                    color="inherit"
                >
                    {channel.data.name}
                </Link>
            ) : <Link
                underline="hover"
                color="inherit"
            >
                &nbsp;
            </Link>
        }</Breadcrumbs>
    </Box >
}