import { Person } from '@mui/icons-material';
import { Menu, MenuItem, Typography, Button, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import * as React from 'react';
import { useNavigate } from 'react-router';
import { NetworkContext } from '../../contexts/Network';
import { UserContext, useUser } from '../../contexts/UserContext';
import { userProfilePath, USER_PROFILE, USER_SETTINGS } from '../../routes/routes';

export default function UserMenu(props: { displayName?: boolean }) {
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const { user } = useUser();
    const config = React.useContext(NetworkContext);

    const navigate = useNavigate();

    const handleOpenUserMenu = (event: any) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const handeNavigateProfile = () => {
        if (user) {
            navigate(userProfilePath(user.data.name));
            setAnchorElUser(null);
        }
    };
    /*   const handleChangeUser = () => {
          navigate(USER_CHANGE);
          setAnchorElUser(null);
  
      }; */
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
            <MenuItem key='profile' onClick={handleCloseUserMenu}>
                <Typography textAlign="center" onClick={handeNavigateProfile}>Profile</Typography>
            </MenuItem>
            {/*  <MenuItem key='changeUser' onClick={handleChangeUser}>
                <Typography textAlign="center">Manage users</Typography>
            </MenuItem> */}
        </Menu>
    </Box>)
}