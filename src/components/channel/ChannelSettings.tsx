import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { ChannelAccount, ChannelAuthorityAccount, ChannelType, getChannel } from '@dao-xyz/sdk-social';
import React, { FC, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { getTagRecord } from "@dao-xyz/sdk-tag";

import { AccountInfoDeserialized } from "@dao-xyz/sdk-common";
import { KeyAuthorityCondition, TagAuthorityCondition, NoneAuthorityCondition } from "@dao-xyz/sdk-social";
import { Box, CircularProgress, Container, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Toolbar, Typography } from "@mui/material";
import { getChannelContentString } from "../../utils/channelUtils";
import { MarkdownContent } from "../data/MarkdownContent";
import SendIcon from '@mui/icons-material/Send';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import PublickeyText from "../network/PublickeyText";
import InfoIcon from '@mui/icons-material/Info';
import StreamIcon from '@mui/icons-material/Stream';
import { useSmartWallet } from "../../contexts/SmartWalletContext";
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import { ChannelNewAuthority } from "./ChannelNewAuthority";
import { AuthorityType, getSignerAuthority } from "@dao-xyz/sdk-social";
import { SignerMaybeSignForMe } from "@dao-xyz/sdk-signforme";
import { deleteAuthorityTransaction } from '@dao-xyz/sdk-social';
import { useAlert } from "../../contexts/AlertContext";

const AUTHORITY_TYPES = [AuthorityType.Admin, AuthorityType.CreatePost, AuthorityType.Vote, AuthorityType.DeleteAnyPost, AuthorityType.CreateSubChannel, AuthorityType.RemoveSubChannel, AuthorityType.ManageInfo];
const hasAuthority = (authorityType: AuthorityType, myAuthorityTypes: Set<AuthorityType>) => {
    return myAuthorityTypes.has(authorityType) || myAuthorityTypes.has(AuthorityType.Admin);
}

export const ChannelSettings: FC<{ channel: AccountInfoDeserialized<ChannelAccount>, authorities: AccountInfoDeserialized<ChannelAuthorityAccount>[], authoritiesByType: Map<AuthorityType, AccountInfoDeserialized<ChannelAuthorityAccount>[]> }> = ({ channel, authorities, authoritiesByType }) => {

    const { publicKey, sendTransaction } = useWallet();
    const { burnerWallet } = useSmartWallet();
    const { alert, alertError } = useAlert();
    const { connection } = useConnection();
    const [editAuthorities, setEditAuthorities] = useState(false);
    const [loadingAuthority, setLoadingAuthority] = useState<AccountInfoDeserialized<ChannelAuthorityAccount> | undefined>(undefined);

    const [editAuthoritiesPreferredType, setEditAuthoritiesPreferredType] = useState(AuthorityType.Admin);
    const [myAuthorities, setMyAuthorities] = useState<Set<AuthorityType>>(new Set());

    const manageAuthorities = (preferredType: AuthorityType) => {
        setEditAuthoritiesPreferredType(preferredType)
        setEditAuthorities(true);
    }

    const authorityTypeIconLabels = useCallback((type: AuthorityType) => {
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
    }, [])

    const owner = publicKey ? publicKey : burnerWallet?.delegateeSigner;
    const reloadMyAuthorities = () => {
        const getOwnedAuthorities = async () => {
            let ownedAuthorities = new Set<AuthorityType>();
            if (!owner) {
                return ownedAuthorities;
            }
            for (const authority of authorities) {
                if (authority.data.condition instanceof KeyAuthorityCondition) {
                    if (owner.equals(authority.data.condition.key)) {
                        authority.data.authorityTypes.forEach(ownedAuthorities.add, ownedAuthorities)
                    }
                }
                if (authority.data.condition instanceof TagAuthorityCondition) {
                    // check if I got the tag
                    let tagRecord = await getTagRecord(owner, authority.data.condition.recordFactory, connection);
                    if (tagRecord) {
                        authority.data.authorityTypes.forEach(ownedAuthorities.add, ownedAuthorities)
                    }
                }
                if (authority.data.condition instanceof NoneAuthorityCondition) {
                    authority.data.authorityTypes.forEach(ownedAuthorities.add, ownedAuthorities)
                }
            }

            return ownedAuthorities
        }
        getOwnedAuthorities().then((result) => {
            setMyAuthorities(result)
        });
    }
    useEffect(() => {
        // load my permissions
        reloadMyAuthorities();

    }
        ,
        [channel.pubkey.toBase58(), editAuthorities, publicKey?.toBase58(), burnerWallet?.delegateeSigner.toBase58(), authoritiesByType])

    const [infoContent, setInfoContent] = useState<string | undefined>(undefined);
    const authorityCondition = (authority: AccountInfoDeserialized<ChannelAuthorityAccount>) => {
        if (!authority?.data) {
            return <>No conditions exist</>
        }
        if (authority.data.condition instanceof KeyAuthorityCondition) {
            return <PublickeyText publicKey={authority.data.condition.key} />
        }
        if (authority.data.condition instanceof TagAuthorityCondition) {
            return <>You have the recieved a badge from:<PublickeyText publicKey={authority.data.condition.recordFactory} /></>
        }
        if (authority.data.condition instanceof NoneAuthorityCondition) {
            return <>Everyone is allowed</>
        }
    }

    const deleteAuthority = async (authority: AccountInfoDeserialized<ChannelAuthorityAccount>) => {

        if (!publicKey) {
            alert({
                severity: 'error',
                text: 'Wallet not connected'
            })
            return;
        }
        setLoadingAuthority(authority);
        try {
            let authorityConfig = await getSignerAuthority(new SignerMaybeSignForMe(publicKey), channel.pubkey, AuthorityType.CreatePost, connection);
            const tx = await deleteAuthorityTransaction(authority.pubkey, channel.pubkey, publicKey, authorityConfig);
            const signature = await sendTransaction(new Transaction().add(tx), connection);
            await connection.confirmTransaction(signature);
        } catch (error) {
            alertError(error);
        } finally {
            setLoadingAuthority(undefined);

        }

    }

    const authorityInfo = (authorityType: AuthorityType) => {
        let key = authorityType + '-label';
        let iconLabel = authorityTypeIconLabels(authorityType);
        return <Grid key={key} container item direction="column">
            <Grid sx={{ color: theme => hasAuthority(authorityType, myAuthorities) ? theme.palette.success.main : theme.palette.error.main }} container item direction="row" spacing={1} alignItems='center'>
                <Grid item>
                    {iconLabel[0]}
                </Grid>
                <Grid item>
                    {iconLabel[1]}
                </Grid>
                {myAuthorities.has(AuthorityType.Admin) && <Grid item>
                    <IconButton size="small" onClick={() => { manageAuthorities(authorityType) }} > <AddIcon /></IconButton>
                </Grid>}
            </Grid>
        </Grid>
    }
    const capabilities = useMemo(() =>
        AUTHORITY_TYPES.filter(type => hasAuthority(type, myAuthorities)).map((type, ix) =>
            <Grid container item key={type + '-' + ix}>
                {authorityInfo(type)}
                <Grid container item direction="column" >
                    {authoritiesByType.has(type) ? authoritiesByType.get(type).map((authority, jx) =>
                        <Grid container item direction="row" key={(1 + ix) * (1 + jx)}>
                            <Grid item>- {authorityCondition(authority)}</Grid>
                            {myAuthorities.has(AuthorityType.Admin) &&
                                <Grid item key={jx}>
                                    <IconButton size="small" onClick={() => deleteAuthority(authority)}>{loadingAuthority?.pubkey.equals(authority.pubkey) ? <CircularProgress size="small" /> : <DeleteIcon />}</IconButton>
                                </Grid>
                            }
                        </Grid>
                    ) : <Grid item key={ix + '-undefined'}>{authorityCondition(undefined)}</Grid>}
                </Grid>
            </Grid >
        )
        , [channel?.pubkey.toString(), publicKey?.toString(), myAuthorities.size, JSON.stringify(authorities.map(a => a.pubkey.toBase58()))])

    const nonCapabilities = useMemo(() =>
        AUTHORITY_TYPES.filter(type => !hasAuthority(type, myAuthorities)).map((type, ix) =>
            <Grid item key={type + '-' + ix}>
                {authorityInfo(type)}
                {authoritiesByType.has(type) ? authoritiesByType.get(type).map((authority, jx) => <Grid item key={(ix + 1) * (jx + 1)}>- {authorityCondition(authority)}</Grid>) : <Grid item>{authorityCondition(undefined)}</Grid>}
            </Grid >
        )
        , [channel?.pubkey.toString(), publicKey?.toString(), myAuthorities.size, JSON.stringify(authorities.map(a => a.pubkey.toBase58()))])
    useEffect(() => {
        getChannelContentString(channel.data).then((info) => {
            setInfoContent(info);

        });
    }, [channel.pubkey.toString()])
    return <>
        <Toolbar variant="dense" />
        <Container maxWidth="sm" component="main">
            {!editAuthorities ? <Grid container sx={{ p: 2 }} spacing={2} justifyContent="center" direction="column" >
                <Grid item sx={{ maxWidth: '50%', minWidth: '200px' }}>
                    <Typography variant="h5" gutterBottom>Info</Typography>
                    {channel.data.name}
                    <MarkdownContent content={infoContent} />
                </Grid>
                {owner ? <Grid item container spacing={2} justifyContent="center">
                    <Grid item sx={{ maxWidth: '50%', minWidth: '200px' }}>
                        <Typography variant="h5" gutterBottom>What can I do here?</Typography>
                        <Grid container spacing={2}>
                            {capabilities.length > 0 ? capabilities : <Grid item>You can't do anything here</Grid>}
                        </Grid>

                    </Grid>
                    <Grid item sx={{ maxWidth: '50%', minWidth: '200px' }}>

                        <Typography variant="h5" gutterBottom>What can not I do here?</Typography>
                        <Grid container spacing={2}>
                            {nonCapabilities.length > 0 ? nonCapabilities : <Grid item>There is nothing you can't do here!</Grid>}
                        </Grid>
                    </Grid>
                </Grid> : <Grid item><Typography variant="h5">Authorities</Typography><Typography>Connect your wallet to see permission info</Typography></Grid>}
            </Grid> :
                <Grid item container spacing={2} direction="row">
                    <Grid item>
                        <IconButton onClick={() => setEditAuthorities(false)}><ArrowBackIcon /></IconButton>
                    </Grid>
                    <Grid item container justifyContent='left' sx={{ maxWidth: '400px' }}>
                        <Grid item >
                            <ChannelNewAuthority channel={channel} suggestedType={editAuthoritiesPreferredType} />
                        </Grid>
                    </Grid>
                </Grid>
            }
        </Container>
    </>
}