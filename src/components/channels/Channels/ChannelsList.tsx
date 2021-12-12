import {
    Box,
    Grid,
    Link,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";
import { useContext } from "react";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { ChannelsContext } from "../../../contexts/ChannelsContext";
import { CHANNEL_NEW, getChannelRoute } from "../../../routes/routes";
import { NetworkContext } from "../../../contexts/Network";
import { ChannelAccount, DescriptionString } from "@solvei/solvei-client/schema";
import { AccountDeserialized } from "@solvei/solvei-client/models";



export function Channels() {
    const { channels } = useContext(ChannelsContext);
    const network = useContext(NetworkContext);
    const navigate = useNavigate();
    const onClickChannel = (channel: AccountDeserialized<ChannelAccount>) => {
        navigate(network.getPathWithNetwork(getChannelRoute(channel.key)));
    }
    return (
        <Box>

            <List dense sx={{
                '& ul': { padding: 0 },

            }}
                subheader={
                    <ListSubheader id="list-subheader"  >
                        <Grid container justifyContent="space-between" justifyItems="center">
                            <Grid item>
                                Channels
                            </Grid>
                            <Grid item>
                                <IconButton sx={{ ml: 'auto' }} size="small" edge="end" color="inherit" aria-label="menu" component={RouterLink} to={network.getPathWithNetwork(CHANNEL_NEW)} >
                                    <AddIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </ListSubheader>
                }
            >
                {channels.map((channel) =>
                (
                    <Tooltip key={channel.data.name} placement="right" title={channel.data.description ? (channel.data.description as DescriptionString).description : 'No description'}>
                        <ListItem button key={channel.data.name + "-tip"}>
                            <ListItemText onClick={() => onClickChannel(channel)} primary={channel.data.name} />
                        </ListItem>
                    </Tooltip>
                ))}
            </List>

        </Box>
    );
}

export default Channels;
