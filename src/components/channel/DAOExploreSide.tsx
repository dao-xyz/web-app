import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { ChannelTree } from "./ChannelTree";
import { Box, Typography } from "@mui/material";
import { usePosts } from "../../contexts/PostContext";

export const DAOExploreSide: FC = () => {
    const { selection } = usePosts();

    const [notFound, setNotFound] = React.useState(false);
    return <Box sx={{}}>

        {
            selection.selectionPath?.length > 0 ? <ChannelTree></ChannelTree> : <Typography sx={{ ml: 2, mr: 2 }} color="text.secondary">No channel selected</Typography>
        }
    </Box >
}