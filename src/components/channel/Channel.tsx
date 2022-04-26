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
import { Box, Button, CircularProgress, Drawer, Grid, IconButton } from "@mui/material";
import CastleIcon from '@mui/icons-material/Castle';
import { ChannelSettings } from "./ChannelSettings";
import { useChannels } from "../../contexts/ChannelsContext";
export const Channel: FC = () => {

    const { connection } = useConnection();
    const [openSettings, setOpenSettings] = React.useState(false);
    const {
        loading,
        select,
        selection,
    } = useChannels();
    console.log()
    return <Box sx={{ p: 3 }}>
        <Grid container direction="row" justifyContent='space-between'>
            <Grid item>  <ChannelLabelBreadcrumb /></Grid>
            <Grid item> <IconButton onClick={() => setOpenSettings(!openSettings)} ><CastleIcon /></IconButton> </Grid>
        </Grid>
        {
            loading ? <CircularProgress /> : <>
                <Drawer
                    anchor='top'
                    open={openSettings}
                    onClose={() => setOpenSettings(false)}
                >
                    {selection.selectionPath && <ChannelSettings channel={selection.selectionPath[0]} authorities={selection.authorities} authoritiesByType={selection.authoritiesByType}></ChannelSettings>}
                </Drawer>
                {

                    selection.channel?.data ?
                        { [ChannelType.Chat]: (<Chat channel={selection.channel}></Chat>), [ChannelType.Forum]: (<Forum channel={selection.channel}></Forum>), [ChannelType.Collection]: (<Collection channel={selection.channel}></Collection>) }
                        [selection.channel.data.channelType] :
                        <>Channel could not be loaded</>
                }
            </>
        }

    </Box>
}