import { ArrowDownward, ArrowUpward, ChildCare, RocketLaunch, Send } from "@mui/icons-material";
import { Button, Card, CardContent, Container, Grid, IconButton, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getUser, ChannelAccount, getChannel, PostAccount, SimplePost, ContentSourceExternal } from '@s2g/social';
import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { AccountInfoDeserialized } from "@s2g/program";
import ReactMarkdown from 'react-markdown'
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
    const { connection } = useConnection();
    useEffect(() => {
        let url = (post.data.source as ContentSourceExternal).url;
        if (url && isValidHttpUrl(url)) {
            fetch(url, {}).then(async (result) => {
                if (result.status >= 200 && result.status < 300) {
                    console.log(result.status)
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
    }, [])
    return <Card raised elevation={2} >
        <CardContent sx={{ pb: 2 }}>
            <Grid container spacing={1} direction="row">
                <Grid item container width="initial" justifyContent="flex-start" alignContent="center" alignItems="center" direction="column" >
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
                <Grid item container flex="1" direction="column">
                    <Grid item container direction="row">
                        <Grid item>{username}</Grid>
                        <Grid item>{ }</Grid>
                    </Grid>
                    <Grid item>
                        {content ? <ReactMarkdown>{content}</ReactMarkdown> : <Box sx={{ width: '100%', height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Typography color="text.secondary" fontStyle="italic">Post content could not be found</Typography></Box>}
                    </Grid>
                </Grid>
            </Grid>
        </CardContent>
    </Card>
}