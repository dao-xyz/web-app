import {
    Box,
    CircularProgress,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    TextField,
    Toolbar,
    Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Send } from "@mui/icons-material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import React, { useCallback, useEffect, useState } from 'react';
import { PostsFilter } from '../post/PostsFilter';
import { ChannelAccount, getPostsByChannel, PostAccount } from "@s2g/social";
import { AccountInfoDeserialized, PROGRAM_ID } from "@s2g/program";
import { Post } from "./Post";


export const PostsFeed = (props: { channels: AccountInfoDeserialized<ChannelAccount>[] }) => {
    const [posts, setPosts] = useState<AccountInfoDeserialized<PostAccount>[]>([]);
    const { connection } = useConnection();
    useEffect(() => {
        const postPromises: Promise<AccountInfoDeserialized<PostAccount>[]>[] = []
        for (const channel of props.channels) {
            console.log('GET POST BY CHANNEL', channel.pubkey, channel.pubkey.constructor.name)
            postPromises.push(getPostsByChannel(channel.pubkey, connection, PROGRAM_ID))
        }
        Promise.all(postPromises).then(results => {
            console.log("RESULTS", results, results.flat(1));
            setPosts(results.flat(1))
        })
    }, [props.channels])
    return (
        <>
            <PostsFilter />
            {posts.map((post, ix) => <Box key={ix} sx={{ mt: 2, mb: 2 }} ><Post post={post} /></Box>)}
        </>
    );
}

