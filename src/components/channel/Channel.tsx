import { PublicKey } from "@solana/web3.js";
import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Chat } from "./post/Chat";
import { Collection } from "./Collection";
import { ChannelLabelBreadcrumb } from "./ChannelLabelBreadcrumb";
import { Box, Button, CircularProgress, Drawer, Grid, IconButton } from "@mui/material";
import CastleIcon from '@mui/icons-material/Castle';
import InfoIcon from '@mui/icons-material/Info';
import { ChannelSettings } from "./ChannelSettings";
import { usePosts } from "../../contexts/PostContext";
export const Channel: FC = () => {

    /* const [openSettings, setOpenSettings] = React.useState(false);
    const {
        loading,
        select,
        selection,
    } = useChannels();
    return <Box sx={{ pt: 2, paddingBottom: "env(safe-area-inset-bottom)" }}>
        <Grid container sx={{ pr: 2, pl: 2 }} direction="row" justifyContent='right'>
            <Grid item sx={{ mr: 'auto' }}>  <ChannelLabelBreadcrumb /></Grid>
            <Grid item> <IconButton onClick={() => setOpenSettings(!openSettings)} ><InfoIcon /></IconButton> </Grid>
            <Grid item> <IconButton onClick={() => setOpenSettings(!openSettings)} ><CastleIcon /></IconButton> </Grid>
        </Grid>
        {
            loading ? <Box sx={{ display: 'flex', justifyContent: 'center', verticalAlign: 'center' }}>
                <CircularProgress />
            </Box> : <></>
        }
        <Drawer
            anchor='top'
            open={openSettings}
            onClose={() => setOpenSettings(false)}
        >
            {selection.selectionPath && <ChannelSettings channel={selection.selectionPath[0]} authorities={selection.authorities} authoritiesByType={selection.authoritiesByType}></ChannelSettings>}
        </Drawer>

        {

            selection.channel?.data &&
            { [ChannelType.Chat]: (<Chat parentPost={selection.channel}></Chat>), [ChannelType.Collection]: (<Collection channel={selection.channel}></Collection>) }
            [selection.channel.data.channelType]

        }
        {
            !selection.channel?.data && !loading && <>Channel could not be loaded</>
        }


    </Box > */
    return <></>
}