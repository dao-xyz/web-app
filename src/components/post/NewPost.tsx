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
import React, { useCallback } from 'react';
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useUser } from "../../contexts/UserContext";
import { useNetwork } from "../../contexts/Network";
import { createPostTransaction } from "@s2g/social";
import { useIpfsService } from "../../contexts/IpfsServiceContext";
import { IpfsWalletContext, useIpfsProviderModal } from "../ipfs/useIpfsProviderModal";
import { IpfsServiceModal } from "../ipfs/IpfsServiceModal";
import { useAlert } from "../../contexts/AlertContext";
import IpfsProviderPasswordDialog from "../ipfs/IpfsProviderPasswordDialog";


export function NewPost(props: { channel: PublicKey }) {
    const { connection } = useConnection();
    const [text, setText] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [password, setPassword] = React.useState<string | undefined>(undefined);
    const { config } = useNetwork();
    const { publicKey, sendTransaction } = useWallet();
    const { user } = useUser();
    const { connected, getAdapter, checkPassword, reset } = useIpfsService();
    const [ipfsDialogVisible, setIpfsDialogVisible] = React.useState(false);
    const [passwordDialogVisible, setPasswordDialogVisible] = React.useState(false);

    const { alertError, alert } = useAlert();
    const createPost = useCallback(async () => {
        if (!connected) {
            setIpfsDialogVisible(true);
            return;
        }




        if (!password || !await checkPassword(password)) {
            setPasswordDialogVisible(true);
            return;
        }

        // upload to ipfs
        getAdapter()

        if (!publicKey) {
            alert({
                severity: 'error', text: 'Wallet is not connected'
            })
            throw new WalletNotConnectedError();
        }
        if (!user) {
            alert({
                severity: 'error',
                text: 'You need to create a user to create posts'
            })
            throw new Error("No user account active");
        }

        // Upload content
        setLoading(true)

        const [transaction, postKey] = await createPostTransaction(config.programId, publicKey, user.pubkey, props.channel, Buffer.from(text), 'abc');
        const signature = await sendTransaction(new Transaction().add(transaction), connection,);
        let success = false
        try {
            await connection.confirmTransaction(signature);
            success = true;
            // navigate to redirect if exist, else to home
        }
        catch (error) {
            alert({
                severity: 'error',
                text: "Something went wrong. Error: " + JSON.stringify(error, Object.getOwnPropertyNames(error))
            });
        }
        setLoading(false)

        if (success) {
            alert({
                severity: 'success',
                text: 'Channel created!'
            })
            setText('');
        }

    }, [text])
    return (
        <Grid container justifyContent="space-between" spacing={1}>
            <Grid item flex={1}>
                <TextField size="small"
                    id="outlined-multiline-flexible"
                    label="Create post"
                    multiline
                    maxRows={4}
                    sx={{ width: '100%' }}
                    onChange={(event) => {
                        setText(event.target.value)
                    }}
                /*     value={value}
                    onChange={handleChange} */
                />
            </Grid>

            <Grid item>
                <IconButton disabled={loading || !text.trim()} onClick={createPost}>
                    {!loading ? <Send /> : <CircularProgress size={24} />}
                </IconButton>
            </Grid>
            <IpfsWalletContext.Provider
                value={{
                    visible: ipfsDialogVisible,
                    setVisible: setIpfsDialogVisible,
                }}
            >
                {ipfsDialogVisible && <IpfsServiceModal />}
            </IpfsWalletContext.Provider>
            <IpfsProviderPasswordDialog open={passwordDialogVisible} onReset={() => { }} setOpen={setPasswordDialogVisible} setPassword={setPassword} />

        </Grid>
    );
}

export default NewPost;