import { Container, FormControl, FormGroup, FormHelperText, Grid, Input, InputLabel, Slide, Snackbar, Toolbar, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { NetworkContext } from '../../../contexts/Network';
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React, { useCallback, useContext, useEffect } from "react";
import { getUserByName } from '@solvei/solvei-client';
import LoadingButton from '@mui/lab/LoadingButton';
import AlertContext from '../../../contexts/AlertContext';
import { UserContext } from '../../../contexts/UserContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRedirect } from '../../../routes/utils';
import { HOME } from '../../../routes/routes';


interface NewUser {
    name: string
}


export function NewUser() {
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const network = useContext(NetworkContext);
    const location = useLocation();
    const navigate = useNavigate();

    const { createUser } = useContext(UserContext);
    const [state, setState] = React.useState({
        name: ""
    } as NewUser);
    const [usernameValid, setUsernameValid] = React.useState<boolean | undefined>(undefined);
    const [loading, setLoading] = React.useState(false);
    const alertContext = useContext(AlertContext)
    const onClick = useCallback(async () => {
        if (!publicKey)
            throw new WalletNotConnectedError();
        setLoading(true)
        let success = false;
        try {
            await createUser(state.name);
            alertContext.alert({
                severity: 'success',
                text: "Success!"
            });
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
            const redirect = getRedirect(location, network.config.type);
            if (redirect) {
                navigate(redirect)
            }
            else {
                navigate(network.getPathWithNetwork(HOME));
            }
        }

    }, [publicKey, sendTransaction, connection, state]);


    const userExist = async (name: string): Promise<boolean> => {
        const user = await getUserByName(name, connection, network.config.programId);
        return !!user;
    }

    const handleChange = (field: string) => (event: any) => {
        switch (field) {
            case 'name':
                {
                    const name = event.target.value.trim();
                    setState({ ...state, [field]: event.target.value });
                    if (field) {
                        setLoading(true)
                        userExist(name).then((exist) => {
                            setUsernameValid(!exist);
                        }).finally(() => {
                            setLoading(false)
                        });
                    }
                    else {
                        // just to remove error ui
                        setUsernameValid(true);
                    }
                    break;
                }

            default:
                setState({ ...state, [field]: event.target.value });
        }

    };
    // Box sx={{ display: "flex", justifyContent: "center" }}
    return (
        <Container maxWidth="xs" component="main">
            {/*  <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                maxWidth: "350px"
            }}> */}

            <h1>What should we call you?</h1>
            <FormGroup sx={{ width: "100%" }} >
                <FormControl fullWidth margin="dense" required error={usernameValid === false}>
                    <InputLabel htmlFor="name">Your alias</InputLabel>
                    <Input id="name" aria-describedby="name-help" onChange={handleChange("name")} />

                    <FormHelperText error={usernameValid === false} id="name-help">{
                        {
                            'undefined': 'Must be unique',
                            'false': 'Name is already taken!',
                            'true': 'Great name!'
                        }[JSON.stringify(usernameValid)]
                    }</FormHelperText>
                </FormControl>
            </FormGroup>

            <Box sx={{ alignItems: "end", width: "100%" }} className="column" >
                <Box sx={{
                    alignItems: "end"
                }} className="column">
                    <LoadingButton loading={loading} onClick={onClick} disabled={!state.name || !usernameValid || !publicKey
                    } >
                        Create user
                    </LoadingButton>
                    {!publicKey && <FormHelperText error id="connect-wallet-help">Connect a wallet to create a user</FormHelperText>}

                    {/* <Send disabled={changingNetwork || (state.encrypted && (state.password != state.passwordConfirm || state.password.length == 0) || state.name.length == 0)} name={state.name} network={state.network}></Send> */}
                </Box>
            </Box>

        </Container >

    )
}