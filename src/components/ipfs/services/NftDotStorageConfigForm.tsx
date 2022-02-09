
import { Avatar, Button, DialogActions, FormControl, FormGroup, FormHelperText, Grid, Input, InputLabel, Link, Typography, typographyClasses } from '@mui/material';
import { useLocalStorage } from '@solana/wallet-adapter-react';
import React, { FC, ReactNode, useLayoutEffect, useState } from 'react';
import { SimpleConfig } from '@s2g/ipfs-pinning-adapter';
import { IpfsServiceMeta, useIpfsService } from '../../../contexts/IpfsServiceContext';



export const NftDotStorageConfigForm: FC<{ change: (config: SimpleConfig) => void }> = ({ change }) => {
    const [config, setConfig] = React.useState<SimpleConfig>({ apiKey: '' })
    const { set } = useIpfsService();
    const handleChange = (event: any) => {
        let key = event.target.value.trim();
        config.apiKey = key;
        setConfig(config);
        change(config);
    }
    return (<>
        <Grid container direction='column' spacing={2}>

            <Grid item>
                <Typography>To get an API key, go to <Link onClick={() => window.open("https://nft.storage/", '_blank')}>nft.storage</Link>, log in with your email and go to the "API key" tab. This service is currently completely free.</Typography>
                <FormGroup sx={{ width: "100%", mb: 2 }}  >
                    <FormControl fullWidth margin="dense" required>
                        <InputLabel htmlFor="key">API key</InputLabel>
                        <Input id="key" onChange={handleChange} />
                    </FormControl>
                </FormGroup>
            </Grid>
        </Grid>

    </>)
}
