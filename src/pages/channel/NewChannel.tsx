import { Button, Checkbox, Container, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Input, InputLabel, MenuItem, Radio, RadioGroup, Toolbar, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { AuthorityType, ChannelAccount, ChannelType, createChannelTransaction, getChannel, getChannelByName, getSignerAuthority } from '@dao-xyz/sdk-social';
import { PublicKey, Transaction } from '@solana/web3.js';
import { WalletAdapterNetwork, WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React, { FC, useCallback } from "react";
import LoadingButton from '@mui/lab/LoadingButton';
import { useNavigate, useParams } from 'react-router';
import { useUser } from '../../contexts/UserContext';
import { useAlert } from '../../contexts/AlertContext';
import { useNetwork } from '../../contexts/Network';
import { getChannelRoute } from '../../routes/routes';
import { AccountInfoDeserialized, ContentSourceString } from '@dao-xyz/sdk-common';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface NewChannelForm {

    name: string,
    /*     description: string, */
    network: WalletAdapterNetwork,
    /*     encrypted: boolean,*/
    password: string,
    passwordConfirm: string
    type: ChannelType
}

const isDao = (parent: PublicKey) => !parent

export const NewChannel: FC = () => {
    const { key } = useParams();
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const { alert } = useAlert();
    const [loading, setLoading] = React.useState(false);
    const [notFound, setNotFound] = React.useState(false);
    const [parent, setParent] = React.useState<AccountInfoDeserialized<ChannelAccount> | undefined>(undefined);
    const [alreadyExist, setAlreadyExist] = React.useState(false);

    const navigate = useNavigate();

    const [state, setState] = React.useState({
        name: "",
        password: "",
        passwordConfirm: "",
        type: ChannelType.Collection,
    } as NewChannelForm);

    React.useEffect(() => {
        if (!key) {
            setNotFound(true)
            return;
        }
        try {
            const channelKey = new PublicKey(key as string);
            getChannel(channelKey, connection).then((channel) => {
                setParent(channel);
            }).catch((error) => {
                console.log(error)
            })
        }
        catch (error) {
            console.log(key, error)
            // bad id
            setNotFound(true)

        }

    }, [key])

    const onClick = useCallback(async () => {

        const similiarChannel = await getChannelByName(state.name, connection);

        if (similiarChannel) {
            setAlreadyExist(true)
        }
        else {
            setAlreadyExist(false);
        }

        if (!publicKey)
            throw new WalletNotConnectedError();
        console.log(parent ? await getSignerAuthority(publicKey, parent.pubkey, AuthorityType.CreateSubChannel, connection) : undefined);
        setLoading(true)
        try {
            const [transaction, channelKey] = await createChannelTransaction(parent?.pubkey, publicKey, publicKey, state.name, new ContentSourceString({ string: "" }), state.type, parent ? await getSignerAuthority(publicKey, parent.pubkey, AuthorityType.CreateSubChannel, connection) : undefined);
            const signature = await sendTransaction(new Transaction().add(transaction), connection,);
            await connection.confirmTransaction(signature);
            // navigate to redirect if exist, else to home
            alert({
                severity: 'success',
                text: 'Channel created!'
            })
            navigate(getChannelRoute(channelKey));
        }
        catch (error) {
            alert({
                severity: 'error',
                text: "Something went wrong. Error: " + JSON.stringify(error, Object.getOwnPropertyNames(error))
            });
        }
        setLoading(false)
    }, [publicKey, sendTransaction, connection, state]);

    const handleChange = (name: string) => async (event: any) => {
        switch (name) {
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
        <Container maxWidth="xs" component="main">

            <h1>Create a new {isDao(parent?.pubkey) ? 'DAO' : 'channel'}</h1>

            <FormGroup >
                <FormControl margin="dense" required>
                    <InputLabel htmlFor="channel-name">Name</InputLabel>
                    <Input id="channel-name" aria-describedby="channel-name-help" onChange={handleChange("name")} />
                    <FormHelperText id="channel-name-help">Name can not be changed</FormHelperText>
                </FormControl>
                {isDao(parent?.pubkey) ? <></> : <FormControl sx={{ m: 1 }}>
                    <InputLabel id="demo-simple-select-helper-label">Channel type</InputLabel>
                    <Select
                        labelId="select-channe"
                        id="select-channel-type"
                        value={state.type}
                        label="Channel type"
                        onChange={handleChange("type")}
                    >
                        <MenuItem value={ChannelType.Collection}>Category</MenuItem>
                        <MenuItem value={ChannelType.Chat}>Chat</MenuItem>
                        <MenuItem value={ChannelType.Forum}>Forum</MenuItem>
                    </Select>
                </FormControl>}

                {/*   <FormControl margin="dense">
                    <InputLabel htmlFor="channel-description">Description</InputLabel>
                    <Input id="channel-description" aria-describedby="channel-description-help" onChange={handleChange("description")} />
                    <FormHelperText id="channel-description-help">What is this channel about?</FormHelperText>
                </FormControl> */}

                {/* <FormControl margin="dense">
                    <FormControlLabel id="encypted" control={<Checkbox disabled onChange={handleChange('encrypted')} value="encrypted" />} label="Encryption (not available yet)" />
                </FormControl>
                {
                    state.encrypted ?
                        <>
                            <FormControl margin="dense">
                                <InputLabel htmlFor="encrypted">Password</InputLabel>
                                <Input type="password" id="encrypted" aria-describedby="encrypted-help" onChange={handleChange("password")} />
                                <FormHelperText id="password-help">This is on you</FormHelperText>
                            </FormControl>
                            <FormControl margin="dense" error={state.password !== state.passwordConfirm && state.passwordConfirm.length > 0}>
                                <InputLabel htmlFor="password-confirm">Confirm password</InputLabel>
                                <Input type="password" id="password-confirm" onChange={handleChange("passwordConfirm")} />
                            </FormControl>
                        </>
                        : <></>
                } */}
            </FormGroup>
            <Box sx={{ alignItems: "end", width: "100%" }} className="column" >
                <Box sx={{
                    alignItems: "end"
                }} className="column">

                    {<Box sx={{ display: "flex", justifyContent: "right", mt: 2 }}>
                        <LoadingButton loading={loading} onClick={onClick} disabled={!publicKey} > {/* (state.encrypted && (state.password != state.passwordConfirm || state.password.length == 0) || state.name.length == 0) */}
                            Create
                        </LoadingButton>

                        {/* <Send disabled={changingNetwork || (state.encrypted && (state.password != state.passwordConfirm || state.password.length == 0) || state.name.length == 0)} name={state.name} network={state.network}></Send> */}
                    </Box>}
                    {!publicKey && <FormHelperText error id="connect-wallet-help">You need to connect a wallet</FormHelperText>}
                    {alreadyExist && <FormHelperText error id="create-user-help" >You need a user to create a channel</FormHelperText>}

                </Box>
            </Box>
        </Container>
    )
}
