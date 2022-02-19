import React, { useCallback, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useIpfsService } from '../../contexts/IpfsServiceContext';
export default function VoteDialog(props: { up: boolean, open: boolean, setOpen: (boolean: boolean) => void }) {
    const { reset, checkPassword } = useIpfsService();
    const [password, setPassword] = useState('');
    const [passwordValid, setPasswordValid] = useState(false);
    const [open, setOpen] = useState(props.open);

    useEffect(() => {
        setOpen(props.open)
    }, [props.open])
    const handleClose = () => {
        props.setOpen(false);
        setOpen(false);
    };


    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{props.up ? 'Up' : 'Down'}vote</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    How much do you want to downvote for?
                </DialogContentText>
                SLIDER
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}