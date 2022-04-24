
import { Avatar, Button, DialogActions, FormControl, FormGroup, FormHelperText, Grid, Input, InputLabel, Link, Typography, typographyClasses } from '@mui/material';
import { useLocalStorage } from '@solana/wallet-adapter-react';
import React, { FC, ReactNode, useLayoutEffect, useState } from 'react';
import { KeySecretConfig } from '@dao-xyz/ipfs-pinning-adapter';
import { IpfsServiceMeta, useIpfsService } from '../../../../contexts/IpfsServiceContext';

import help1 from './pinata_setup_1.png';
import help2 from './pinata_setup_2.png';


export const PinataConfigForm: FC<{ change: (config: KeySecretConfig) => void }> = ({ change }) => {
    const [config, setConfig] = React.useState<KeySecretConfig>({ apiKey: '', secret: '' })

    const updateConfig = (newConfig: KeySecretConfig) => {
        setConfig(newConfig);
        change(newConfig)
    }


    return (<>
        <Grid container direction='column' spacing={2}>
            <Grid item>
                <Typography>To get an API and secret key, go to <Link onClick={() => window.open("https://www.pinata.cloud/", '_blank')}>pinata.cloud</Link>. Create an account. </Typography>
            </Grid>
            <Grid item>
                <Typography>After logging in, go to user settings and click "API keys"</Typography>
            </Grid>
            <Grid item>
                <img src={help1}></img>
            </Grid>
            <Grid item>
                <Typography>Create a new API key. Enable <strong>pinFileToIPFS</strong>  (important)</Typography>
            </Grid>
            <Grid item>
                <img src={help2}></img>
            </Grid>
            <Grid item>
                <Typography>Now you will be presented an Api Key and secret. Provide them below:</Typography>
            </Grid>
            <Grid item>
                <FormGroup  >
                    <FormControl fullWidth margin="dense" required>
                        <InputLabel htmlFor="key">API Key</InputLabel>
                        <Input autoComplete='off' id="key" onChange={(event) => { updateConfig({ ...config, apiKey: event.target.value.trim() } as KeySecretConfig) }} />
                    </FormControl>
                </FormGroup>
            </Grid>

            <Grid item>
                <FormGroup >
                    <FormControl fullWidth margin="dense" required>
                        <InputLabel htmlFor="secret">Secret</InputLabel>
                        <Input autoComplete='off' id="secret" onChange={(event) => { updateConfig({ ...config, secret: event.target.value.trim() } as KeySecretConfig) }} />
                    </FormControl>
                </FormGroup>
            </Grid>
        </Grid>

    </>)
}
