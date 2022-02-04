
import { Avatar, Button, DialogActions, FormControl, FormGroup, FormHelperText, Grid, Input, InputLabel, Link, Typography, typographyClasses } from '@mui/material';
import { useLocalStorage } from '@solana/wallet-adapter-react';
import React, { FC, ReactNode, useCallback, useLayoutEffect, useState } from 'react';
import { SimpleConfig, KeySecretConfig } from '@s2g/ipfs-pinning-adapter';
import { IpfsService, IpfsServiceMeta, useIpfsService } from '../../../contexts/IpfsServiceContext';
import { NftDotStorageConfigForm } from './NftDotStorageConfigForm';
import { IpfsServiceIcon } from '../IpfsServiceIcon';
import { PinataConfigForm } from './pinata/PinataConfigForm';

export const IpfsServiceConfigProvider: FC<{ service: IpfsServiceMeta, previous: () => void, save: () => void }> = ({ service, previous, save }) => {
    const [ket, setKey] = React.useState("")
    const { set } = useIpfsService();
    const [password, setPassword] = useState<string | undefined>(undefined);
    const [serviceConfig, setServiceConfig] = useState<SimpleConfig | KeySecretConfig | undefined>(undefined);
    const credentialsForm = useCallback(() => {
        if (!service)
            throw new Error("Service not selected");
        switch (service.service) {
            case IpfsService.NFT_STORAGE:
                return <NftDotStorageConfigForm change={setServiceConfig}></NftDotStorageConfigForm>

            case IpfsService.PINATA:
                return <PinataConfigForm change={setServiceConfig}></PinataConfigForm>
            default:
                break;
        }
        return undefined;
    }, [service])

    const configValid = useCallback((): boolean => {
        /**
         * Check config is valid, no real integration checks, but just check
         * that the length of the keys are non zero
         */
        if (!service.service)
            return false;
        if (!serviceConfig)
            return false;
        switch (service.service) {
            case IpfsService.NFT_STORAGE:
                return serviceConfig.apiKey.length > 0

            case IpfsService.PINATA:
                return serviceConfig.apiKey.length > 0 && (serviceConfig as KeySecretConfig).secret.length > 0
            default:
                break;

        }
        return false;
    }, [service, serviceConfig])

    const handleSave = useCallback(() => {
        set(service.service, serviceConfig as (SimpleConfig | KeySecretConfig), password);
        save();
    }, [serviceConfig, service, set])

    return (<>
        <IpfsServiceIcon service={service} sx={{ mb: 2 }} />
        {credentialsForm()}
        <Grid container direction='column' spacing={2}>
            <Grid item>
                <Typography>Credentials are stored locally in the browser and are never shared with any 3rd party. You can provide an optional encryption key to encrypt them before saving them.</Typography>
            </Grid>
            <Grid item>
                <FormGroup >
                    <FormControl fullWidth margin="dense" >
                        <InputLabel htmlFor="key">Encryption password (optional)</InputLabel>
                        <Input id="key" onChange={(event) => { setPassword(event?.target.value.trim()) }} />
                    </FormControl>
                </FormGroup>
            </Grid>
        </Grid>
        <DialogActions>
            <Button onClick={previous} autoFocus>
                Previous
            </Button>
            <Button disabled={!configValid()} onClick={handleSave}>
                Save
            </Button>
        </DialogActions>
    </>)
}
