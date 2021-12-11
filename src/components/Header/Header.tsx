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
import { Wallet } from "../Wallet/Wallet";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useWallet, WalletContext } from "@solana/wallet-adapter-react";
import { UserContext } from "../../contexts/UserContext";
import { SelectNetwork } from "../Wallet/SelectNetwork";
import { getPathForNetwork } from "../../services/network";
import { NetworkContext } from "../../contexts/Network";
import UserMenu from "./UserMenu";
import { START, USER_NEW } from "../../routes/routes";
export default function Header() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const network = React.useContext(NetworkContext);
  const { publicKey } = React.useContext(WalletContext);
  const { user } = React.useContext(UserContext);

  const navigate = useNavigate();
  const handleOpenNavMenu = (event: any) => {
    setAnchorElNav(event.currentTarget);
  };


  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };


  const navigateToStartInfo = () => {
    navigate(network.getPathWithNetwork(START))
    handleCloseNavMenu();
  }
  const navigateToSourceCode = () => {
    window.location.href = "https://github.com/the-solvei";
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
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <MenuItem key="github" onClick={navigateToStartInfo}>
                <Typography>Getting started</Typography>
              </MenuItem>
              <MenuItem key="start" onClick={navigateToSourceCode}>
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
              key="github"
              onClick={navigateToSourceCode}
              sx={{ my: 2, display: "block" }}
            >
              Source code
            </Button>
            <Button
              key="start"
              onClick={navigateToStartInfo}
              sx={{ my: 2, display: "block" }}
            >
              About
            </Button>
          </Box>
          <SelectNetwork />
          <ThemeToggle />
          <Wallet></Wallet>
          {
            publicKey ?
              (user ? <UserMenu></UserMenu> : <Button
                key="create-user"
                component={RouterLink} to={network.getPathWithNetwork(USER_NEW)}
              >
                Create user
              </Button>) : (<>No pub</>)}
        </Toolbar>
      </Container>
    </AppBar >
  );
};
