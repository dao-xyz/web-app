import { ChildCare, RocketLaunch, Send } from "@mui/icons-material";
import { Button, Card, CardContent, Container, Grid, IconButton, List, ListItem, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { DAO_NEW, getChannelRoute, getNewChannelRoute } from "../../routes/routes";
import { usePosts } from "../../contexts/PostContext";
import { PostInterface } from "@dao-xyz/social-interface";
import { Shard } from "@dao-xyz/shard";
/* export const groupByChannelType = (channels: AccountInfoDeserialized<Shard<PostInterface>>[]): Map<ChannelType, AccountInfoDeserialized<Shard<PostInterface>>[]> => {
        let ret: Map<ChannelType, AccountInfoDeserialized<Shard<PostInterface>>[]> = new Map();
            for (const channel of channels) {
                let arr = ret.get(channel.data.channelType);
            if (!arr) {
                arr = [];
            ret.set(channel.data.channelType, arr)
        }
            arr.push(channel);
    }
            return ret;
} */
export const Collection: FC<{ channel: Shard<PostInterface> }> = ({ channel }) => {
    const { selection, loading, select } = usePosts();
    const navigate = useNavigate();
    const onClickChannel = (channel: Shard<PostInterface>) => {
        navigate(getChannelRoute(channel.cid));
    }
    return <Container maxWidth="md"  >
        <Grid container flexDirection="column" spacing={2}>
            <Grid container item flexDirection="row" justifyContent="space-between">
                <Grid item>
                    <Typography color="text.secondary" variant="h6">Explore</Typography>
                </Grid>
                <Grid item>
                    <Button component={RouterLink} to={getNewChannelRoute(channel.cid)}  >Create channel</Button>
                </Grid>
            </Grid>
            <Grid item >{
                selection.selectionTree && selection.selectionTree[channel.cid]?.length > 0 ? <Grid container sx={{ width: '100%', maxWidth: 360 }}>
                    {/* Array.from(groupByChannelType(selection.selectionTree[channel.pubkey.toString()]).entries()).map(([type, channels]) =>
                    <><Typography key={type} variant="h5">
                        {type == ChannelType.Chat && "Chats"}
                        {type == ChannelType.Collection && "Catgories"}
                        {type == ChannelType.Forum && "Forums"}
                    </Typography> */}
                    {
                        selection.selectionTree[channel.cid].map((channel, ix) => <Grid item key={ix} sx={{ width: '100%', height: '40px', mt: 1, mb: 1, bgcolor: theme => theme.palette.action.hover }}>
                            <Button variant="text" sx={{ width: '100%', height: '100%', justifyContent: 'left' }} onClick={() => onClickChannel(channel)} >
                                {channel.interface.content.toString()}
                            </Button>
                        </Grid>)
                    }

                </Grid> : (<Box sx={{ width: '100%', height: '100%', textAlign: 'center' }}>No channels exist</Box >)
            }</Grid>

        </Grid>
    </Container >

    /*  <>{
                        notFound ? <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <Typography variant="h6">Not found</Typography>
                        </Box> :
                            <>
                                {isDao(channel.data) ? 'DAO' : 'Collection'}
                            </>
                    }</> */
}