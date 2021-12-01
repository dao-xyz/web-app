import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { NetworkContext } from './Network';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { useLocation, useParams, useNavigate } from 'react-router';
import { ALL_CONFIGS, getNetworkConfigFromPathParam, getPathForNetwork } from '../../services/network';

export const SelectNetwork = () => {
    let { state, pathname } = useLocation();
    let navigator = useNavigate();
    const config = getNetworkConfigFromPathParam(useParams());
    console.log(config, state, pathname)
    const { changeNetwork } = React.useContext(NetworkContext);
    const handleChange = (event: SelectChangeEvent<WalletAdapterNetwork>) => {
        // changeNetwork(event.target.value as WalletAdapterNetwork)
        console.log('EVENT', event)
        switch (event.target.value) {
            case WalletAdapterNetwork.Mainnet.toString():
                navigator({ pathname: getPathForNetwork(WalletAdapterNetwork.Mainnet, pathname) })
                return changeNetwork(WalletAdapterNetwork.Mainnet)
            case WalletAdapterNetwork.Devnet.toString():
                navigator({ pathname: getPathForNetwork(WalletAdapterNetwork.Devnet, pathname) })
                return changeNetwork(WalletAdapterNetwork.Devnet)
            default:
                throw new Error("Unsupported network: " + event.target.value)
        }

    }
    return (
        <FormControl size="small" >

            <Select
                labelId="network-label"
                id="network-select"
                value={config.type}
                onChange={handleChange}
            >
                {ALL_CONFIGS.map(config => (<MenuItem key={config.name} value={config.type}>{config.name}</MenuItem>))}

            </Select>
        </FormControl >
    )
}