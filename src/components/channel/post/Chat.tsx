import { ChildCare, RocketLaunch, Send } from "@mui/icons-material";
import { Alert, Button, Card, CardContent, Container, Grid, IconButton, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { ChannelAccount, getChannel } from '@dao-xyz/sdk-social';
import React, { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { AccountInfoDeserialized } from "@dao-xyz/sdk-common";
import { PostFeed } from "./ChatFeed";
import { useChannels } from "../../../contexts/ChannelsContext";
import NewPost from "./NewPost";
import useScrollbarSize from 'react-scrollbar-size';
import { useTheme } from "@mui/styles";

export const Chat: FC<{ channel: AccountInfoDeserialized<ChannelAccount> }> = ({ channel }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [notFound, setNotFound] = React.useState(false);
    const [initialFeed, setInitialFeed] = React.useState(false);

    const [showNewMessageAlert, setShowNewMessageAlert] = React.useState(false);
    const { selection, loading } = useChannels();
    const [createdPost, setCreatedPost] = React.useState<PublicKey | undefined>(undefined);
    const [scrollTop, setScrollTop] = useState(0);
    const theme = useTheme();
    const { width } = useScrollbarSize();
    useEffect(() => {
        const onScroll = e => {
            setScrollTop(e.target.documentElement.scrollTop);
            setShowNewMessageAlert(false);
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [scrollTop]);



    const onFeedChange = () => {
        let isAtBottom = contentRef?.current?.scrollHeight - contentRef?.current?.scrollTop === contentRef?.current?.clientHeight;
        if (!isAtBottom) {
            // show alert
            setShowNewMessageAlert(true);
            setTimeout(() => {
                setShowNewMessageAlert(false)
                setInitialFeed(true);
            }, 3000)
        }

    }

    return <Box sx={{ height: '100%', backgroundColor: (theme as any).palette.mode == 'light' ? (theme as any).palette.grey["50"] : (theme as any).palette.background.default }}>{
        notFound ? <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="h6">DAO not found</Typography>
        </Box> :
            /*  <Box sx={{ height: 'calc(100vh - 120px)' }}> */
            /*    <Box sx={{ overflowY: 'scroll', height: '100%' }}> */
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "calc(100vh - 105px)" }} >
                <Grid container flexDirection="column" alignItems="center" sx={{ height: '100%' }}>
                    <Grid ref={contentRef} container item sx={{ flex: 1, display: 'flex', justifyContent: "center", overflowY: 'scroll', width: '100%', mt: 2, /* mr: -2, pr: 2  */ }} >
                        <Grid item>
                            <Box sx={{ /* ml: 2, pr: 16 + "px"  */ }}>
                                <Box sx={{ maxWidth: "md", width: '100%' }}>

                                    <PostFeed onFeedChange={onFeedChange} channels={channel ? [channel] : []} />

                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                    {showNewMessageAlert && initialFeed && !loading && <Alert variant="filled" severity="info">
                        New messages available
                    </Alert>}
                    <Grid container item direction="row" sx={{ width: `100%`, display: 'flex', justifyContent: 'center' }} >
                        <Grid item sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
                            <Card sx={{ width: '100%', flex: 1, maxWidth: 'md' }} raised elevation={8}>
                                <CardContent sx={{ pb: "4px !important" }}>
                                    {channel?.pubkey ? <NewPost previewable={true} onCreation={setCreatedPost} channel={channel?.pubkey} /> : <></>}
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item sx={{ width: width + 'px', height: '100%' }}>
                            <div></div>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        /*   </Box> */


        /*  </Box > */
    }</Box>
}