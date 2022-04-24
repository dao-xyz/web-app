import { Avatar, CircularProgress, Container, FormControl, FormGroup, FormHelperText, Grid, Input, InputLabel, Paper, Slide, Slider, Snackbar, Theme, Toolbar, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import LoadingButton from '@mui/lab/LoadingButton';
import { useAlert } from '../../contexts/AlertContext';
import { useSmartWallet } from '../../contexts/SmartWalletContext';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Wallet } from '../../components/network/Wallet/Wallet';


export const SmartWalletSetup: FC = () => {

    const { publicKey, connecting } = useWallet();
    const { connection } = useConnection();
    const { alertError, alert } = useAlert();
    const { burnerWallet, loading: burnerWalletBalance, createBurnerWallet, fillBurnerWallet, delegatedSigners } = useSmartWallet();
    const [value, setValue] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [solBalance, setSolBalance] = useState<number | undefined>(undefined);

    const reloadSolBalance = useCallback(async () => {
        if (publicKey) {
            setLoading(true);
            await new Promise(r => setTimeout(r, 5000));
            const balance = await connection.getBalance(publicKey, 'singleGossip');
            setSolBalance(balance / LAMPORTS_PER_SOL);
            setLoading(false);
        }

    }, [connection, publicKey])
    useEffect(() => {
        reloadSolBalance();
    }, [connection, publicKey])



    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        if (typeof newValue !== 'number') {
            throw Error("Invalid slider value: " + typeof newValue);
        }
        setValue(newValue);
    };
    const handleInputChange = (event: any) => {
        setValue(event.target.value === '' ? 0 : Number(event.target.value));
    };
    const handleBlur = useCallback(() => {
        if (typeof solBalance !== 'number')
            return
        if (value < 0) {
            setValue(0);
        } else if (value > solBalance) {
            setValue(solBalance);
        }
    }, [solBalance]);

    const onCreate = useCallback(async () => {
        // Create burner wallet with deposit
        setLoading(true);
        try {
            await createBurnerWallet(publicKey, value * LAMPORTS_PER_SOL);
            await reloadSolBalance();
            setValue(0);

            alert({
                severity: 'success',
                text: 'Success!'
            });

        }
        catch (error) {
            alertError(error)
        }
        finally {
            setLoading(false);
        }
    }, [publicKey, value, burnerWallet])

    const onAddBalance = useCallback(async () => {
        // Create burner wallet with deposit
        setLoading(true);
        try {
            await fillBurnerWallet(burnerWallet.publicKey, value * LAMPORTS_PER_SOL);
            await reloadSolBalance();
            setValue(0);
            alert({
                severity: 'success',
                text: 'Success!'
            });
        }
        catch (error) {
            alertError(error)
        }
        finally {
            setLoading(false);
        }

    }, [publicKey, value, burnerWallet])

    // Box sx={{ display: "flex", justifyContent: "center" }}
    return (
        <Container maxWidth="xs" component="main" sx={{ pt: 8, pb: 6 }}>
            <Typography component="h1" variant="h3" gutterBottom>Setup quick-sign</Typography>
            <Grid container spacing={2}>

                {typeof solBalance === 'number' ? (<Grid container item spacing={2} direction="column">
                    <Grid container item direction="row" alignItems="center">
                        <Typography>SOL balance</Typography>
                        <Avatar sx={{ width: 24, height: 24, ml: 1 }} alt="SOL" src="https://avatars.githubusercontent.com/u/35608259?s=200&v=4" />
                        <Typography sx={{ ml: 1 }}>{solBalance}</Typography>
                    </Grid>
                </Grid>) : <Box>{!connecting && <Typography>Connect a wallet to continue</Typography >} <Wallet /></Box>
                }
                {typeof burnerWalletBalance === 'number' && (<Grid container item spacing={2} direction="column">
                    <Grid container item direction="row" alignItems="center">
                        <Typography>Burner wallet balance</Typography>
                        <Avatar sx={{ width: 24, height: 24, ml: 1 }} alt="Burner wallet SOL" src="https://avatars.githubusercontent.com/u/35608259?s=200&v=4" />
                        <Typography sx={{ ml: 1 }}>{burnerWalletBalance}</Typography>
                    </Grid>
                </Grid>)
                }
                {typeof solBalance === 'number' && (!burnerWallet ?
                    <Grid container item>
                        <Typography gutterBottom>By creating a burner wallet that is stored as a browser cookie with authority to create content, you can interact without signing all messages.</Typography>
                        <Grid item><Typography id="input-burner-slider" gutterBottom>
                            Set burner wallet balance
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
                                    max={Math.min(0.1, solBalance)}
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
                                <LoadingButton loading={loading} onClick={onCreate} disabled={!value || !publicKey
                                } >
                                    Create burner wallet
                                </LoadingButton>
                            </Grid>
                        </Grid>
                    </Grid>
                    : <Grid container item>
                        <Grid item><Typography id="input-slider" gutterBottom>
                            Add burner wallet balance
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
                                    max={Math.min(0.1, solBalance)}
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
                                <LoadingButton loading={loading} onClick={onAddBalance} disabled={!value || !publicKey
                                } >
                                    Add amount
                                </LoadingButton>
                            </Grid>
                        </Grid>
                    </Grid>
                )
                }
            </Grid>
        </Container >

    )
}