import { ArrowDownward, ArrowUpward, ChildCare, RocketLaunch, Send } from "@mui/icons-material";
import { Button, Card, CardContent, Container, Grid, IconButton, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getUserByName, ChannelAccount, getChannel, PostAccount, SimplePost } from '@s2g/social';
import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { AccountInfoDeserialized } from "@s2g/program";

import bs58 from 'bs58';
export const Post: FC<{ post: AccountInfoDeserialized<PostAccount> }> = ({ post }) => {

    return <Card raised elevation={2} >
        <CardContent sx={{ pb: 2 }}>
            <Grid container spacing={1} direction="row">
                <Grid item container width="initial" justifyContent="center" alignContent="center" alignItems="center" direction="column" >
                    <Grid item>
                        <Typography>{(post.data.type as SimplePost).upvotes.toNumber()}</Typography>
                    </Grid>
                    <Grid item>
                        <IconButton>
                            <ArrowUpward />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton>
                            <ArrowDownward />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <Typography>{(post.data.type as SimplePost).downvotes.toNumber()}</Typography>
                    </Grid>
                </Grid>
                <Grid item container direction="column">

    

                </Grid>
            </Grid>
        </CardContent>
    </Card>
}