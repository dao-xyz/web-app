import {
    Checkbox,
    CircularProgress,
    FormControlLabel,
    Grid,

    Paper,
    TextField,

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
import ReactMarkdown from 'react-markdown'

export function NewPost(props: { channel: PublicKey, onCreation: (post: PublicKey) => any }) {
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
    const [previewMarkdown, setPreviewMarkdown] = React.useState(false);

    const { alertError, alert } = useAlert();
    const createPost = useCallback(async () => {
        console.log('create post', password, !connected, !await checkPassword(password))
        if (!connected) {
            setIpfsDialogVisible(true);
            return;
        }

        if (!await checkPassword(password)) {
            setPasswordDialogVisible(true);
            return;
        }
        // Upload content
        setLoading(true)

        const adapter = await getAdapter(password);
        let cid: string = undefined;
        try {
            cid = await adapter.pin(Buffer.from(text))
        } catch (error) {
            alertError(error);
            setLoading(false);
            return;
        }

        if (!publicKey) {
            alert({
                severity: 'error', text: 'Wallet is not connected'
            })
            setLoading(false);
            return;
        }
        if (!user) {
            alert({
                severity: 'error',
                text: 'You need to create a user to create posts'
            })
            setLoading(false);
            return;
        }



        const [transaction, postKey] = await createPostTransaction(config.programId, publicKey, user.pubkey, props.channel, Buffer.from(text), "https://ipfs.io/ipfs/" + cid);
        const signature = await sendTransaction(new Transaction().add(transaction), connection,);
        let success = false
        try {
            await connection.confirmTransaction(signature);
            success = true;
            setPreviewMarkdown(false);
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
                text: 'Post created!'
            })
            setText('');
            props.onCreation(postKey);
        }

    }, [text, connected, password, user])
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

                />
                {text ? <FormControlLabel
                    control={
                        <Checkbox checked={previewMarkdown} onChange={(event) => setPreviewMarkdown(event.target.checked)} name="jason" />
                    }
                    label="Preview markdown"
                />
                    : <></>}
                {
                    previewMarkdown ? <Paper variant="outlined" sx={{ p: 2 }} >
                        <ReactMarkdown>{text}</ReactMarkdown> </Paper> : <></>
                }
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
                {ipfsDialogVisible && <IpfsServiceModal onSave={createPost} />}
            </IpfsWalletContext.Provider>
            <IpfsProviderPasswordDialog open={passwordDialogVisible} onReset={() => { }} setOpen={setPasswordDialogVisible} setPassword={(password) => { setPassword(password); createPost() }} />

        </Grid >
    );
}

export default NewPost;