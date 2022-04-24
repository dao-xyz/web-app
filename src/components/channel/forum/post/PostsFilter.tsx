import { ChildCare, RocketLaunch, Send } from "@mui/icons-material";
import { Button, Card, CardContent, Container, Grid, IconButton, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { ChannelAccount, getChannel } from '@dao-xyz/sdk-social';
import { createUserTransaction, UserAccount, getUserByName } from "@dao-xyz/sdk-user"

import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { AccountInfoDeserialized } from "@dao-xyz/sdk-common";
import NewPost from "./NewPost";

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