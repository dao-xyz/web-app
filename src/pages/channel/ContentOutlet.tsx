import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Header from '../../components/Header/Header';
import { ChannelAccount } from '@dao-xyz/sdk-social';
import { PublicKey } from '@solana/web3.js';
import { AccountInfoDeserialized } from '@dao-xyz/sdk-common';
import { useConnection } from '@solana/wallet-adapter-react';
import { BaseRoutes, DAO } from '../../routes/routes';
import { DAOsExploreSide } from '../../components/channel/DAOsExploreSide';
import { DAOExploreSide } from '../../components/channel/DAOExploreSide';
import { useChannels } from '../../contexts/ChannelsContext';
import { useMatch } from 'react-router-dom';
import { useNetwork } from '../../contexts/Network';
import { Button, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LanIcon from '@mui/icons-material/Lan';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import NotReadyYetDialog from '../../components/dialogs/NotReadyYetDialog';
import { useFeatures } from '../../contexts/FeatureContext';
const drawerWidth = 240;

export default function ContentOutlet() {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const params = useMatch(DAO + "/:key")?.params;
    const { connection } = useConnection();
    const [channel, setChannel] = React.useState<AccountInfoDeserialized<ChannelAccount> | null>(null);
    const [notFound, setNotFound] = React.useState(false);
    const { select, dao } = useChannels();
    const { isMock } = useNetwork();
    const { openNotReady } = useFeatures();

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
            {!isMock && <><DAOsExploreSide />     <Divider /></>}
            <Typography sx={{ mt: 2, width: '100%', textAlign: 'center' }}>{dao?.data.name}</Typography>
            <Typography sx={{ ml: 2, mt: 2 }} >Channels</Typography>
            <DAOExploreSide />
            <Divider />
            <Box>
                <Button sx={{ width: '100%', justifyContent: 'left', pl: 2 }} startIcon={<PeopleIcon />} onClick={openNotReady} >People</Button>
                <Button sx={{ width: '100%', justifyContent: 'left', pl: 2 }} startIcon={<HowToVoteIcon />} onClick={openNotReady}>Vote delegation</Button>
                <Button sx={{ width: '100%', justifyContent: 'left', pl: 2 }} startIcon={<WorkspacePremiumIcon />} onClick={openNotReady}>Contributions</Button>
                <Button sx={{ width: '100%', justifyContent: 'left', pl: 2 }} startIcon={<LanIcon />} onClick={openNotReady}>Infrastructure</Button>
            </Box>

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
                aria-label="folders"
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
                        '& .MuiDrawer-paper': { /* backgroundColor: theme => theme.palette.action.hover, */ boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { /* backgroundColor: theme => theme.palette.action.hover, */ boxSizing: 'border-box', width: drawerWidth },
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