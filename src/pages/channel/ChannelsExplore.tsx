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

export const ChannelsExplore: FC = () => {
    const { key } = useParams();
    const { connection } = useConnection();
    const [channel, setChannel] = React.useState<AccountInfoDeserialized<ChannelAccount> | null>(null);
    const [notFound, setNotFound] = React.useState(false);
    return <>CHANNELS</>
}