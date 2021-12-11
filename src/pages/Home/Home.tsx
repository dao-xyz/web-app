import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Channels from "../../components/channels/Channel/Channel";
import { useParams } from "react-router";
import { Feed } from "../../components/channels/Feed/Feed";
const drawerWidth = 240;

export function Home() {
  return (
    <Box sx={{ display: "flex" }}>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <Channels />
        </Box>
      </Drawer>
      <Feed />
    </Box>
  );
}

export default Home;

/**
 * PaperProps={{ style: { position: 'absolute' } }}
                BackdropProps={{ style: { position: 'absolute' } }}
                ModalProps={{
                    container: document.getElementById('drawer-container'),
                    style: { position: 'absolute'}
                }}
 */
