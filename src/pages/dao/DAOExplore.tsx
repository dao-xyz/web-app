import { useConnection } from "@solana/wallet-adapter-react";
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
import { ChannelButton } from "../../components/channel/ChannelButton";

export const DAOExplore: FC = () => {
    const { connection } = useConnection();
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const navigateToChannel = (channel: PublicKey) => {
        navigate(getChannelRoute(channel));

    }
    const [daos, setDaos] = React.useState<AccountInfoDeserialized<ChannelAccount>[] | null>(null);

    useEffect(() => {
        setLoading(true);
        getChannelsWithParent(undefined, connection).then((collections) => {
            setDaos(collections);
        }).finally(() => {
            setLoading(false);
        })
    }, [])
    return <Container maxWidth="md"  >
        <Grid container flexDirection="column" spacing={2}>
            <Grid container item flexDirection="row" justifyContent="space-between">
                <Grid item>
                    <Typography color="text.secondary" variant="h6">DAOs</Typography>
                </Grid>
                <Grid item>
                    <Button component={RouterLink} to={getNewChannelRoute(undefined)}>Create DAO</Button>
                </Grid>
            </Grid>
            <>
            </>
            {
                daos ? daos.map((dao, ix) =>
                    <Grid key={ix} container item>
                        <ChannelButton channel={dao} size='large'></ChannelButton>
                    </Grid>
                ) : loading ? <Grid item>< CircularProgress /> </Grid > : <Grid item>No DAOs exist</Grid >
            }
        </Grid>
    </Container >
}