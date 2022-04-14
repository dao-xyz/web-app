import React, { useCallback, useContext, useState } from "react";
import Box from '@mui/material/Box';
import { useConnection, useLocalStorage, useWallet } from '@solana/wallet-adapter-react';
import RefreshIcon from "@mui/icons-material/Refresh";
import { ChannelAccount, getChannel } from '@dao-xyz/sdk-social'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { IconButton } from "@mui/material";
import { AccountInfoDeserialized } from "@dao-xyz/sdk-common";
import { useNetwork } from "../../contexts/Network";
import { useUser } from "../../contexts/UserContext";
import { PublicKey } from "@solana/web3.js";


export function MyChannels() {
    const { wallet } = useWallet();
    const { user } = useUser();

    const [savedChannels, setSavedChannels] = useLocalStorage<string[]>("saved_channels", []);
    const [channels, setChannels] = useState<AccountInfoDeserialized<ChannelAccount>[]>([]);

    const { connection } = useConnection();
    const { config } = useNetwork();
    //networkContext.changeNetwork(getWalletAdapterNetwork(state.network))
    const updateChannels = useCallback(async () => {
        let arr: AccountInfoDeserialized<ChannelAccount>[] = [];
        for (const channel of savedChannels) {
            arr.push(await getChannel(new PublicKey(channel), connection));
        }
        setChannels(arr)
    }, [savedChannels])

    return (
        <Box>
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