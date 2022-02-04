import { CircularProgress, Container, FormControl, FormGroup, FormHelperText, Grid, Input, InputLabel, Paper, Slide, Snackbar, Theme, Toolbar, Typography } from '@mui/material';

import { FC, } from "react";
import { IpfsServiceProviderButton } from '../../components/ipfs/IpfsServiceProviderButton';
import { UserProfileSettings } from '../../components/user/UserProfileImageSetting';

export const SettingsUser: FC = () => {
    return <Container maxWidth="xs" component="main" sx={{ pt: 5, pb: 10 }}>
        <Typography component="h3" variant="h3" gutterBottom>Settings</Typography>
        <Grid container spacing={2} wrap='nowrap' direction="column" >
            <Grid item>
                <Typography component="h4" variant="h4" gutterBottom>IPFS service</Typography>
            </Grid>
            <Grid item>
                <Typography gutterBottom sx={{ pt: 2 }}>To store content on the platform you need to provide a way of storing files. This is currently by connecting an IPFS pinning service (which is intendend to act as a long term storage solution)</Typography>
            </Grid>
            <Grid item>
                <IpfsServiceProviderButton />
            </Grid>
        </Grid>

    </Container >
}