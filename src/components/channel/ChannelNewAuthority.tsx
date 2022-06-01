import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import React, { FC, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Box, Button, FormControl, FormHelperText, Grid, IconButton, InputLabel, ListItem, ListItemIcon, ListItemText, MenuItem, Select, SelectChangeEvent, TextField, Toolbar, Typography } from "@mui/material";
import { MarkdownContent } from "../data/MarkdownContent";
import SendIcon from '@mui/icons-material/Send';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import PublickeyText from "../network/PublickeyText";
import InfoIcon from '@mui/icons-material/Info';
import StreamIcon from '@mui/icons-material/Stream';
import AddIcon from '@mui/icons-material/Add';
import { useAlert } from "../../contexts/AlertContext";
import { LoadingButton } from "@mui/lab";
import { Shard } from '@dao-xyz/shard';
import { PostInterface } from '@dao-xyz/social-interface';


/* interface ChannelAuthorityBuilder {
    authorityTypes: AuthorityType[],
    condition: AuthorityCondition
} */

const isPublicKey = (key: string): boolean => {
    try {
        new PublicKey(key)
        return true;
    } catch (error) {
        return false;
    }
}

export const ChannelNewAuthority: FC<{ channel: Shard<PostInterface>/* , suggestedType?: AuthorityType */ }> = ({ channel/* , suggestedType  */ }) => {

    /* const { publicKey, sendTransaction } = useWallet();
    const [loading, setLoading] = useState(false);
    const { alert, alertError } = useAlert();
    const { connection } = useConnection();
    const [value, setValue] = useState<string>(PublicKey.default.toBase58())

    const [newAuthority, setNewAuthority] = useState<ChannelAuthorityBuilder | undefined>({
        authorityTypes: suggestedType ? [suggestedType] : [],
        condition: new KeyAuthorityCondition({
            key: PublicKey.default
        })
    });

    const saveAuthority = async () => {
        setLoading(true);
        try {
            let authorityConfig = await getSignerAuthority(new SignerMaybeSignForMe(publicKey), channel.pubkey, AuthorityType.CreatePost, connection);
            const [tx, _] = await createAuthorityTransaction(channel.pubkey, publicKey, newAuthority.authorityTypes, newAuthority.condition, Keypair.generate().publicKey, authorityConfig);
            const signature = await sendTransaction(new Transaction().add(tx), connection);
            await connection.confirmTransaction(signature);
            alert({
                severity: 'success',
                text: 'Success!'
            });
        } catch (error) {
            alertError(error);
        }
        setLoading(false);
    }



    const handleConditionChange = (event: SelectChangeEvent) => {
        switch (event.target.value) {
            case TagAuthorityCondition.constructor.name:
                setNewAuthority({
                    ...newAuthority, condition: new TagAuthorityCondition({
                        recordFactory: PublicKey.default
                    })
                })
                break;

        }
    };

    const addAuthorityType = () => {
        let newAuthorityTypes = newAuthority.authorityTypes;
        newAuthorityTypes.push(AuthorityType.Admin);
        setNewAuthority({
            ...newAuthority,
            authorityTypes: newAuthorityTypes
        })
    };

    const handleAuthorityTypeChange = (ix: number) => (event: SelectChangeEvent<AuthorityType>) => {
        let newAuthorityTypes = newAuthority.authorityTypes;
        newAuthorityTypes[ix] = event.target.value as any as AuthorityType;
        setNewAuthority({
            ...newAuthority,
            authorityTypes: newAuthorityTypes
        })

    };

    const authorityTypeIconLabels = useCallback((type: AuthorityType) => {
        const inner = (type) => {
            switch (type) {
                case AuthorityType.Admin:
                    return [<AdminPanelSettingsIcon />, <>Admin</>]
                case AuthorityType.CreatePost:
                    return [<SendIcon />, <>Create post</>]
                case AuthorityType.DeleteAnyPost:
                    return [<CancelScheduleSendIcon />, <>Delete any post</>]

                case AuthorityType.Vote:

                    return [<ThumbsUpDownIcon />, <>Interact</>]

                case AuthorityType.CreateSubChannel:
                    return [<StreamIcon />, <>Create sub-channel</>]

                case AuthorityType.RemoveSubChannel:
                    return [<DeleteSweepIcon />, <>Delete sub-channel</>]

                case AuthorityType.ManageInfo:
                    return [<InfoIcon />, <>Change channel info</>]
                default:
                    return [undefined, <>Undefined</>]
            }

        }
        let arr = inner(type);
        return [<ListItemIcon key={0}>{arr[0]}</ListItemIcon>, <ListItemText key={1}>{arr[1]}</ListItemText>]
    }, [])

    const getValueInput = () => {
        if (newAuthority.condition instanceof KeyAuthorityCondition) {
            return <TextField
                required
                id="filled-required"
                label='Public key'
                variant="filled"
                value={value}
                onChange={(event) => {
                    setValue(event.target.value)
                    if (isPublicKey(value)) {
                        setNewAuthority({ ...newAuthority, condition: { key: new PublicKey(value) } as KeyAuthorityCondition })
                    }
                }}
                error={!isPublicKey(value)}
            />
        }
        if (newAuthority.condition instanceof KeyAuthorityCondition) {
            return <TextField
                required
                id="filled-required"
                label='Public key'
                variant="filled"
                value={value}
                onChange={(event) => {
                    setValue(event.target.value)
                    if (isPublicKey(value)) {
                        setNewAuthority({ ...newAuthority, condition: { recordFactory: new PublicKey(value) } as TagAuthorityCondition })
                    }
                }}
                error={!isPublicKey(value)}
            />
        }
        if (newAuthority.condition instanceof NoneAuthorityCondition) {
            return undefined
        }
    }


    return <>
        <Typography variant="h5" gutterBottom>Create authority</Typography>
        <Grid container sx={{ pb: 2 }} spacing={2} direction="column"  >

            <Grid item container spacing={2} direction="column">
                <Grid item>
                    <Typography variant="h6" gutterBottom>Condition</Typography>
                </Grid>
                <Grid item>
                    <FormControl fullWidth>
                        <InputLabel id="select-condition-input">Condition</InputLabel>
                        <Select
                            labelId="select-condition"
                            id="select-condition"
                            value={newAuthority.condition.constructor.name}
                            label="Condition"
                            onChange={() => { }}
                        >
                            <MenuItem value={KeyAuthorityCondition.name}>Public key</MenuItem>
                            <MenuItem value={TagAuthorityCondition.name}>Badge</MenuItem>
                            <MenuItem value={NoneAuthorityCondition.name}>No condition </MenuItem>

                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    {getValueInput()}
                </Grid>
            </Grid>
            <Grid item container spacing={2}>
                <Grid item container alignItems="center">
                    <Grid item>
                        <Typography variant="h6" gutterBottom>Authority</Typography>
                    </Grid>
                    <Grid item>
                        <IconButton onClick={addAuthorityType}><AddIcon /></IconButton>
                    </Grid>
                </Grid>
                <Grid item container direction="column" spacing={2}>
                    {newAuthority.authorityTypes.map((type, ix) =>
                        <Grid item key={type + '-' + ix} >
                            <FormControl fullWidth>
                                <InputLabel id="select-condition-input">Permissions</InputLabel>
                                <Select
                                    labelId="select-condition"
                                    id="select-condition"
                                    label="Type"
                                    value={type}
                                    onChange={handleAuthorityTypeChange(ix)}
                                >
                                    {
                                        AUTHORITY_TYPES.map(type => <MenuItem key={'opt-' + type + '-' + ix} value={type}><Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}>{authorityTypeIconLabels(type)}</Box></MenuItem>)
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                    )}
                </Grid>
            </Grid>
            <Grid item sx={{ marginLeft: 'auto' }} >
                <Box sx={{ display: "flex", justifyContent: "right" }}>
                    <LoadingButton disabled={!publicKey || newAuthority.authorityTypes.length == 0} onClick={saveAuthority} loading={loading}>Save</LoadingButton>

                </Box>
                {!publicKey && <FormHelperText error id="connect-wallet-help">You need to connect a wallet</FormHelperText>}

            </Grid>
        </Grid>
    </> */
    return <></>
}