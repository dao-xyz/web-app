import { Button, Container, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Grid, Input, InputLabel, Radio, RadioGroup, Slide, Snackbar, Toolbar, Typography } from '@mui/material';
import { NetworkContext } from '../../../contexts/Network';
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React, { useContext } from "react";
import { getUsersByOwner } from '@solvei/solvei-client';
import { UserContext } from '../../../contexts/UserContext';
import { UserAccount } from '@solvei/solvei-client/schema';
import { USER_NEW } from '../../../routes/routes';
import { Link } from 'react-router-dom';
import { AccountDeserialized } from '@solvei/solvei-client/models';

export function ChangeUser() {
    const { publicKey, sendTransaction } = useWallet();
    const { user, setUser } = useContext(UserContext);
    const [users, setUsers] = React.useState<AccountDeserialized<UserAccount>[]>([]);
    const { connection } = useConnection();
    const network = useContext(NetworkContext);

    const userChange = (_: any, name: string) => {
        const newUser = users.find((user) => user.data.name === name)
        console.log('NEW USER', name)
        if (newUser)
            setUser(newUser);
    }

    React.useEffect(() => {
        if (publicKey) {
            // check if user exist

            getUsersByOwner(publicKey, connection, network.config.programId).then((users) => {
                setUsers(users);
            })

        }
    }, [publicKey])

    return (
        <Container maxWidth="xs" component="main">
            <h1>Manage users</h1>
            <Grid container flexDirection="column" spacing={2}>
                <Grid item>
                    <Button component={Link} to={network.getPathWithNetwork(USER_NEW)}>
                        Create new user
                    </Button>

                </Grid>
                <Grid item>
                    {users ?
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Set active user</FormLabel>
                            <RadioGroup
                                aria-label="user"
                                value={user?.data?.name ?? ''}
                                name="radio-buttons-group"
                                onChange={userChange}
                            >
                                {
                                    users.map((user) => {
                                        return <FormControlLabel key={user.data.name} value={user.data.name} control={<Radio />} label={user.data.name} />
                                    })
                                }
                            </RadioGroup>
                        </FormControl>
                        : (publicKey ? <Typography>No users found</Typography> : <Typography>No wallet connected</Typography>)
                    }
                </Grid>
            </Grid>
        </Container>
    )
}