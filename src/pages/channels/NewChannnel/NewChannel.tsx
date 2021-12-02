import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Input, InputLabel, Radio, RadioGroup, Toolbar, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { createChannelTransaction, } from '@solvei/solvei-client';
import { getNetworkConfig } from '../../../services/network';
import { Transaction } from '@solana/web3.js';
import { Wallet } from '../../../components/Wallet/Wallet';
import { NetworkContext } from '../../../components/Wallet/Network';
import { WalletAdapterNetwork, WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React, { useCallback, useContext } from "react";
import { DescriptionString } from '@solvei/solvei-client/schema';
import LoadingButton from '@mui/lab/LoadingButton';

interface NewChannelForm {

    name: string,
    description: string,
    network: WalletAdapterNetwork,
    encrypted: boolean,
    password: string,
    passwordConfirm: string
}




export function NewChannel() {
    const { wallet } = useWallet();
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();

    const [state, setState] = React.useState({
        name: "",
        encrypted: false,
        network: WalletAdapterNetwork.Devnet,
        password: "",
        passwordConfirm: ""
    } as NewChannelForm);

    const [changingNetwork, setChanginNetwork] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const { disconnect } = useWallet();

    const onClick = useCallback(async () => {
        if (!publicKey)
            throw new WalletNotConnectedError();

        const networkConfig = getNetworkConfig(state.network);
        const user = PublicKey.default;
        const [transaction, _] = await createChannelTransaction(state.name, new DescriptionString(state.description), publicKey, user, networkConfig.programId);
        const signature = await sendTransaction(new Transaction().add(transaction), connection);

        await connection.confirmTransaction(signature, "processed");
    }, [publicKey, sendTransaction, connection, state]);

    const validate = async (channel: NewChannelForm) => {

        // try to create channel, if failure prompt message
        /*  const { publicKey, sendTransaction } = wallet.useWallet();
         
         const sendAndConfirm: SendConfirm = async (connection: Connection, transaction: Transaction): Promise<string> => {
             const signature = await sendTransaction(transaction, connection);
             await connection.confirmTransaction(signature, 'processed')
             return signature;
         }
         await createChannelAccount(channel.name, publicKey, connection, networkConfig.programId, sendAndConfirm); */
        /* if (!publicKey) {
            throw new Error('Could not find publickey for wallet');
        }
        const networkConfig = getNetworkConfig(channel.network);
        const [transaction, _] = await createChannelAccountTransaction(channel.name, publicKey, connection, networkConfig.programId);

        setTransaction(new Transaction().add(transaction));
        setValid(true); */

    }

    const networkContext = useContext(NetworkContext);
    const handleChange = (name: string) => async (event: any) => {
        switch (name) {
            case 'encrypted':
                setState({ ...state, [name]: event.target.checked });
                break;
            case 'password':
                state.password = event.target.value
                setState({ ...state });
                break;
            case 'passwordConfirm':
                state.passwordConfirm = event.target.value
                setState({ ...state });
                break;
            case 'network':
                await disconnect();
                state.network = event.target.value
                setState({ ...state });

                // For some reason we need a bit of timout here
                setChanginNetwork(true)
                setTimeout(() => {
                    networkContext.changeNetwork(state.network)
                    setChanginNetwork(false)
                }, 3000) // Arbitrary delay to prevent sideffects


                break;
            default:
                setState({ ...state, [name]: event.target.value });
        }

    };

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "center", width: "100vw", mt: 20 }}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    maxWidth: "350px"
                }}>
                    <h1>Create a new channel</h1>
                    <FormGroup >
                        <FormControl margin="dense" required>
                            <InputLabel htmlFor="channel-name">Channel</InputLabel>
                            <Input id="channel-name" aria-describedby="channel-name-help" onChange={handleChange("name")} />
                            <FormHelperText id="channel-name-help">Name can not be changed and has to be unique if channel is public</FormHelperText>
                        </FormControl>
                        <FormControl margin="dense">
                            <InputLabel htmlFor="channel-description">Description</InputLabel>
                            <Input id="channel-description" aria-describedby="channel-description-help" onChange={handleChange("description")} />
                            <FormHelperText id="channel-description-help">What is this channel about?</FormHelperText>
                        </FormControl>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Network</FormLabel>
                            <RadioGroup defaultValue="mainnet" row aria-label="network" name="network-group" onClick={handleChange("network")}>
                                <FormControlLabel value={WalletAdapterNetwork.Devnet} control={<Radio />} label="Devnet" />
                                <FormControlLabel value={WalletAdapterNetwork.Mainnet} control={<Radio />} label="Mainnet" />
                            </RadioGroup>
                        </FormControl>
                        <FormControl margin="dense">
                            <FormControlLabel id="encypted" control={<Checkbox disabled onChange={handleChange('encrypted')} value="encrypted" />} label="Encryption (not available yet)" />
                        </FormControl>
                        {
                            state.encrypted ?
                                <>
                                    <FormControl margin="dense">
                                        <InputLabel htmlFor="encrypted">Password</InputLabel>
                                        <Input type="password" id="encrypted" aria-describedby="encrypted-help" onChange={handleChange("password")} />
                                        <FormHelperText id="password-help">This is on you</FormHelperText>
                                    </FormControl>
                                    <FormControl margin="dense" error={state.password !== state.passwordConfirm && state.passwordConfirm.length > 0}>
                                        <InputLabel htmlFor="password-confirm">Confirm password</InputLabel>
                                        <Input type="password" id="password-confirm" onChange={handleChange("passwordConfirm")} />
                                    </FormControl>
                                </>
                                : <></>
                        }
                    </FormGroup>

                    <Box sx={{ mt: 2 }}>
                        {<Typography sx={{ flex: 1, textAlign: 'left' }}>
                            Account creation will create a program owned account that stores information about the channel and the content it contains. Account creation cost can be reedemed at any time. For this account minimum balance for rent exemption must be paid
                        </Typography>}
                        {<Box sx={{ display: "flex", justifyContent: "right", mt: 2 }}>
                            <Wallet></Wallet>
                            <LoadingButton loading={loading} onClick={onClick} disabled={changingNetwork || (state.encrypted && (state.password != state.passwordConfirm || state.password.length == 0) || state.name.length == 0) || !publicKey} >
                                Create
                            </LoadingButton>
                            {/* <Send disabled={changingNetwork || (state.encrypted && (state.password != state.passwordConfirm || state.password.length == 0) || state.name.length == 0)} name={state.name} network={state.network}></Send> */}
                        </Box>}

                    </Box>
                </Box>

            </Box>

        </Box >
    )
}