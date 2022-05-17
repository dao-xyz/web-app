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
import { useTheme } from "@mui/styles";

const mockPosts = (darkMode: boolean): AccountInfoDeserialized<PostAccount>[] => [
    {
        data: ({
            channel: undefined,
            content: new StringPostContent({
                string: `<div style="position: relative; height: 20px"><div style="position: absolute; top: 30px; left: 20px"><h3>dao | xyz</h3><br></div></div><video width="100%" playsinline autoplay muted loop style="margin-bottom: 10px"> <source src="https://dao-xyz-media.s3.us-east-1.amazonaws.com/${darkMode ? 'night' : 'day'}.mp4" type="video/mp4"> type="video/ogg">Your browser does not support the video tag.</video>\n\nThis is a platform where communities and organization can grow and prosper, just like this tree. By combining state of the art governance protocols with an adaptive  post-format and a fully decentralized data storage layer we will revolutionize the way internet is controlled and consumed`

                /*                 string: `<video width="100%" playsinline autoplay muted loop style="margin-bottom: 10px"> <source src="https://dao-xyz-media.s3.us-east-1.amazonaws.com/${darkMode ? 'night' : 'day'}.mp4" type="video/mp4"> type="video/ogg">Your browser does not support the video tag.</video>\n\nThis is a platform where communities and organization can grow and prosper, just like this tree. By combining state of the art governance protocols with an adaptive  post-format and a fully decentralized data storage layer we will revolutionize the way internet is controlled and consumed` */
            }),
            createAtTimestamp: new BN(1652531447),
            creator: "Mr Shib",
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
                string: 'We are not really live yet, but please follow our [Twitter](https://twitter.com/DAOxyzDAO)  <img src="https://avatars.githubusercontent.com/u/50278?s=200&v=4" alt="drawing" style="width: 30px; margin-bottom: -10px"/> for updates!'
            }),
            createAtTimestamp: new BN(1652531447),
            creator: "Mr Shib",
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
                string: 'Just found this tune! wu think?\n\n\n<iframe width="100%" height="315" src="https://www.youtube.com/embed/IwLSrNu1ppI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
            }),
            createAtTimestamp: new BN(1652531447),
            creator: "Mr Shib",
            hash: undefined,
            parent: undefined,
            source: undefined,
            voteConfig: undefined
        } as any as PostAccount),
        pubkey: Keypair.generate().publicKey
    },
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
    const theme = useTheme();

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
            let mockPostsGenerated = mockPosts(theme["palette"].mode != 'light')
            setPosts(mockPostsGenerated);
            setChildrenPosts(createChildrenMap(mockPostsGenerated))
        }


    }
    useEffect(() => {
        setPosts([]);
    }, [props.channels[0].pubkey.toString()])

    useEffect(() => {

        updateContent();

    }, [isMock, posts.length, theme["palette"].mode])
    useEffect(() => {
        if (isMock) {
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
        <Box sx={{ pb: 1 }}>
            {loading ? <><Skeleton sx={{ mt: 2, mb: 2 }} animation="wave" variant="rectangular" width='100%' height={200} /><Skeleton sx={{ mt: 2, mb: 2 }} animation="wave" variant="rectangular" width='100%' height={75} /><Skeleton sx={{ mt: 2, mb: 2 }} animation="wave" variant="rectangular" width='100%' height={150} /></> : <></>}
            {!loading && (posts.length > 0 ? posts.map((post, ix) => <Box key={post.pubkey.toBase58()} sx={{ mt: ix > 0 ? 2 : 0, mb: 2 }} ><Message post={post} commentsCount={childrenCount(post.pubkey)} /></Box>) : <Box sx={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}><Typography color="text.secondary">No messages found</Typography></Box>)}

        </Box>
    );
}

