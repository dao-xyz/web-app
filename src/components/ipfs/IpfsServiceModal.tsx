/* import { WalletName, WalletReadyState } from '@solana/wallet-adapter-base';
import { useWallet, Wallet } from '@solana/wallet-adapter-react'; */
import React, { FC, MouseEvent, useEffect, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useIpfsProviderModal } from './useIpfsProviderModal';
import { IpfsService, IpfsServiceMeta, useIpfsService } from '../../contexts/IpfsServiceContext';
/*import { WalletSVG } from './WalletSVG'; */
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { DialogActions, DialogContent, DialogContentText, Grid, ListItemButton } from '@mui/material';
import { IpfsServiceConfigProvider } from './services/IpfsServiceConfigProvider';
import CheckIcon from '@mui/icons-material/Check';
const steps = ['Select service', 'Provide credentials'];

export interface IpfsServiceModalProps {
    onSave?: () => any
}

export const IpfsServiceModal: FC<IpfsServiceModalProps> = ({ onSave }) => {
    const dialogContentRef = useRef<HTMLDivElement>(null);
    const { services, set } = useIpfsService();
    const [service, setService] = useState<IpfsServiceMeta | undefined>(undefined);
    const { visible, setVisible } = useIpfsProviderModal();
    const [activeStep, setActiveStep] = React.useState(0);

    const pickService = (service: IpfsServiceMeta) => {
        setService(service);
        setActiveStep(activeStep + 1)
    }

    const handleClose = (event: MouseEvent) => {
        event.preventDefault();
        setVisible(false)
    }
    useEffect(() => {
        if (dialogContentRef && dialogContentRef.current) {
            dialogContentRef.current.scroll(0, 0);
        }
    }, [dialogContentRef, activeStep])

    return (
        <Dialog onClose={handleClose} open={visible} fullWidth>
            <DialogTitle>Connect to an IPFS service</DialogTitle>
            <DialogContent ref={dialogContentRef}>
                <Grid container spacing={2} direction="column" justifyContent="center">
                    <Grid item>
                        <DialogContentText>
                            To provide content to this site (such as creating posts and profile information) you have to connect a IPFS service that "pins" content for you. This way content will be stored in a decentralized and accessible way for all platform users.
                        </DialogContentText>
                    </Grid>
                    <Grid item >
                        <Stepper activeStep={activeStep} sx={{ mb: 1 }} >
                            {steps.map((label, index) => {
                                const stepProps = {};
                                const labelProps = {};

                                return (
                                    <Step key={label} {...stepProps}>
                                        <StepLabel {...labelProps}>{label}</StepLabel>
                                    </Step>
                                );
                            })}
                        </Stepper>
                    </Grid>
                    <Grid item>
                        {activeStep === 0 ? (<><List sx={{ pt: 0 }}>
                            {services.map((service) => (

                                <ListItemButton onClick={() => { pickService(service) }} key={service.name}>
                                    <ListItemAvatar>
                                        <Avatar alt={service.name} src={service.icon} />
                                    </ListItemAvatar>
                                    <ListItemText primary={service.name} />
                                </ListItemButton>
                            ))}

                        </List>
                            <DialogActions>
                                <Button onClick={handleClose} autoFocus>
                                    Close
                                </Button>
                            </DialogActions></>
                        ) :
                            /* Depending on the IPFS source we need to provide different types of credentials */
                            <IpfsServiceConfigProvider previous={() => setActiveStep(activeStep - 1)} service={service as any} save={() => {
                                setVisible(false)
                                if (onSave)
                                    onSave()
                            }}></IpfsServiceConfigProvider>
                        }

                    </Grid>
                </Grid>
            </DialogContent>

        </Dialog >
    );
};