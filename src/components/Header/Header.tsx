import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import LogoWhite from "./../../logo.png";
import LogoGray from "./../../logo-gray.png";
import LogoVlack from "./../../logo-black.png";
import ChildCareIcon from '@mui/icons-material/ChildCare';
import ThemeToggle from "../ThemeToggle";
import { Wallet } from "../network/Wallet/Wallet";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { WalletContext } from "@solana/wallet-adapter-react";
import { useUser } from "../../contexts/UserContext";
import { NetworkContext } from "../../contexts/Network";
import UserMenu from "./UserMenu";
import { ABOUT, EXPLORE, HOME, SETTINGS, USER_NEW } from "../../routes/routes";
import { PersonAdd, Search, Settings } from "@mui/icons-material";
import ChangeNetworkDialog from "../network/ChangeNetworkDialog";
import { useTheme } from "@mui/styles";
import ExploreIcon from '@mui/icons-material/Explore';
import { InputAdornment, Stack, Switch, TextField } from "@mui/material";
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import HomeIcon from '@mui/icons-material/Home';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import NotReadyYetDialog from "../dialogs/NotReadyYetDialog";
import { useFeatures } from "../../contexts/FeatureContext";
const Header: React.FC<{ drawerWidth: Number, onDrawerToggle: () => void }> = ({ drawerWidth, onDrawerToggle }) => {
  const [anchorElMenuNav, setAnchorElMenuNav] = React.useState(null);
  const [anchorElSettingsNav, setAnchorElSettingsNav] = React.useState(null);
  const [openChangeNetworkDialog, setOpenChangeNetworkDialog] = React.useState(false);
  const theme = useTheme();
  const { isMock } = React.useContext(NetworkContext);
  const { publicKey } = React.useContext(WalletContext);
  const { openNotReady } = useFeatures();

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
    navigate(EXPLORE)
    handleCloseNavMenu();
  }

  const navigateToAboutInfo = () => {
    navigate(ABOUT)
    handleCloseNavMenu();
  }

  const navigateToSettings = () => {
    navigate(SETTINGS)
    handleCloseNavMenu();
  }

  const navigateToSourceCode = () => {
    window.location.href = "https://github.com/dao-xyz";
  };

  return (
    <AppBar
      color="default"
      position="fixed"
      /* sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} */
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        /* width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` }, */
      }}
    >
      {/* <Toolbar>
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
      </Toolbar> */}
      <Container maxWidth="xl">
        <Toolbar variant="dense">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{ mr: 2 }}
          >
            <IconButton
              /*         component={RouterLink}
                      to="/"
                      size='small' */
              onClick={openNotReady}
            >
              <Box sx={{ width: '30px', height: '30px', display: 'flex' }}>
                <img src={theme["palette"].mode == 'light' ? LogoGray : LogoWhite} alt="logo" />
              </Box>
            </IconButton>
          </Typography>

          {/* <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
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
                <Typography>DAO Explorer</Typography>
              </MenuItem>
              <MenuItem key="about" onClick={navigateToAboutInfo}>
                <Typography>About</Typography>
              </MenuItem>
            </Menu>
          </Box> */}
          {/*     <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          ></Typography> */}
          {/*  <Stack direction="row" spacing={1} alignItems="center">
            <DocumentScannerIcon />
            <Switch disabled />
            <ViewInArIcon />
          </Stack> */}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Button startIcon={<HomeIcon />} onClick={openNotReady}
            >
              Home
            </Button>
          </Box>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Button startIcon={<ExploreIcon />} onClick={openNotReady}
            >
              Explore
            </Button>
          </Box>


          {/*   <Button
            key="home"
            onClick={navigateToHome}
            sx={{ display: "block" }}
          >
            Home
          </Button> */}
          {/*  <Button
            key="github"
            disabled
            sx={{ display: "block" }}
          >
            dao | xyz
          </Button> */}


          {/* <Box>
            {network.config.type != NetworkXYZ.Mainnet ? (<Typography
              variant="h6">Network: {network.config.type}</Typography>
            ) : (<></>)}
          </Box> */}
          <Box sx={{ width: '100%', display: 'flex', ml: 1, mr: 1, justifyContent: 'center' }}>
            <TextField
              id="search"
              size="small"
              disabled
              variant="outlined"
              placeholder="Search in multiple DAOs: posts, files, images..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{
                maxWidth: '500px', width: '100%'
              }}
            />
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, justifyContent: "right", alignItems: "center" }}>
            <ThemeToggle />
            {!isMock ? (publicKey ?
              <UserMenu displayName={true}></UserMenu> : (<Wallet />)) : (<Button disabled variant="outlined" startIcon={<ElectricalServicesIcon />}>
                Connect
              </Button>)}
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" }, justifyContent: "right", alignItems: "center" }}>

            <IconButton
              size="large"
              aria-label="settings of user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavSettings}
            >
              <Settings />
            </IconButton>

            {!isMock ? (publicKey ?
              <UserMenu displayName={true}></UserMenu> : (<Wallet />)) : (<>
                <IconButton disabled >
                  <ElectricalServicesIcon />
                </IconButton>
              </>)}
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
            </Menu>
          </Box>
        </Toolbar>
      </Container>
      <ChangeNetworkDialog open={openChangeNetworkDialog} onClose={() => setOpenChangeNetworkDialog(false)}></ChangeNetworkDialog>

    </AppBar >
  );
};

export default Header;