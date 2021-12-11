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
import React, { useContext } from "react";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { ChannelAccount } from "@solvei/solvei-client/schema";
import { PublicKey } from "@solana/web3.js";
import { Link as RouterLink } from "react-router-dom";
import { NetworkContext } from "../../../contexts/Network";
import { CHANNELS_NEW } from "../../../routes/routes";


const listChannels = (): ChannelAccount[] => []; /* [
    { name: 'All', tail_message: PublicKey.default },
    { name: "Explore channels", tail_message: PublicKey.default },
] */
export function Channels() {
    const network = useContext(NetworkContext);
    const createChannel = () => { };
    return (
        <Box>
            <Box>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Typography variant="h6" component="div" sx={{}}>
                        Channels
                    </Typography>
                    <IconButton size="large" edge="end" color="inherit" aria-label="menu" component={RouterLink} to={network.getPathWithNetwork(CHANNELS_NEW)} >
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
