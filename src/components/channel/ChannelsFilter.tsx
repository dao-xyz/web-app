import {
    Box,
    Chip,
    FormHelperText,
    Grid,
    Link,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";
import React, { FC, useContext, useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { ChannelAccount, getChannel, getChannelsByNamePrefix } from "@dao-xyz/sdk-social";
import { AccountInfoDeserialized } from "@dao-xyz/sdk-common";
import { useNetwork } from "../../contexts/Network";
import { CHANNEL_NEW, getChannelRoute } from "../../routes/routes";
import { useChannels } from "../../contexts/ChannelsContext";
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useConnection, useLocalStorage } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

const defaultChannel = "4NxwUQVVcJTh58ywcQ5aVoBbZUHZNuGZxmepEPTWxyZh"

const difference = (a: AccountInfoDeserialized<ChannelAccount>[], b: AccountInfoDeserialized<ChannelAccount>[]) => {
    if (a.length != b.length)
        return true;
    for (let i = 0; i < a.length; i++) {
        if (!a[i].pubkey.equals(b[i].pubkey)) {
            return true
        }
    }
    return false;
}
export const ChannelsFilter: FC<{ onChange: (channels: AccountInfoDeserialized<ChannelAccount>[]) => any }> = ({ onChange }) => {
    const [searchResults, setSearchResults] = useState<AccountInfoDeserialized<ChannelAccount>[]>([]);
    const network = useNetwork();
    const { connection } = useConnection();
    const navigate = useNavigate();
    const onClickChannel = (channel: AccountInfoDeserialized<ChannelAccount>) => {
        navigate(getChannelRoute(channel.pubkey));
    }
    // Data might grow old using localstorage cache of whole channel accounts, but thats okay for now
    const [storageValue, setStorageValue] = useLocalStorage<string[]>('FEED_CHANNEL_FILTER', []);


    const [value, setValue] = useState<AccountInfoDeserialized<ChannelAccount>[]>([]);
    const loadStoredFilter = async (pubkeys: string[]): Promise<AccountInfoDeserialized<ChannelAccount>[]> => {
        return Promise.all(pubkeys.map(key => {
            console.log(key)
            return getChannel(new PublicKey(key), connection)
        }))
    }

    const loadDefault = () => {
        getChannelsByNamePrefix("Welcome", connection).then(result => {
            setSearchResults(result)
            updateValue(result)
        });
    }
    useEffect(() => {
        if (storageValue)
            loadStoredFilter(storageValue).then((results) => {
                setValue(results)
                if (results?.length > 0) {

                    onChange(results);
                }
                else {

                    loadDefault();
                }
            })
        else {
            loadDefault();
        }
    },
        [])

    const updateValue = (newValue: AccountInfoDeserialized<ChannelAccount>[]) => {
        console.log(newValue, value, difference(newValue, value))
        if (difference(newValue, value)) {
            setStorageValue(newValue.map(x => x.pubkey.toBase58()));
            setValue(newValue);
            onChange(newValue);
        }
    }


    const searchChange = (event: any) => {
        if (typeof event.target.value === 'string')
            getChannelsByNamePrefix(event.target.value, connection).then(result => {
                setSearchResults(result.filter(x => !x.data.name.toLowerCase().startsWith("f")))
            });
    }

    return (
        <>
            <Autocomplete
                multiple
                id="channel-filter"
                value={value as any}
                onInputChange={searchChange}
                onChange={(event, newValue) => {
                    updateValue(newValue);
                }}
                freeSolo
                filterOptions={(x) => x}
                options={searchResults}
                isOptionEqualToValue={(option, value) => {
                    return option.pubkey.equals(value.pubkey);
                }}
                getOptionLabel={(option) => option.data.name}
                renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                        <Chip
                            label={option.data.name}
                            {...getTagProps({ index })}
                            onClick={() => { onClickChannel(option) }}
                        />
                    ))
                }
                style={{ width: '100%' }}
                renderInput={(params) => (
                    <TextField {...params} label="Channels" placeholder="Channels" />
                )}
            />
            <Link component={RouterLink} to={CHANNEL_NEW} sx={{ float: 'right', }} variant="body2">
                Create a new channel
            </Link>
        </>
    );
}
