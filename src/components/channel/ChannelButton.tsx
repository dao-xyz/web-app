import { useConnection, useLocalStorage } from "@solana/wallet-adapter-react";
import { ChannelAccount, channelNameFilter, getChannels, getChannelsWithParent } from '@dao-xyz/sdk-social';
import React, { FC, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { AccountInfoDeserialized } from "@dao-xyz/sdk-common";
import { Box, Button, Card, CardContent, CircularProgress, Container, Grid, Toolbar, Typography } from "@mui/material";
import { DAO_NEW, getChannelRoute, getNewChannelRoute } from "../../routes/routes";
import { Paper } from '@mui/material';
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { PublicKey } from "@solana/web3.js";
import solana from "./../../assets/solana.png";


export const ChannelButton: FC<{ channel: AccountInfoDeserialized<ChannelAccount>, size: 'small' | 'large' }> = ({ channel, size = 'small' }) => {
    const { key } = useParams();
    const navigate = useNavigate();
    const navigateToChannel = (channel: PublicKey) => {
        navigate(getChannelRoute(channel));

    }
    const [selected, setSelected] = useState(false);
    useEffect(() => {
        setSelected(key == channel.pubkey.toString())
    }, [key])
    return size == 'small' ? <Card sx={{ minWidth: 30, minHeight: 30, cursor: 'pointer' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Button variant={selected ? 'outlined' : 'text'} onClick={() => navigateToChannel(channel.pubkey)}>
                <Grid container alignItems="center" justifyContent="center" direction="column">
                    <Grid item  >
                        {channel.data.name}
                    </Grid>
                </Grid>
                <Box sx={{
                    position: 'absolute',
                    bottom: '-3px',
                    right: '3px'
                }}>
                    <img src={solana} width='7px' alt="solana" />  {/* Only solana for now */}
                </Box>
            </Button>
        </Box>
    </Card> : <Card sx={{ minWidth: 150, minHeight: 150, cursor: 'pointer' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Button sx={{ height: '100%', width: '100%' }} variant={selected ? 'outlined' : 'text'} onClick={() => navigateToChannel(channel.pubkey)}>
                <Grid container sx={{ height: '100%', width: '100%' }} alignItems="center" justifyContent="center" direction="column">
                    <Grid item  >
                        <Typography variant="h6">{channel.data.name}</Typography>
                    </Grid>
                </Grid>
                <Box sx={{
                    position: 'absolute',
                    bottom: '5px',
                    right: '10px'
                }}>
                    <img src={solana} width='20px' alt="solana" />  {/* Only solana for now */}
                </Box>
            </Button>
        </Box>
    </Card>

}