import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Link from "@mui/material/Link";
import logo from "./../../logo.png";
import { ColorModeContext } from "../../App";
import ThemeToggle from "../ThemeToggle";
import { Wallet } from "../network/Wallet/Wallet";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useWallet, WalletContext } from "@solana/wallet-adapter-react";
import { UserContext, useUser } from "../../contexts/UserContext";
import { SelectNetwork } from "../network/SelectNetwork";
import { getPathForNetwork } from "../../services/network";
import { NetworkContext } from "../../contexts/Network";
import UserMenu from "./UserMenu";
import { ABOUT, CHANNELS, HOME, USER_NEW } from "../../routes/routes";
import { PersonAdd, Settings } from "@mui/icons-material";
import { ListItemIcon } from "@mui/material";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import ChangeNetworkDialog from "../network/ChangeNetworkDialog";
export default function Header() {
  const [anchorElMenuNav, setAnchorElMenuNav] = React.useState(null);
  const [anchorElSettingsNav, setAnchorElSettingsNav] = React.useState(null);
  const [openChangeNetworkDialog, setOpenChangeNetworkDialog] = React.useState(false);

  const network = React.useContext(NetworkContext);
  const { publicKey } = React.useContext(WalletContext);
  const { user } = useUser();

  const navigate = useNavigate();
  const handleOpenNavMenu = (event: any) => {
    setAnchorElMenuNav(event.currentTarget);
  };


  const handleCloseNavMenu = () => {
    setAnchorElMenuNav(null);
  };

  const handleOpenNavSettings = (event: any) => {
    setAnchorElSettingsNav(event.currentTarget);
  };


  const handleCloseNavSettings = () => {
    setAnchorElSettingsNav(null);
  };


  const navigateToHome = () => {
    navigate(HOME)
    handleCloseNavMenu();
  }

  const navigateToChannels = () => {
    navigate(CHANNELS)
    handleCloseNavMenu();
  }

  const navigateToAboutInfo = () => {
    navigate(ABOUT)
    handleCloseNavMenu();
  }
  const navigateToSourceCode = () => {
    window.location.href = "https://github.com/s2gprotocol";
  };

  return (
    <AppBar
      color="default"
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters variant="dense">

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
          >
            <IconButton
              component={RouterLink}
              to="/"
              size='small'
            >
              <Box sx={{ width: '30px', height: '30px', display: 'flex' }}>
                <img src={logo} alt="logo" />
              </Box>
            </IconButton>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu of site"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElMenuNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElMenuNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <MenuItem key="home" onClick={navigateToHome}>
                <Typography>Home</Typography>
              </MenuItem>
              <MenuItem key="channels" onClick={navigateToChannels}>
                <Typography>Channels</Typography>
              </MenuItem>
              <MenuItem key="about" onClick={navigateToAboutInfo}>
                <Typography>About</Typography>
              </MenuItem>
              <MenuItem key="github" onClick={navigateToSourceCode}>
                <Typography>Source code</Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          ></Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              key="home"
              onClick={navigateToHome}
              sx={{ my: 2, display: "block" }}
            >
              Home
            </Button>
            <Button
              key="github"
              onClick={navigateToSourceCode}
              sx={{ my: 2, display: "block" }}
            >
              Source code
            </Button>
            <Button
              key="about"
              onClick={navigateToAboutInfo}
              sx={{ my: 2, display: "block" }}
            >
              About
            </Button>

          </Box>
          <Box>
            {network.config.type != WalletAdapterNetwork.Mainnet ? (<Typography
              variant="h6">Network: {network.config.type}</Typography>
            ) : (<></>)}
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, justifyContent: "right", alignItems: "center" }}>
            {/*  <SelectNetwork /> */}
            <ThemeToggle />

            {
              publicKey ?
                (user ? <UserMenu displayName={true}></UserMenu> : <Button
                  key="create-user"
                  variant="contained"
                  component={RouterLink} to={USER_NEW}
                  endIcon={<PersonAdd />}
                >
                  Create user
                </Button>) : (<Wallet />)}
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" }, justifyContent: "right", alignItems: "center" }}>



            {
              publicKey ?
                (user ? <UserMenu displayName={false}></UserMenu> : <IconButton
                  component={RouterLink} to={USER_NEW}
                >
                  <PersonAdd />
                </IconButton>) : (<Wallet />)}

            <IconButton
              size="large"
              aria-label="settings of user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavSettings}
            >
              <Settings />
            </IconButton>
            <Menu
              id="settings-appbar"
              anchorEl={anchorElSettingsNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElSettingsNav)}
              onClose={handleCloseNavSettings}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >

              <ThemeToggle menuItem={true} />
              {/* <MenuItem onClick={() => setOpenChangeNetworkDialog(true)}>Change network</MenuItem> */}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
      <ChangeNetworkDialog open={openChangeNetworkDialog} onClose={() => setOpenChangeNetworkDialog(false)}></ChangeNetworkDialog>
    </AppBar >
  );
};
