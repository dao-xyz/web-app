import {
    Checkbox,
    CircularProgress,
    FormControlLabel,
    Grid,
    Link,
    Paper,
    TextField,

} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Send } from "@mui/icons-material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
import React, { useCallback } from 'react';
import { createPostTransaction, CreateUpvoteDownvoteVoteConfig, LinkPostContent } from "@dao-xyz/sdk-social";
import { useIpfsService } from "../../../../contexts/IpfsServiceContext";
import { IpfsWalletContext, useIpfsProviderModal } from "../../../ipfs/useIpfsProviderModal";
import { IpfsServiceModal } from "../../../ipfs/IpfsServiceModal";
import { useAlert } from "../../../../contexts/AlertContext";
import IpfsProviderPasswordDialog from "../../../ipfs/IpfsProviderPasswordDialog";
import ReactMarkdown from 'react-markdown'
import { AuthorityType, getSignerAuthority } from "@dao-xyz/sdk-social";
import { useSmartWallet } from "../../../../contexts/SmartWalletContext";
import { SETTINGS_BURNER } from "../../../../routes/routes";
import { Link as RouterLink } from 'react-router-dom';
export function NewPost(props: { previewable?: boolean, channel: PublicKey, onCreation: (post: PublicKey) => any }) {
    const { connection } = useConnection();
    const [text, setText] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [password, setPassword] = React.useState<string | undefined>(undefined);
    const { publicKey, sendTransaction } = useWallet();
    const { burnerWallet, burnerWalletBalance } = useSmartWallet();
    const { connected, getAdapter, checkPassword, reset } = useIpfsService();
    const [ipfsDialogVisible, setIpfsDialogVisible] = React.useState(false);
    const [passwordDialogVisible, setPasswordDialogVisible] = React.useState(false);
    const [previewMarkdown, setPreviewMarkdown] = React.useState(false);
    const { alertError, alert } = useAlert();
    const createPost = useCallback(async () => {
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
            cid = await adapter.pin(Buffer.from(text), true)
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


        try {
            let burnerAsSigner = !!burnerWallet;
            let signer = burnerAsSigner ? burnerWallet.publicKey : publicKey;
            let authorityConfig = await getSignerAuthority(signer, props.channel, AuthorityType.CreatePost, connection);
            const [tx, postKey] = await createPostTransaction(props.channel, publicKey, signer, new LinkPostContent({
                url: "https://ipfs.io/ipfs/" + cid
            }), undefined, new CreateUpvoteDownvoteVoteConfig(), authorityConfig);
            let transaction = new Transaction().add(tx);

            const signature = burnerAsSigner ? await sendAndConfirmTransaction(connection, transaction, [this.burner]) : await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature);
            setPreviewMarkdown(false);
            alert({
                severity: 'success',
                text: 'Post created!'
            })
            setText('');
            props.onCreation(postKey);
            // navigate to redirect if exist, else to home
        }
        catch (error) {
            alert({
                severity: 'error',
                text: "Something went wrong. Error: " + JSON.stringify(error, Object.getOwnPropertyNames(error))
            });
        }
        finally {
            setLoading(false)

        }



    }, [text, connected, password])
    return (
        <Grid container direction="column">
            <Grid container item justifyContent="space-between" spacing={1}>
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
                        onKeyPress={(ev) => {
                            if (ev.key === 'Enter' && !ev.shiftKey) {
                                ev.preventDefault();

                                // Send
                                createPost();
                            }
                        }}
                        value={text}
                    />
                    {(text.length > 0 && props.previewable) && <FormControlLabel
                        control={
                            <Checkbox checked={previewMarkdown} onChange={(event) => setPreviewMarkdown(event.target.checked)} name="jason" />
                        }
                        label="Preview markdown"
                    />
                    }
                    {
                        previewMarkdown ? <Paper variant="outlined" sx={{ p: 2 }} >
                            <ReactMarkdown components={{
                                img({ ...props }) {
                                    return (<img  {...props} width={'100%'} />)
                                }

                            }}
                            >{text}</ReactMarkdown> </Paper> : <></>
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
            <Grid item container color="text.secondary" sx={{ height: '5px', justifyContent: "right" }}>
                {!!burnerWallet && <Grid item sx={{ mr: 1 }}>
                    <Link variant="caption" component={RouterLink} to={SETTINGS_BURNER} target="_blank">Burner wallet balance: {burnerWalletBalance}</Link>
                </Grid>}


            </Grid>
        </Grid >
    );
}

export default NewPost;