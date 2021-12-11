import { Tooltip, IconButton, Avatar, Menu, MenuItem, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { settings } from 'cluster';
import * as React from 'react';
import { useNavigate } from 'react-router';
import { NetworkContext } from '../../contexts/Network';
import { UserContext } from '../../contexts/UserContext';
import { USER_CHANGE } from '../../routes/routes';
import { getPathForNetwork } from '../../services/network';

export default function UserMenu() {
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const { user } = React.useContext(UserContext);
    const config = React.useContext(NetworkContext);

    const navigate = useNavigate();

    const handleOpenUserMenu = (event: any) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleChangeUser = () => {
        navigate(config.getPathWithNetwork(USER_CHANGE));
        setAnchorElUser(null);

    };
    return (<Box sx={{ flexGrow: 0, ml: 2 }}>
        <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar />
            </IconButton>
        </Tooltip>
        <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
        >
            <Typography textAlign="center" >{user?.name}</Typography>
            <MenuItem key='posts' onClick={handleCloseUserMenu}>
                <Typography textAlign="center">Posts</Typography>
            </MenuItem>
            <MenuItem key='stakes' onClick={handleCloseUserMenu}>
                <Typography textAlign="center">Stakes</Typography>
            </MenuItem>
            <MenuItem key='changeUser' onClick={handleChangeUser}>
                <Typography textAlign="center">Change user</Typography>
            </MenuItem>
        </Menu>
    </Box>)
}