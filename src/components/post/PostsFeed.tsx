import {
    Box,
    CircularProgress,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    Skeleton,
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
    const [loading, setLoading] = useState(false);
    useEffect(() => {

        setLoading(true)
        console.log('loading');
        const postPromises: Promise<AccountInfoDeserialized<PostAccount>[]>[] = []
        for (const channel of props.channels) {
            postPromises.push(getPostsByChannel(channel.pubkey, connection, PROGRAM_ID))
        }
        Promise.all(postPromises).then(results => {
            setPosts(results.flat(1))
        }).finally(() => {
            console.log('done')
            setLoading(false)
        })
    }, [props.channels])
    return (
        <>
            <PostsFilter />
            {!loading ? <><Skeleton sx={{ mt: 2, mb: 2 }} animation="wave" variant="rectangular" width='100%' height={200} /><Skeleton sx={{ mt: 2, mb: 2 }} animation="wave" variant="rectangular" width='100%' height={75} /><Skeleton sx={{ mt: 2, mb: 2 }} animation="wave" variant="rectangular" width='100%' height={150} /></> : <></>}
            {posts.map((post) => <Box key={post.pubkey.toBase58()} sx={{ mt: 2, mb: 2 }} ><Post post={post} /></Box>)}
        </>
    );
}

