import { Button, Checkbox, Container, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, IconButton, Input, InputLabel, Radio, RadioGroup, Toolbar, Typography } from '@mui/material';
import React, { useContext } from "react";
import Box from '@mui/material/Box';
import { Connection, Transaction } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Wallet } from '../../../components/Wallet/Wallet';
import { NetworkContext } from '../../../components/Wallet/Network';
import RefreshIcon from "@mui/icons-material/Refresh";
import { getChannels } from '@solvei/solvei-client'
import { ChannelAccount } from '@solvei/solvei-client/schema';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';


export function MyChannels() {
    const { wallet } = useWallet();
    const [channels, setChannels] = React.useState<ChannelAccount[]>([]);
    const { connection } = useConnection();
    const { config } = useContext(NetworkContext);

    const networkContext = useContext(NetworkContext);
    //networkContext.changeNetwork(getWalletAdapterNetwork(state.network))
    const updateChannels = async () => {
        const resp = await getChannels(connection, config.programId);
        setChannels(resp)
    }
    updateChannels();

    return (
        <Box>
            <Toolbar />
            <h1>My channels</h1>
            <IconButton size="large" edge="end" color="inherit">
                <RefreshIcon onClick={updateChannels} />
            </IconButton>
            {/*   {channels.map(channel => (<Box>{channel.name}</Box>)} */}
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <ImageIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Photos" secondary="Jan 9, 2014" />
                </ListItem>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <WorkIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Work" secondary="Jan 7, 2014" />
                </ListItem>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <BeachAccessIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Vacation" secondary="July 20, 2014" />
                </ListItem>
            </List>
        </Box >
    )
}