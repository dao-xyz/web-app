import { Button, Checkbox, Container, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Input, InputLabel, Radio, RadioGroup, Toolbar, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { createChannelTransaction, getChannelByName } from '@s2g/social';
import { Transaction } from '@solana/web3.js';
import { WalletAdapterNetwork, WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React, { useCallback, useContext } from "react";
import LoadingButton from '@mui/lab/LoadingButton';
import { useNavigate } from 'react-router';
import { useUser } from '../../contexts/UserContext';
import { useAlert } from '../../contexts/AlertContext';
import { useNetwork } from '../../contexts/Network';
import { getChannelRoute } from '../../routes/routes';
import { PROGRAM_ID } from '@s2g/program';

interface NewChannelForm {

    name: string,
    /*     description: string, */
    network: WalletAdapterNetwork,
    /*     encrypted: boolean,*/
    password: string,
    passwordConfirm: string
}




export function NewChannel() {
    const { wallet } = useWallet();
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const { user } = useUser();
    const { alert } = useAlert();
    const [loading, setLoading] = React.useState(false);
    const [alreadyExist, setAlreadyExist] = React.useState(false);

    const navigate = useNavigate();
    const network = useNetwork();

    const [state, setState] = React.useState({
        name: "",
        password: "",
        passwordConfirm: ""
    } as NewChannelForm);


    const { disconnect } = useWallet();

    const onClick = useCallback(async () => {
        const similiarChannel = await getChannelByName(state.name, connection, PROGRAM_ID);
        if (similiarChannel) {
            setAlreadyExist(true)
        }
        else {
            setAlreadyExist(false);
        }

        if (!publicKey)
            throw new WalletNotConnectedError();
        if (!user)
            throw new Error("No user account active");

        setLoading(true)
        console.log('Create channel with name', state.name);

        try {
            const [transaction, channelKey] = await createChannelTransaction(network.config.programId, publicKey, state.name, user.pubkey, undefined);
            const signature = await sendTransaction(new Transaction().add(transaction), connection,);
            await connection.confirmTransaction(signature);
            // navigate to redirect if exist, else to home
            alert({
                severity: 'success',
                text: 'Channel created!'
            })
            navigate(getChannelRoute(channelKey));
        }
        catch (error) {
            alert({
                severity: 'error',
                text: "Something went wrong. Error: " + JSON.stringify(error, Object.getOwnPropertyNames(error))
            });
        }
        setLoading(false)




    }, [user, publicKey, sendTransaction, connection, state]);

    const handleChange = (name: string) => async (event: any) => {
        switch (name) {

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
                    <InputLabel htmlFor="channel-name">Channel name</InputLabel>
                    <Input id="channel-name" aria-describedby="channel-name-help" onChange={handleChange("name")} />
                    <FormHelperText id="channel-name-help">Name can not be changed</FormHelperText>
                </FormControl>
                {/*   <FormControl margin="dense">
                    <InputLabel htmlFor="channel-description">Description</InputLabel>
                    <Input id="channel-description" aria-describedby="channel-description-help" onChange={handleChange("description")} />
                    <FormHelperText id="channel-description-help">What is this channel about?</FormHelperText>
                </FormControl> */}

                {/* <FormControl margin="dense">
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
                } */}
            </FormGroup>
            <Box sx={{ alignItems: "end", width: "100%" }} className="column" >
                <Box sx={{
                    alignItems: "end"
                }} className="column">
                    {<Typography sx={{ flex: 1, textAlign: 'left' }}>
                        Account creation will create a program owned account that stores information about the channel and the content it contains.
                    </Typography>}
                    {<Box sx={{ display: "flex", justifyContent: "right", mt: 2 }}>
                        <LoadingButton loading={loading} onClick={onClick} disabled={!publicKey || !user} > {/* (state.encrypted && (state.password != state.passwordConfirm || state.password.length == 0) || state.name.length == 0) */}
                            Create
                        </LoadingButton>

                        {/* <Send disabled={changingNetwork || (state.encrypted && (state.password != state.passwordConfirm || state.password.length == 0) || state.name.length == 0)} name={state.name} network={state.network}></Send> */}
                    </Box>}
                    {!publicKey && <FormHelperText error id="connect-wallet-help">You need to connect a wallet</FormHelperText>}
                    {publicKey && !user && <FormHelperText error id="create-user-help" >You need a user to create a channel</FormHelperText>}
                    {alreadyExist && <FormHelperText error id="create-user-help" >You need a user to create a channel</FormHelperText>}

                </Box>
            </Box>
        </Container>
    )
}
