import {
    Box,

    Skeleton,

    Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Send } from "@mui/icons-material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChannelAccount, getPostsByChannel, PostAccount, StringPostContent } from "@dao-xyz/sdk-social";
import { AccountInfoDeserialized } from "@dao-xyz/sdk-common";
import { Message } from "./Message";
import { useNetwork } from "../../../contexts/Network";
import BN from 'bn.js';
const mockPosts: AccountInfoDeserialized<PostAccount>[] = [
    {
        data: ({
            channel: undefined,
            content: new StringPostContent({
                string: '# dao | xyz \nThis is some info about DAO XYZ!'
            }),
            createAtTimestamp: new BN(1640991600),
            creator: Keypair.generate().publicKey,
            hash: undefined,
            parent: undefined,
            source: undefined,
            voteConfig: undefined
        } as any as PostAccount),
        pubkey: Keypair.generate().publicKey
    },
    {
        data: ({
            channel: undefined,
            content: new StringPostContent({
                string: 'Welcome'
            }),
            createAtTimestamp: new BN(1640991600),
            creator: Keypair.generate().publicKey,
            hash: undefined,
            parent: undefined,
            source: undefined,
            voteConfig: undefined
        } as any as PostAccount),
        pubkey: Keypair.generate().publicKey
    },
    {
        data: ({
            channel: undefined,
            content: new StringPostContent({
                string: 'Hello?'
            }),
            createAtTimestamp: new BN(1640991600),
            creator: Keypair.generate().publicKey,
            hash: undefined,
            parent: undefined,
            source: undefined,
            voteConfig: undefined
        } as any as PostAccount),
        pubkey: Keypair.generate().publicKey
    }
];
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
const createChildrenMap = (posts: AccountInfoDeserialized<PostAccount>[]): { [key: string]: AccountInfoDeserialized<PostAccount>[] } => {
    let ret = {};
    posts.forEach((post) => {
        if (post.data.parent) {
            let arr = ret[post.data.parent.toBase58()];
            if (!arr) {
                arr = [];
                ret[post.data.parent.toBase58()] = arr;
            }
            arr.push(post)
        }
    })

    return ret;
}
export const PostFeed = (props: { channels: AccountInfoDeserialized<ChannelAccount>[], onFeedChange?: () => void }) => {
    const [posts, setPosts] = useState<AccountInfoDeserialized<PostAccount>[]>([]);
    const [childrenPosts, setChildrenPosts] = useState<{ [key: string]: AccountInfoDeserialized<PostAccount>[] }>({});

    const { connection } = useConnection();
    const [loading, setLoading] = useState(false);
    const { isMock } = useNetwork();
    const childrenCount = (key: PublicKey) => childrenPosts[key.toBase58()] ? childrenPosts[key.toBase58()].length : 0;
    const updateContent = () => {
        /* setLoading(true) */

        if (!isMock) {
            setLoading(true);
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
                setChildrenPosts(createChildrenMap(posts))
                setLoading(false);

            })
        }
        else {
            setPosts(mockPosts);
            setChildrenPosts(createChildrenMap(mockPosts))
        }


    }
    useEffect(() => {
        setPosts([]);
    }, [props.channels[0].pubkey.toString()])

    useEffect(() => {
        if (isMock) {
            updateContent();
            return;
        }
        const interval = setInterval(() => {
            if (!loading) {
                updateContent();
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [props.channels[0].pubkey.toString(), posts.length, posts ? posts[posts.length - 1]?.pubkey.toString() : undefined])
    return (
        <>
            {loading ? <><Skeleton sx={{ mt: 2, mb: 2 }} animation="wave" variant="rectangular" width='100%' height={200} /><Skeleton sx={{ mt: 2, mb: 2 }} animation="wave" variant="rectangular" width='100%' height={75} /><Skeleton sx={{ mt: 2, mb: 2 }} animation="wave" variant="rectangular" width='100%' height={150} /></> : <></>}
            {!loading && (posts.length > 0 ? posts.map((post) => <Box key={post.pubkey.toBase58()} sx={{ mt: 2, mb: 2 }} ><Message post={post} commentsCount={childrenCount(post.pubkey)} /></Box>) : <Box sx={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}><Typography color="text.secondary">No messages found</Typography></Box>)}
        </>
    );
}

