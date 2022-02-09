import { createContext, useContext } from 'react';

export interface IpfsWalletContextState {
    visible: boolean;
    setVisible: (open: boolean) => void;
}

export const IpfsWalletContext = createContext<IpfsWalletContextState>({} as IpfsWalletContextState);

export function useIpfsProviderModal(): IpfsWalletContextState {
    return useContext(IpfsWalletContext);
}