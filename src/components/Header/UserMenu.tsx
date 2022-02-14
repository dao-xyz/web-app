import { ContentCopy, Person, AccountCircle, AccountBalance, Token, AddCircle, RemoveCircle, Add } from '@mui/icons-material';
import { Menu, MenuItem, Typography, Button, IconButton, ListItemIcon, ListItemText, ListItem } from '@mui/material';
import { Box } from '@mui/system';
import { useWallet } from '@solana/wallet-adapter-react';
import * as React from 'react';
import { useNavigate } from 'react-router';
import { NetworkContext } from '../../contexts/Network';
import { UserContext, useUser } from '../../contexts/UserContext';
import { DEPOSIT, userProfilePath, USER_PROFILE, USER_SETTINGS } from '../../routes/routes';
import { usePublicKeyToCopy } from '../../services/keys';
import { WalletIcon } from '@solana/wallet-adapter-react-ui';
import { useAccount } from '../../contexts/AccountContext';
export default function UserMenu(props: { displayName?: boolean }) {
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const { user } = useUser();
    const { publicKey, disconnect, wallet } = useWallet();
    const { balance } = useAccount();
    const config = React.useContext(NetworkContext);
    const {
        base58,
        copyAddress,
        content
    } = usePublicKeyToCopy(publicKey, wallet, null, (_: boolean) => { });

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
        }
    };

    const handeNavigateSettings = () => {
        if (user) {
            navigate(USER_SETTINGS);
        }
    };

    const deposit = () => {
        if (user) {
            navigate(DEPOSIT);
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
            PaperProps={{
                style: {
                    width: 300,
                },
            }}
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
        >   <ListItem >
                <ListItemIcon>
                    <AccountCircle sx={{ color: "text.secondary" }} />
                </ListItemIcon>
                <Typography color="text.secondary" >{user.data.name}</Typography>
            </ListItem>
            <MenuItem key='profile' onClick={() => { handleCloseUserMenu(); handeNavigateProfile(); }} >
                Profile
            </MenuItem >
            <MenuItem divider key='settings' onClick={() => { handleCloseUserMenu(); handeNavigateSettings(); }} >
                Settings
            </MenuItem >
            <ListItem sx={{ mt: 1 }}>
                <ListItemIcon>
                    <AccountBalance sx={{ color: "text.secondary" }} />
                </ListItemIcon>
                <ListItemText sx={{ color: "text.secondary" }} >Account</ListItemText>

                <Token sx={{ color: "secondary.main" }} />
                <Typography sx={{ ml: 1, color: "secondary.main" }}  >{balance}</Typography>
            </ListItem>

            <MenuItem onClick={() => { handleCloseUserMenu(); deposit() }}>
                <ListItemText>Deposit</ListItemText>
            </MenuItem>

            <MenuItem>

                <ListItemText>Withdraw</ListItemText>
            </MenuItem>

            <MenuItem onClick={() => { copyAddress() }}>
                <ListItemIcon>
                    <WalletIcon wallet={wallet} style={{ width: '25px' }} />
                </ListItemIcon>
                <ListItemText sx={{ ml: 1 }}>{content}</ListItemText>
                <ListItemIcon>
                    <ContentCopy fontSize="small" />
                </ListItemIcon>
            </MenuItem>
            <MenuItem key='disconnect' onClick={() => { handleCloseUserMenu(); disconnect() }}>
                Disconnect
            </MenuItem>

            {/*  <MenuItem key='changeUser' onClick={handleChangeUser}>
                <Typography textAlign="center">Manage users</Typography>
            </MenuItem> */}
        </Menu>
    </Box >)
}