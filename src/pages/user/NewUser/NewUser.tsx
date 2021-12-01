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

    const [changingNetwork, setChanginNetwork] = React.useState(false);
    const { disconnect } = useWallet();

    const [usernameValid, setUsernameValid] = React.useState<boolean | undefined>(undefined);


    const onClick = useCallback(async () => {
        if (!publicKey)
            throw new WalletNotConnectedError();

        const user = PublicKey.default;
        const [transaction, _] = await createUserTransaction(state.name, publicKey, config.programId);
        const signature = await sendTransaction(new Transaction().add(transaction), connection);
        await connection.confirmTransaction(signature, "processed");

    }, [publicKey, sendTransaction, connection]);

    const userExist = async (name: string): Promise<boolean> => {
        return !!await getUserByName(name, connection, config.programId);
    }

    const networkContext = useContext(NetworkContext);
    const handleChange = (name: string) => async (event: any) => {
        switch (name) {
            case 'name':
                {
                    if (name) {
                        userExist(name).then((exist) => {
                            setUsernameValid(!exist);
                        });
                    }
                    else {

                        // just to remove error ui
                        setUsernameValid(true);
                    }
                    setState({ ...state, [name]: event.target.value });
                    break;
                }

            default:
                setState({ ...state, [name]: event.target.value });
        }

    };

    return (
        <Box>
            New user?
            <Toolbar />
            <Box sx={{ display: "flex", justifyContent: "center", width: "100vw", mt: 20 }}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    maxWidth: "350px"
                }}>
                    <h1>Give yourself a name</h1>
                    <FormGroup >
                        <FormControl margin="dense" required error={usernameValid === false}>
                            <InputLabel htmlFor="name">Username</InputLabel>
                            <Input id="name" aria-describedby="name-help" onChange={handleChange("name")} />
                            {!publicKey ? <FormHelperText id="name-help">A unique name</FormHelperText> :
                                <FormHelperText error id="name-error">Just must be connected with a wallet to create a user</FormHelperText>}


                        </FormControl>
                    </FormGroup>

                    <Box sx={{ mt: 2 }}>
                        {<Box sx={{ display: "flex", justifyContent: "right", mt: 2 }}>
                            <Button onClick={onClick} disabled={!state.name || !usernameValid || !publicKey} >
                                Create
                            </Button>
                            {/* <Send disabled={changingNetwork || (state.encrypted && (state.password != state.passwordConfirm || state.password.length == 0) || state.name.length == 0)} name={state.name} network={state.network}></Send> */}
                        </Box>}

                    </Box>
                </Box>

            </Box>

        </Box >
    )
}