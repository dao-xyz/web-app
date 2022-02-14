
import { Avatar, Alert, Button, DialogActions, FormControl, FormGroup, FormHelperText, Grid, Input, InputLabel, Link, Typography, typographyClasses } from '@mui/material';
import { useLocalStorage } from '@solana/wallet-adapter-react';
import React, { FC, ReactNode, useCallback, useLayoutEffect, useState } from 'react';
import { SimpleConfig, KeySecretConfig } from '@s2g/ipfs-pinning-adapter';
import { IpfsService, IpfsServiceMeta, useIpfsService } from '../../../contexts/IpfsServiceContext';
import { NftDotStorageConfigForm } from './NftDotStorageConfigForm';
import { IpfsServiceIcon } from '../IpfsServiceIcon';
import { PinataConfigForm } from './pinata/PinataConfigForm';
import { LoadingButton } from '@mui/lab';

export const IpfsServiceConfigProvider: FC<{ service: IpfsServiceMeta, previous: () => void, save: () => void }> = ({ service, previous, save }) => {
    const [ket, setKey] = React.useState("")
    const { set, getAdapter } = useIpfsService();
    const [password, setPassword] = useState<string | undefined>(undefined);
    const [verified, setVerified] = useState<boolean | undefined>(undefined);

    const [verifying, setVerifiying] = useState<boolean>(false);

    const [serviceConfig, setServiceConfig] = useState<SimpleConfig | KeySecretConfig | undefined>(undefined);

    const updateServiceConfig = (config: SimpleConfig | KeySecretConfig) => {

        setVerified(undefined);
        setServiceConfig(config);
    }
    const verify = useCallback(async () => {
        console.log('verify', password)

        const adapter = await getAdapter(password, { hashedPassword: undefined, service: service.service, config: serviceConfig });
        setVerifiying(true);
        setVerified(await adapter.verify())
        setVerifiying(false);

    }, [serviceConfig, password])

    const credentialsForm = useCallback(() => {
        if (!service)
            throw new Error("Service not selected");
        switch (service.service) {
            case IpfsService.NFT_STORAGE:
                return <NftDotStorageConfigForm change={updateServiceConfig}></NftDotStorageConfigForm>

            case IpfsService.PINATA:
                return <PinataConfigForm change={updateServiceConfig}></PinataConfigForm>
            default:
                break;
        }
        return undefined;
    }, [service])



    const handleSave = useCallback(() => {
        set(service.service, serviceConfig as (SimpleConfig | KeySecretConfig), password);
        save();
    }, [serviceConfig, service, set, password])

    return (<>
        <IpfsServiceIcon service={service} sx={{ mb: 2 }} />
        {credentialsForm()}
        <Grid container direction='column' spacing={2}>
            <Grid item>
                <Typography>Credentials are stored locally in the browser and are not shared with any 3rd party. You can provide an optional encryption key to encrypt them before saving them.</Typography>
            </Grid>
            <Grid item>
                <FormGroup >
                    <FormControl fullWidth margin="dense" >
                        <InputLabel htmlFor="key">Encryption password (optional)</InputLabel>
                        <Input type="password" id="key" onChange={(event) => { setPassword(event?.target.value); }} />
                    </FormControl>
                </FormGroup>
            </Grid>
        </Grid>
        <DialogActions>
            <Button onClick={previous} autoFocus>
                Previous
            </Button>
            {verified === undefined ? (<LoadingButton onClick={verify} loading={verifying} autoFocus>
                {verified ? <>Verified</> : <>Verify</>}
            </LoadingButton>) : verified ? <Alert variant='outlined' severity='success' >Verified</Alert> : <Alert variant='outlined' severity='error' >Invalid config</Alert>}

            <Button disabled={!verified} onClick={handleSave}>
                Save
            </Button>
        </DialogActions>
    </>)
}
