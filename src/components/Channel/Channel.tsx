import {
    Box,
    Link,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
} from "@mui/material";
import React from "react";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { ChannelAccount } from "@solvei/solvei-client/schema";
import { PublicKey } from "@solana/web3.js";

const STATIC_CHANNEL_NAMES = ["Explore channels", "All"];

const listChannels = (): ChannelAccount[] => []; /* [
    { name: 'All', tail_message: PublicKey.default },
    { name: "Explore channels", tail_message: PublicKey.default },
] */
export function Channels() {
    const createChannel = () => { };
    return (
        <Box>
            <Box>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Typography variant="h6" component="div" sx={{}}>
                        Channels
                    </Typography>
                    <IconButton size="large" edge="end" color="inherit" aria-label="menu" component={Link} href="/channels/new" >
                        <AddIcon />
                    </IconButton>
                </Toolbar>
            </Box>
            <List>
                {listChannels().map((channel) => (
                    <ListItem button key={channel.name}>
                        <ListItemText primary={channel.name} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}

export default Channels;
