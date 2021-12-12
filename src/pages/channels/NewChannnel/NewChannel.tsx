import { Button, Checkbox, Container, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Input, InputLabel, Radio, RadioGroup, Toolbar, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { createChannelTransaction, } from '@solvei/solvei-client';
import { getNetworkConfig } from '../../../services/network';
import { Transaction } from '@solana/web3.js';
import { Wallet } from '../../../components/network/Wallet/Wallet';
import { NetworkContext } from '../../../contexts/Network';
import { WalletAdapterNetwork, WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React, { useCallback, useContext } from "react";
import { DescriptionString } from '@solvei/solvei-client/schema';
import LoadingButton from '@mui/lab/LoadingButton';
import { UserContext } from '../../../contexts/UserContext';
import AlertContext from '../../../contexts/AlertContext';
import { getChannelRoute } from '../../../routes/routes';
import { useNavigate } from 'react-router';

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
    const { user } = useContext(UserContext);
    const alertContext = useContext(AlertContext);
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();
    const network = useContext(NetworkContext);

    const [state, setState] = React.useState({
        name: "",
        encrypted: false,
        password: "",
        passwordConfirm: ""
    } as NewChannelForm);


    const { disconnect } = useWallet();

    const onClick = useCallback(async () => {
        if (!publicKey)
            throw new WalletNotConnectedError();
        if (!user)
            throw new Error("No user account active");

        setLoading(true)

        const [transaction, channelKey] = await createChannelTransaction(state.name, new DescriptionString(state.description), publicKey, user.key, network.config.programId);
        const signature = await sendTransaction(new Transaction().add(transaction), connection);
        let success = false
        try {
            await connection.confirmTransaction(signature, "processed");
            success = true;
            // navigate to redirect if exist, else to home

        }
        catch (error) {
            alertContext.alert({
                severity: 'error',
                text: "Something went wrong. Error: " + JSON.stringify(error, Object.getOwnPropertyNames(error))
            });
        }
        setLoading(false)

        if (success) {
            navigate(network.getPathWithNetwork(getChannelRoute(channelKey)));
        }



    }, [publicKey, sendTransaction, connection, state]);

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
            default:
                setState({ ...state, [name]: event.target.value });
        }

    };

    return (
        <Container maxWidth="xs" component="main">

            <h1>Create a new channel</h1>
            <FormGroup >
                <FormControl margin="dense" required>
                    <InputLabel htmlFor="channel-name">Channel</InputLabel>
                    <Input id="channel-name" aria-describedby="channel-name-help" onChange={handleChange("name")} />
                    <FormHelperText id="channel-name-help">Name can not be changed</FormHelperText>
                </FormControl>
                <FormControl margin="dense">
                    <InputLabel htmlFor="channel-description">Description</InputLabel>
                    <Input id="channel-description" aria-describedby="channel-description-help" onChange={handleChange("description")} />
                    <FormHelperText id="channel-description-help">What is this channel about?</FormHelperText>
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

            <Box sx={{ alignItems: "end", width: "100%" }} className="column" >
                <Box sx={{
                    alignItems: "end"
                }} className="column">
                    {<Typography sx={{ flex: 1, textAlign: 'left' }}>
                        Account creation will create a program owned account that stores information about the channel and the content it contains.
                    </Typography>}
                    {<Box sx={{ display: "flex", justifyContent: "right", mt: 2 }}>
                        <LoadingButton loading={loading} onClick={onClick} disabled={(state.encrypted && (state.password != state.passwordConfirm || state.password.length == 0) || state.name.length == 0) || !publicKey || !user} >
                            Create
                        </LoadingButton>

                        {/* <Send disabled={changingNetwork || (state.encrypted && (state.password != state.passwordConfirm || state.password.length == 0) || state.name.length == 0)} name={state.name} network={state.network}></Send> */}
                    </Box>}
                    {!publicKey && <FormHelperText error id="connect-wallet-help">Connect a wallet to create a user</FormHelperText>}
                    {publicKey && !user && <FormHelperText error id="create-user-help" >You need a user to create a channel</FormHelperText>}

                </Box>
            </Box>
        </Container>
    )
}