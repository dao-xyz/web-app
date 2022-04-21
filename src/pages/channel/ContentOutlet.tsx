import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import Toolbar from '@mui/material/Toolbar';
import Header from '../../components/Header/Header';
import { Channel } from '../../components/channel/Channel';
import { ChannelAccount, getChannel } from '@dao-xyz/sdk-social';
import { PublicKey } from '@solana/web3.js';
import { AccountInfoDeserialized } from '@dao-xyz/sdk-common';
import { matchPath, useParams } from 'react-router-dom';
import { useConnection } from '@solana/wallet-adapter-react';
import { BaseRoutes, DAO } from '../../routes/routes';
import { DAOsExploreSide } from '../../components/channel/DAOsExploreSide';
import { DAOExploreSide } from '../../components/channel/DAOExploreSide';
import { useChannels } from '../../contexts/ChannelsContext';
import { useMatch } from 'react-router-dom';

const drawerWidth = 240;

export default function ContentOutlet() {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const params = useMatch(DAO + "/:key")?.params;
    const { connection } = useConnection();
    const [channel, setChannel] = React.useState<AccountInfoDeserialized<ChannelAccount> | null>(null);
    const [notFound, setNotFound] = React.useState(false);
    const { select } = useChannels();
    React.useEffect(() => {
        if (params?.key) {
            select(new PublicKey(params?.key))
        }
    }, [params?.key])


    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <div>
            <Toolbar variant="dense" />
            <DAOsExploreSide />

            <List>
                {/*   {['Favourites'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>
                            {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))} */}
            </List>
            <Divider />
            <DAOExploreSide />

            {/* <ChannelTree /> */}
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            {/* <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Responsive drawer
                    </Typography>
                </Toolbar>
            </AppBar> */}
            <Header onDrawerToggle={handleDrawerToggle} drawerWidth={drawerWidth}></Header>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { backgroundColor: theme => theme.palette.action.hover, boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { backgroundColor: theme => theme.palette.action.hover, boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar variant="dense" />
                <BaseRoutes />
            </Box>
        </Box >
    );
}