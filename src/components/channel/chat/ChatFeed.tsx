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
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChannelAccount, getPostsByChannel, PostAccount } from "@dao-xyz/sdk-social";
import { AccountInfoDeserialized } from "@dao-xyz/sdk-common";
import { Message } from "./Message";

// Assumes sorted
const mergePosts = (a: AccountInfoDeserialized<PostAccount>[], b: AccountInfoDeserialized<PostAccount>[]): AccountInfoDeserialized<PostAccount>[] => {
    if (a.length == 0)
        return b
    if (b.length == 0)
        return a
    let j = 0;
    let ret = [];
    let added = new Set<string>();
    const save = (account: AccountInfoDeserialized<PostAccount>) => {
        const str = account.pubkey.toString();
        if (!added.has(str)) {
            added.add(str);
            ret.push(account);
        }
    };
    for (let i = 0; i < a.length; i++) {
        while (j <= b.length && a[i].data.createAtTimestamp.cmp(b[j].data.createAtTimestamp) == -1) {
            save(b[j]);
            j++;
        }
        save(a[i]);
    }

    while (j < b.length) {
        save(b[j]);
        j++;
    }
    return ret;
}

const postsEquals = (a: AccountInfoDeserialized<PostAccount>[], b: AccountInfoDeserialized<PostAccount>[]): boolean => {
    if (a.length != b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (!a[i].pubkey.equals(b[i].pubkey)) {
            return false;
        }
    }
    return true;
}

export const ChatFeed = (props: { channels: AccountInfoDeserialized<ChannelAccount>[], onFeedChange?: () => void }) => {
    const [posts, setPosts] = useState<AccountInfoDeserialized<PostAccount>[]>([]);
    const { connection } = useConnection();
    const [loading, setLoading] = useState(false);

    const updateContent = () => {
        /* setLoading(true) */
        const postPromises: Promise<AccountInfoDeserialized<PostAccount>[]>[] = []
        for (const channel of props.channels) {
            postPromises.push(getPostsByChannel(channel.pubkey, connection))
        }

        Promise.all(postPromises).then(results => {
            let flatResults = results.flat(1);
            let updatedResults = mergePosts(posts, flatResults.sort((a, b) => a.data.createAtTimestamp.cmp(b.data.createAtTimestamp)));

            if (!postsEquals(posts, updatedResults)) {
                setPosts(updatedResults);
                if (props.onFeedChange) {
                    props.onFeedChange();
                }
            }

        }).finally(() => {
            /*  setLoading(false) */
        })
    }
    useEffect(() => {
        setPosts([]);
    }, [props.channels[0].pubkey.toString()])
    useEffect(() => {
        const interval = setInterval(() => {
            updateContent();
        }, 3000);
        return () => clearInterval(interval);
    }, [props.channels[0].pubkey.toString(), posts.length, posts ? posts[posts.length - 1]?.pubkey.toString() : undefined])
    return (
        <>
            {loading ? <><Skeleton sx={{ mt: 2, mb: 2 }} animation="wave" variant="rectangular" width='100%' height={200} /><Skeleton sx={{ mt: 2, mb: 2 }} animation="wave" variant="rectangular" width='100%' height={75} /><Skeleton sx={{ mt: 2, mb: 2 }} animation="wave" variant="rectangular" width='100%' height={150} /></> : <></>}
            {posts.length > 0 ? posts.map((post) => <Box key={post.pubkey.toBase58()} sx={{ mt: 2, mb: 2 }} ><Message post={post} /></Box>) : <Box sx={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}><Typography color="text.secondary">No messages found</Typography></Box>}
        </>
    );
}

