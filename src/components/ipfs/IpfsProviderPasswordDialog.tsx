import React, { useCallback, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useIpfsService } from '../../contexts/IpfsServiceContext';
export default function IpfsProviderPasswordDialog(props: { open, setOpen: (boolean) => void, onReset: () => void, setPassword: (string) => void }) {
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
  const setCheckPassword = (password: string) => {
    setPassword(password)
    setPasswordValid(false);
    checkPassword(password).then((result) => {
      setPasswordValid(result)
      console.log('VALID?', result)
    });

  }
  const submit = useCallback(() => { props.setPassword(password); handleClose() }, [props, password])


  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Provide IPFS password</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Your IPFS configuration is password protected, provide it below or create a new connection if you lost it.
        </DialogContentText>
        <TextField
          autoFocus
          type="password"
          margin="dense"
          id="name"
          label="Password"
          fullWidth
          variant="standard"
          value={password}
          onKeyUp={(event) => {
            if (event.key == 'Enter') {
              if (passwordValid) {
                submit();
              }
            }
          }}
          onChange={(event) => setCheckPassword(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={() => { reset(); handleClose(); }}>Reset connection</Button>
        <Button type="submit" disabled={!passwordValid} onClick={submit}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}