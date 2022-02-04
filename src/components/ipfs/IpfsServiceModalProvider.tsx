
/* 
import { WalletReadyState } from '@solana/wallet-adapter-base';
import { useWallet, Wallet } from '@solana/wallet-adapter-react'; */
import React, { FC, ReactNode, useLayoutEffect, useState } from 'react';
import { IpfsServiceModal, IpfsServiceModalProps } from './IpfsServiceModal';
/* import { IpfsProvider } from './IpfsServiceProvider';
 */import { IpfsWalletContext } from './useIpfsProviderModal';
/* import { IpfsProvider, WalletModalProps } from './IpfsServiceProvider'; */


export interface IpfsModalProviderProps extends IpfsServiceModalProps {
    children: ReactNode;
    logo: string;
}

export const IpfsServiceModalProvider: FC<IpfsModalProviderProps> = ({ children, ...props }) => {
    const [visible, setVisible] = useState(false);

    return (
        <IpfsWalletContext.Provider
            value={{
                visible,
                setVisible,
            }}
        >
            {children}
            {visible && <IpfsServiceModal {...props} />}
        </IpfsWalletContext.Provider>
    );
};