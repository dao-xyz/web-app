import { ChildCare, RocketLaunch, Send } from "@mui/icons-material";
import { Button, Card, CardContent, Container, Grid, IconButton, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getChannel } from "@solvei/solvei-client";
import { AccountDeserialized } from "@solvei/solvei-client/models";
import { ChannelAccount, DescriptionString } from "@solvei/solvei-client/schema";
import * as React from 'react';
import { useParams } from "react-router";
import NewPost from "../../../components/posts/NewPost";

export default function Channel() {
    const { key } = useParams();
    const { connection } = useConnection();
    const [channel, setChannel] = React.useState<AccountDeserialized<ChannelAccount> | null>(null);
    const [notFound, setNotFound] = React.useState(false);

    React.useEffect(() => {
        if (!key) {
            setNotFound(true)
            return;
        }
        try {
            const channelKey = new PublicKey(key as string);
            getChannel(channelKey, connection).then((channel) => {
                console.log(channel)
                setChannel({
                    key: channelKey,
                    data: channel
                });
            }).catch((error) => {
                console.log(error)
            })
        }
        catch (error) {
            console.log(key, error)
            // bad id
            setNotFound(true)

        }

    }, [key])


    return <>{
        notFound ? <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="h6">Channel not found</Typography>
        </Box> :
            <>

                <Container maxWidth="sm"  >
                    <Grid container flexDirection="column" spacing={2}>
                        <Grid item>
                            <Typography color="text.secondary" variant="h6">{channel?.data?.name}
                            </Typography>
                            <Typography color="text.secondary" variant="subtitle1" >{
                                (channel?.data?.description as DescriptionString)?.description}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Card raised elevation={2}>
                                <CardContent>
                                    {channel?.key ? <NewPost channel={channel?.key} /> : <></>}
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item>

                            <Card raised elevation={2} >
                                <CardContent sx={{ pb: 2 }}>
                                    <Grid container spacing={1}>
                                        <Grid item>
                                            <Button variant="outlined" startIcon={<RocketLaunch />}>
                                                Trending
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button variant="outlined" startIcon={<ChildCare />}>
                                                New
                                            </Button>
                                        </Grid>


                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>


                </Container>
            </>
    }</>
}

