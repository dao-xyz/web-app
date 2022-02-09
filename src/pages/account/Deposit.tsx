import { Avatar, CircularProgress, Container, FormControl, FormGroup, FormHelperText, Grid, Input, InputLabel, Paper, Slide, Slider, Snackbar, Theme, Toolbar, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { NetworkContext } from '../../contexts/Network';
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { getUserByName } from '@s2g/social';
import LoadingButton from '@mui/lab/LoadingButton';
import { LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js'
import { Wallet } from '../../components/network/Wallet/Wallet';
import { depositSol } from '@s2g/stake-pool';
import { useAlert } from '../../contexts/AlertContext';
import { useAccount } from '../../contexts/AccountContext';
import { Token } from '@mui/icons-material';

const userNameRegex = new RegExp('^[a-zA-Z0-9_]*$');
export const Deposit: FC = () => {

    const { publicKey, sendTransaction, connecting } = useWallet();
    const { balance } = useAccount();
    const { connection, } = useConnection();
    const [loading, setLoading] = useState(false);
    const network = useContext(NetworkContext);
    const [solBalance, setSolBalance] = useState<number | undefined>(undefined);
    const [value, setValue] = React.useState(0.001);
    const { alert, alertError } = useAlert();

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        if (typeof newValue !== 'number') {
            throw Error("Invalid slider value: " + typeof newValue);
        }
        setValue(newValue);
    };

    const handleInputChange = (event: any) => {
        setValue(event.target.value === '' ? 0 : Number(event.target.value));
    };

    const onDeposit = useCallback(async (_: any) => {
        if (!publicKey)
            throw new Error('No wallet connected')
        setLoading(true);
        try {
            const { instructions, signers } = await depositSol(connection, publicKey, value * LAMPORTS_PER_SOL)
            const signature = await sendTransaction(new Transaction().add(...instructions), connection, { signers: signers });
            await connection.confirmTransaction(signature);
        } catch (error) {
            alertError(error)
            console.error(error);
        } finally {
            setLoading(false);
        }

    }, [publicKey, connection]);
    useEffect(() => {
        if (publicKey) {
            setLoading(true);
            connection.getBalance(publicKey).then((balance) => { setSolBalance(balance / LAMPORTS_PER_SOL) }).finally(() => { setLoading(false) }); // Handle value in sol rather than lamports for better ui
        }
    }, [publicKey, connection])

    const handleBlur = useCallback(() => {
        if (typeof solBalance !== 'number')
            return
        if (value < 0) {
            setValue(0);
        } else if (value > solBalance) {
            setValue(solBalance);
        }
    }, [solBalance]);

    console.log(loading)

    return (
        <Container maxWidth="xs" component="main" sx={{ pt: 8, pb: 6 }}>
            <Typography component="h1" variant="h3" gutterBottom>Deposit</Typography>
            {typeof solBalance === 'number' ? <Grid container spacing={2} direction="column">
                <Grid item>
                    <Avatar alt="SOL" src="https://avatars.githubusercontent.com/u/35608259?s=200&v=4" />
                    <Typography sx={{ ml: 1, color: "secondary.main" }}  >{solBalance}</Typography>
                </Grid>
                <Grid item>
                    <Token sx={{ color: "secondary.main" }} />
                    <Typography sx={{ ml: 1, color: "secondary.main" }}  >{balance}</Typography>
                </Grid>
                <Grid item><Typography id="input-slider" gutterBottom>
                    Set deposit amount
                </Typography></Grid>
                <Grid item container spacing={2} alignItems="center">
                    <Grid item>
                        <Avatar alt="SOL" src="https://avatars.githubusercontent.com/u/35608259?s=200&v=4" />
                    </Grid>
                    <Grid item xs>
                        <Slider
                            value={typeof value === 'number' ? value : 0}
                            onChange={handleSliderChange}
                            aria-labelledby="input-slider"
                            max={solBalance}
                            min={0}
                            step={0.00001}

                        />
                    </Grid>
                    <Grid item  >
                        <Input
                            value={value}
                            size="small"
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            sx={{ width: '80px' }}
                            inputProps={{
                                min: 0,
                                max: { solBalance },
                                type: 'number',
                                'aria-labelledby': 'input-slider',

                            }}
                        />
                    </Grid>


                </Grid>
                <Grid item container justifyContent="right" >
                    <Grid item>
                        <LoadingButton loading={loading} onClick={onDeposit} disabled={!value || !publicKey
                        } >
                            Deposit
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Grid> : <Box>{!connecting ? <Typography>Connect a wallet to continue</Typography > : <></>} <Wallet /></Box>}
            {/*   <Box sx={{ alignItems: "end", width: "100%" }} className="column" >
                    <Box sx={{
                        alignItems: "end"
                    }} className="column">
                        <LoadingButton loading={loading} onClick={onClick} disabled={!state.username || usernameState !== UserNameState.OK || !publicKey
                        } >
                            Create user
                        </LoadingButton>
                        {!publicKey && <FormHelperText error id="connect-wallet-help">Connect a wallet to create a user</FormHelperText>}

                    </Box>
                </Box> */}
        </Container >

    )
}