import { ChildCare, RocketLaunch, Send } from "@mui/icons-material";
import { Button, Card, CardContent, Container, Grid, IconButton, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getUserByName, ChannelAccount, getChannel } from '@s2g/social';
import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { AccountInfoDeserialized } from "@s2g/program";
import NewPost from "../../components/post/NewPost";
import { PostsFilter } from "../../components/post/PostsFilter";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { PostsFeed } from "../../components/post/PostsFeed";

export const Channel: FC = () => {
    const { key } = useParams();
    const { connection } = useConnection();
    const [channel, setChannel] = React.useState<AccountInfoDeserialized<ChannelAccount> | null>(null);
    const [notFound, setNotFound] = React.useState(false);
    const [createdPost, setCreatedPost] = React.useState<PublicKey | undefined>(undefined);

    React.useEffect(() => {
        if (!key) {
            setNotFound(true)
            return;
        }
        try {
            const channelKey = new PublicKey(key as string);
            getChannel(channelKey, connection).then((channel) => {
                setChannel(channel);
            }).catch((error) => {
                console.log(error)
            })
        }
        catch (error) {
            console.log(key, error)
            // bad id
            setNotFound(true)

        }

    }, [key, createdPost])


    return <>{
        notFound ? <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="h6">Channel not found</Typography>
        </Box> :
            <>

                <Container maxWidth="md"  >
                    <Grid container flexDirection="column" spacing={2}>
                        <Grid item>
                            <Typography color="text.secondary" variant="h6">{channel?.data?.name}</Typography>
                            {/* <Typography color="text.secondary" variant="subtitle1" >{
                                (channel?.data?.description as DescriptionString)?.description}
                            </Typography> */}
                        </Grid>
                        <Grid item>
                            <Card raised elevation={2}>
                                <CardContent>
                                    {channel?.pubkey ? <NewPost onCreation={setCreatedPost} channel={channel?.pubkey} /> : <></>}
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item>
                            <PostsFeed channels={channel ? [channel] : []} />
                        </Grid>
                    </Grid>


                </Container>
            </>
    }</>
}