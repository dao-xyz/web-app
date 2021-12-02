import { Button, FormControl, FormGroup, FormHelperText, Input, InputLabel, Toolbar, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { createUserTransaction } from '@solvei/solvei-client';
import { Transaction } from '@solana/web3.js';
import { Wallet } from '../../../components/Wallet/Wallet';
import { NetworkContext } from '../../../components/Wallet/Network';
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React, { useCallback, useContext } from "react";
import { getUserByName } from '@solvei/solvei-client';
import LoadingButton from '@mui/lab/LoadingButton';


interface NewUser {
    name: string
}


export function NewUser() {
    const { wallet } = useWallet();
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const { config } = useContext(NetworkContext);
    const [state, setState] = React.useState({
        name: ""
    } as NewUser);
    console.log('mount', state)


    const [usernameValid, setUsernameValid] = React.useState<boolean | undefined>(undefined);
    const [loading, setLoading] = React.useState(false);

    const onClick = useCallback(async () => {
        if (!publicKey)
            throw new WalletNotConnectedError();
        setLoading(false)

        const [transaction, c] = await createUserTransaction(state.name, publicKey, config.programId);
        console.log('payer', publicKey)
        console.log('name', state.name)

        console.log(transaction, c)

        const signature = await sendTransaction(new Transaction().add(transaction), connection);
        await connection.confirmTransaction(signature, "finalized");
        setLoading(true)


    }, [publicKey, sendTransaction, connection, state]);

    const userExist = async (name: string): Promise<boolean> => {
        const user = await getUserByName(name, connection, config.programId);
        console.log(name, user)
        return !!user;
    }

    const handleChange = (field: string) => (event: any) => {
        console.log('CHANGE', field, event)
        switch (field) {
            case 'name':
                {
                    const name = event.target.value;
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

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    maxWidth: "350px"
                }}>
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
                </Box>

            </Box >

        </Box >
    )
}