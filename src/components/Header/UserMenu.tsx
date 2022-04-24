import { ContentCopy, Person, AccountCircle, AccountBalance, Token, AddCircle, RemoveCircle, Add, PersonAdd } from '@mui/icons-material';
import { Menu, MenuItem, Typography, Button, IconButton, ListItemIcon, ListItemText, ListItem } from '@mui/material';
import { Box } from '@mui/system';
import { useWallet } from '@solana/wallet-adapter-react';
import * as React from 'react';
import { useNavigate } from 'react-router';
import { NetworkContext } from '../../contexts/Network';
import { UserContext, useUser } from '../../contexts/UserContext';
import { DEPOSIT, getUserProfilePath, SETTINGS_BURNER, USER_NEW, USER_PROFILE, USER_SETTINGS } from '../../routes/routes';
import { usePublicKeyToCopy } from '../../services/keys';
import { WalletIcon } from '@solana/wallet-adapter-react-ui';
import { useAccount } from '../../contexts/AccountContext';
import { useSmartWallet } from '../../contexts/SmartWalletContext';
import QuickreplyIcon from '@mui/icons-material/Quickreply';
export default function UserMenu(props: { displayName?: boolean }) {
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const { user } = useUser();
    const { publicKey, disconnect, wallet } = useWallet();
    const { capabilities, createSigner, delegatedSigners } = useSmartWallet();

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
            navigate(getUserProfilePath(user.data.name));
        }
    };

    const handleCreateUser = () => {
        if (!user) {
            navigate(USER_NEW);
        }
    };

    const handleEnableQuickSign = () => {
        navigate(SETTINGS_BURNER);
    }


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
    return (<Box sx={{ flexGrow: 0 }}>
        {/*  <IconButton  sx={{ p: 0 }}>
            <Avatar />
        </IconButton> */}
        {
            props.displayName ? <Button sx={{ maxWidth: '150px', width: '100%' }} variant="contained" onClick={handleOpenUserMenu} endIcon={<Person />}>

                <Typography noWrap >
                    {user?.data ? user?.data?.name : publicKey.toString()}
                </Typography>
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
        >
            {user && <ListItem >
                <ListItemIcon>
                    <AccountCircle sx={{ color: "text.secondary" }} />
                </ListItemIcon>
                <Typography color="text.secondary" >{user?.data.name}</Typography>

            </ListItem>}
            {user &&
                <MenuItem key='profile' onClick={() => { handleCloseUserMenu(); handeNavigateProfile(); }} >
                    Profile
                </MenuItem >}
            {!user && <MenuItem key='profile' onClick={() => { handleCloseUserMenu(); handleCreateUser(); }} >
                <ListItemIcon>
                    <PersonAdd />
                </ListItemIcon>
                <ListItemText >Create user</ListItemText>
            </MenuItem >}

            {!(delegatedSigners?.length) && <MenuItem key='smart-wallet' onClick={() => { handleCloseUserMenu(); handleEnableQuickSign(); }} >
                <ListItemIcon>
                    <QuickreplyIcon />
                </ListItemIcon>
                <ListItemText >Enable quick-sign</ListItemText>
            </MenuItem >}
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
            {/* 
            <MenuItem onClick={() => { handleCloseUserMenu(); deposit() }}>
                <ListItemText>Deposit</ListItemText>
            </MenuItem>

            <MenuItem>
                <ListItemText>Withdraw</ListItemText>
            </MenuItem>
             */}
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