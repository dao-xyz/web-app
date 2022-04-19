import { ChildCare, RocketLaunch, Send } from "@mui/icons-material";
import { Button, Card, CardContent, Container, Grid, IconButton, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { ChannelAccount, getChannel } from '@dao-xyz/sdk-social';
import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { AccountInfoDeserialized } from "@dao-xyz/sdk-common";
import NewPost from "../post/NewPost";
import { PostsFeed } from "../post/PostsFeed";

export const Chat: FC<{ channel: AccountInfoDeserialized<ChannelAccount> }> = ({ channel }) => {
    const { key } = useParams();
    const { connection } = useConnection();
    const [notFound, setNotFound] = React.useState(false);
    const [createdPost, setCreatedPost] = React.useState<PublicKey | undefined>(undefined);
    return <>{
        notFound ? <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="h6">DAO not found</Typography>
        </Box> :
            <>
                XYZ
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