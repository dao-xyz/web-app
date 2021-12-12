import { Person } from '@mui/icons-material';
import { Menu, MenuItem, Typography, Button, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import * as React from 'react';
import { useNavigate } from 'react-router';
import { NetworkContext } from '../../contexts/Network';
import { UserContext } from '../../contexts/UserContext';
import { USER_CHANGE } from '../../routes/routes';

export default function UserMenu(props: { displayName?: boolean }) {
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
        {/*  <IconButton  sx={{ p: 0 }}>
            <Avatar />
        </IconButton> */}
        {
            props.displayName ? <Button variant="contained" onClick={handleOpenUserMenu} endIcon={<Person />}>
                {user?.data?.name}
            </Button> :
                (<IconButton onClick={handleOpenUserMenu}>
                    <Person />
                </IconButton>)
        }
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
            <MenuItem key='posts' onClick={handleCloseUserMenu}>
                <Typography textAlign="center">Posts</Typography>
            </MenuItem>
            <MenuItem key='stakes' onClick={handleCloseUserMenu}>
                <Typography textAlign="center">Stakes</Typography>
            </MenuItem>
            <MenuItem key='changeUser' onClick={handleChangeUser}>
                <Typography textAlign="center">Manage users</Typography>
            </MenuItem>
        </Menu>
    </Box>)
}