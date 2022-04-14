import { ArrowDownward, ArrowUpward, ChildCare, RocketLaunch, Send } from "@mui/icons-material";
import { Button, Card, CardContent, Container, Grid, IconButton, Link, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { ChannelAccount, getChannel, PostAccount, UpvoteDownvoteVoteConfig } from '@dao-xyz/sdk-social';
import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { AccountInfoDeserialized } from "@dao-xyz/sdk-common";
import { Link as RouterLink } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'
import { getUserProfilePath } from "../../routes/routes";
import { ContentSourceExternal } from "@dao-xyz/sdk-common";
import { getUser } from "@dao-xyz/sdk-user";
const isValidHttpUrl = (string) => {
    let url = undefined;
    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

export const Post: FC<{ post: AccountInfoDeserialized<PostAccount> }> = ({ post }) => {

    const [content, setContent] = useState<string | undefined>(undefined);
    const [username, setUsername] = useState<string | undefined>(undefined);
    const [date, setDate] = useState<string | undefined>(undefined);

    const { connection } = useConnection();

    const upvote = () => {

    }
    const downvote = () => {

    }

    useEffect(() => {
        let url = (post.data.source as ContentSourceExternal).url;
        if (url && isValidHttpUrl(url)) {
            fetch(url, {}).then(async (result) => {
                if (result.status >= 200 && result.status < 300) {
                    result.text().then((string) => {
                        setContent(string)
                    }).catch(() => {
                        setContent(undefined);
                    })
                }
                else {
                    setContent(undefined);
                }

            }).catch(() => {
                setContent(undefined);
            })
        }
        getUser(post.data.creator, connection).then((user) => {
            setUsername(user.data.name);
        })

        setDate(new Date(post.data.createAtTimestamp.toNumber() * 1000).toLocaleDateString())
    }, [])
    return <Card raised elevation={2} >
        <CardContent sx={{ pb: 2 }}>
            <Grid container spacing={1} direction="row">
                <Grid item container width="initial" justifyContent="flex-start" alignContent="center" alignItems="center" direction="column" >
                    <Grid item>
                        <Typography><b>{(post.data.voteConfig as UpvoteDownvoteVoteConfig).upvote.toNumber()}</b></Typography>
                    </Grid>
                    <Grid item>
                        <IconButton onClick={upvote}>
                            <ArrowUpward />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton onClick={downvote}>
                            <ArrowDownward />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <Typography><b>{(post.data.voteConfig as UpvoteDownvoteVoteConfig).downvote.toNumber()}</b></Typography>
                    </Grid>
                </Grid>
                <Grid item container flex="1" direction="column">
                    <Grid item container spacing={1} direction="row">
                        <Grid item ><Link component={RouterLink} to={getUserProfilePath(username)} color="text.secondary">{username}</Link></Grid>
                        <Grid item color="text.secondary">|</Grid>
                        <Grid item color="text.secondary">{date}</Grid>
                    </Grid>
                    {content ? <Grid item >
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </Grid> : <Grid item flex="1" >
                        <Box sx={{ width: '100%', height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Typography color="text.secondary" fontStyle="italic">Post content could not be found</Typography></Box>
                    </Grid>}
                </Grid>
            </Grid>
        </CardContent>
    </Card>
}