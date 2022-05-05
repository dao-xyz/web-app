import React, { FC, useEffect } from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Box, CircularProgress, Grid } from '@mui/material';
import { useAlert } from '../../contexts/AlertContext';
import RedeemIcon from '@mui/icons-material/Redeem';

const emails = ['username@gmail.com', 'user02@gmail.com'];

export interface SimpleDialogProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
}

export const AirdropDialog: FC<{ onClose: () => void, open: boolean }> = ({ onClose, open }) => {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const { alertError, alert } = useAlert();

    const [loading, setLoading] = React.useState(false);
    const handleClose = () => {
        onClose();
    };


    const airdrop = async () => {
        setLoading(true);
        try {
            await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL)
            alert({
                severity: 'success',
                text: 'Success!'
            })
        } catch (error) {
            alertError(error);
        }
        setLoading(false);
        handleClose();

    }

    useEffect(() => {
        if (open && !loading) {
            airdrop();
        }

    }, [open])
    return (
        <Dialog onClose={handleClose} open={open} sx={{
            "& .MuiDialog-container": {
                "& .MuiPaper-root": {
                    width: "100%",
                    maxWidth: "300px",
                    height: "100%",
                    maxHeight: "300px",
                },
            },
        }}>
            <DialogTitle >
                Airdrop
            </DialogTitle>
            <Box sx={{ minHeight: '200px', width: '100%', height: '100%', display: 'flex', alignItems: 'center', mt: -4, justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        </Dialog>
    );
}
