import { Button, Checkbox, Container, FormControl, FormControlLabel, FormGroup, FormHelperText, Input, InputLabel, Toolbar, Typography } from '@mui/material';
import React from "react";
import Box from '@mui/material/Box';
export function NewChannel() {
    const [state, setState] = React.useState({
        name: "",
        encrypted: false,
        password: "",
        passwordConfirm: ""
    });

    const handleChange = (name: string) => (event: any) => {
        switch (name) {
            case 'encrypted':
                setState({ ...state, [name]: event.target.checked });
                break;
            case 'password':
                state.password = event.target.value
                setState({ ...state });
                break;
            case 'passwordConfirm':
                state.passwordConfirm = event.target.value
                setState({ ...state });
                break;

            default:
                setState({ ...state, [name]: event.target.value });
        }

    };

    return (
        <Box>
            <Toolbar />
            <Box sx={{ display: "flex", justifyContent: "center", width: "100vw", mt: "200px" }}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    maxWidth: "350px"
                }}>
                    <h1>Create a new channel</h1>
                    <FormGroup>
                        <FormControl margin="dense" required>
                            <InputLabel htmlFor="channel-name">Channel name</InputLabel>
                            <Input id="channel-name" aria-describedby="channel-name-help" onChange={handleChange("name")} />
                            <FormHelperText id="channel-name-help">Name can not be changed and has to be unique if channel is public</FormHelperText>
                        </FormControl>
                        <FormControl margin="dense">
                            <FormControlLabel id="encypted" control={<Checkbox onChange={handleChange('encrypted')} value="encrypted" />} label="Encrypted" />
                            <FormHelperText id="encypted">Uses symmetric keys for encryption. If key is lost, then all data will be public</FormHelperText>
                        </FormControl>
                        {
                            state.encrypted ?
                                <>
                                    <FormControl margin="dense">
                                        <InputLabel htmlFor="encrypted">Password</InputLabel>
                                        <Input type="encrypted" id="encrypted" aria-describedby="encrypted-help" onChange={handleChange("password")} />
                                        <FormHelperText id="password-help">This is on you</FormHelperText>
                                    </FormControl>
                                    <FormControl margin="dense" error={state.password !== state.passwordConfirm && state.passwordConfirm.length > 0}>
                                        <InputLabel htmlFor="password-confirm">Confirm password</InputLabel>
                                        <Input type="password" id="password-confirm" onChange={handleChange("passwordConfirm")} />
                                    </FormControl>
                                </>
                                : <></>
                        }
                    </FormGroup>

                    <Box sx={{ mt: 2 }}>
                        {<Typography sx={{ flex: 1, textAlign: 'left' }}>
                            Account creation will create a program owned account that stores information about the channel and the content it contains. Account creation cost can be reedemed at any time. For this account minimun balance for rent exemption must be paid
                        </Typography>}
                        <Box sx={{ display: "flex", justifyContent: "right", mt: 2 }}>
                            <Button disabled={state.invalidPassword || (state.password.length == 0 && state.encrypted) || state.name.length == 0} variant="outlined">
                                Create
                            </Button>
                        </Box>

                    </Box>
                </Box>

            </Box>

        </Box >
    )
}