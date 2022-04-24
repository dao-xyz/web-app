import { useConnection, useLocalStorage } from "@solana/wallet-adapter-react";
import { ChannelAccount, getChannels, getChannelsWithParent } from '@dao-xyz/sdk-social';
import React, { FC, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { AccountInfoDeserialized } from "@dao-xyz/sdk-common";
import { Box, Button, Card, CardContent, CircularProgress, Container, Grid, Toolbar, Typography } from "@mui/material";
import { DAO_NEW, getChannelRoute, getNewChannelRoute } from "../../routes/routes";
import { Paper } from '@mui/material';
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { PublicKey } from "@solana/web3.js";
import solana from "./../../assets/solana.png";
import { ChannelButton } from "./ChannelButton";
const FAVORITE_DAOS_KEY = 'favorite_daos';
export const DAOsExploreSide: FC = () => {
    const { connection } = useConnection();
    const [loading, setLoading] = useState(false);

    const [favoriteDaos, setFavoriteDaos] = useLocalStorage(FAVORITE_DAOS_KEY, []);

    const [daos, setDaos] = React.useState<AccountInfoDeserialized<ChannelAccount>[] | null>(null);

    useEffect(() => {
        setLoading(true);
        getChannelsWithParent(undefined, connection).then((collections) => {
            setDaos(collections);
        }).finally(() => {
            setLoading(false);
        })
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