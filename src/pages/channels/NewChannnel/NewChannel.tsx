import { Button, Checkbox, Container, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Input, InputLabel, Radio, RadioGroup, Toolbar, Typography } from '@mui/material';
import React, { useContext } from "react";
import Box from '@mui/material/Box';
import { NetworkType } from '../../../types/chain';
import { createChannelAccount, createChannelAccountTransaction, SendConfirm } from '@solvei/solvei-client';
import { getNetworkConfig, getWalletAdapterNetwork } from '../../../services/network';
import { Connection, Transaction } from '@solana/web3.js';
import { Send } from '../../../components/Wallet/Send';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Wallet } from '../../../components/Wallet/Wallet';
import { NetworkContext } from '../../../components/Wallet/Network';

interface NewChannelForm {

    name: string,
    network: NetworkType,
    encrypted: boolean,
    password: string,
    passwordConfirm: string
}



export function NewChannel() {
    const { wallet } = useWallet();
    const [state, setState] = React.useState({
        name: "",
        encrypted: false,
        network: 'devnet',
        password: "",
        passwordConfirm: ""
    } as NewChannelForm);

    const [changingNetwork, setChanginNetwork] = React.useState(false);
    const { disconnect } = useWallet();


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
        console.log('event change')
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
                    networkContext.changeNetwork(getWalletAdapterNetwork(state.network))
                    setChanginNetwork(false)
                }, 3000) // Arbitrary delay to prevent sideffects


                break;
            default:
                setState({ ...state, [name]: event.target.value });
        }

    };

    return (
        <Box>
            <Toolbar />
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
                            <InputLabel htmlFor="channel-name">Channel name</InputLabel>
                            <Input id="channel-name" aria-describedby="channel-name-help" onChange={handleChange("name")} />
                            <FormHelperText id="channel-name-help">Name can not be changed and has to be unique if channel is public</FormHelperText>
                        </FormControl>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Network</FormLabel>
                            <RadioGroup defaultValue="mainnet" row aria-label="network" name="network-group" onClick={handleChange("network")}>
                                <FormControlLabel value="devnet" control={<Radio />} label="Devnet" />
                                <FormControlLabel value="mainnet" control={<Radio />} label="Mainnet" />
                            </RadioGroup>
                        </FormControl>
                        <FormControl margin="dense">
                            <FormControlLabel id="encypted" control={<Checkbox disabled onChange={handleChange('encrypted')} value="encrypted" />} label="Encrypted (not available yet)" />
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
                            <Send disabled={changingNetwork || (state.encrypted && (state.password != state.passwordConfirm || state.password.length == 0) || state.name.length == 0)} name={state.name} network={state.network}></Send>
                        </Box>}

                    </Box>
                </Box>

            </Box>

        </Box >
    )
}