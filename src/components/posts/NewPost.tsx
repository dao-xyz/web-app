import {
    Box,
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
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import * as React from 'react';


export function NewPost(props: { channel: PublicKey }) {
    const { connection } = useConnection();
    const [text, setText] = React.useState('');
    return (
        <Grid container justifyContent="space-between" spacing={1}>
            <Grid item flex={1}>
                <TextField size="small"
                    id="outlined-multiline-flexible"
                    label="Create post"
                    multiline
                    maxRows={4}
                    sx={{ width: '100%' }}
                /*     value={value}
                    onChange={handleChange} */
                />
            </Grid>

            <Grid item>
                <IconButton>
                    <Send />
                </IconButton>
            </Grid>

        </Grid>
    );
}

export default NewPost;
