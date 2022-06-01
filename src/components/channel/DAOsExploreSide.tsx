import { useLocalStorage } from "@solana/wallet-adapter-react";
import React, { FC, useEffect, useState } from "react";
import { Box, CircularProgress, Grid } from "@mui/material";
import { ChannelButton } from "./ChannelButton";
import { PostInterface } from "@dao-xyz/social-interface";
import { Shard } from "@dao-xyz/shard";

const FAVORITE_DAOS_KEY = 'favorite_daos';
export const DAOsExploreSide: FC = () => {
    const [loading, setLoading] = useState(false);

    const [favoriteDaos, setFavoriteDaos] = useLocalStorage(FAVORITE_DAOS_KEY, []);

    const [daos, setDaos] = React.useState<Shard<PostInterface>[] | null>(null);

    useEffect(() => {
        /*  setLoading(true);
         getChannelsWithParent(undefined, connection).then((collections) => {
             setDaos(collections);
         }).finally(() => {
             setLoading(false);
         }) */
        // Load root post 


    }, [])
    return <Box sx={{ m: 2 }}>
        <Grid container direction="column" spacing={2} >
            <Grid item container spacing={1}>
                {daos ? daos.map((dao, ix) =>
                    <Grid key={ix} item >
                        <ChannelButton channel={dao} size='small'></ChannelButton>
                    </Grid>
                ) : loading ? <Grid item>< CircularProgress /> </Grid > : <Grid item>No DAOs exist</Grid >}
            </Grid>
        </Grid>
    </Box >

}