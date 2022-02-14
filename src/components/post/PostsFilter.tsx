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

export const PostsFilter: FC = () => {
    return <Card raised elevation={2} >
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
}