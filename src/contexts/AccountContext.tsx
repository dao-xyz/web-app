
import { createContext, FC, useContext, useEffect, useMemo, useState } from 'react';
import { NftStorageAdapter, PinataAdapter, IPFSAdapter } from '@s2g/ipfs-pinning-adapter';

import { SimpleConfig, KeySecretConfig } from '@s2g/ipfs-pinning-adapter';
import { useLocalStorage } from '@solana/wallet-adapter-react';
import { hash } from './EncryptionContext';
import { Encrypter } from '../helpers/encrypter';
import { Balance } from '@mui/icons-material';




export interface AccountState {
    balance: number,


}


export const AccountContext = createContext<AccountState>({} as AccountState);

export function useAccount(): AccountState {
    return useContext(AccountContext);
}

export const AccountProvider: FC = ({ children, ...props }) => {
    const [balance, setBalance] = useState(123);
    const state = useMemo<AccountState>(() => ({
        balance
    }), [balance]);

    return <AccountContext.Provider value={state}>
        {children}
    </AccountContext.Provider >

}