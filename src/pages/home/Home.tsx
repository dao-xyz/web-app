import React, { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import { useParams } from "react-router";
import { ChannelsFilter } from "../../components/channel/ChannelsFilter";
import { Container, Grid } from "@mui/material";
import { AccountInfoDeserialized } from "@dao-xyz/sdk-common";
import { ChannelAccount } from "@dao-xyz/sdk-social";
const drawerWidth = 240;

export function Home() {

    const [channels, setChannels] = useState<AccountInfoDeserialized<ChannelAccount>[]>([]);
    return (
        <Container maxWidth="md" component="main" sx={{ pt: 8, pb: 6 }}>
            <Grid container flexDirection="column" spacing={2}>
                <Grid item>
                    <ChannelsFilter onChange={(channels) => {
                        setChannels(channels)
                    }} />
                </Grid>
                <Grid item>
                </Grid>
            </Grid>
        </Container>
        /*  <Box sx={{ display: "flex" }}>
 
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
         </Box> */
    );
}

export default Home;