import { Button, ButtonProps } from '@mui/material';
/* import { useWallet } from '@solana/wallet-adapter-react';
import { WalletIcon } from '@solana/wallet-adapter-react-ui'; */
import React, { FC, MouseEventHandler, useCallback, useMemo } from 'react';
import { useIpfsService } from '../../contexts/IpfsServiceContext';

export const WalletConnectButton: FC<ButtonProps> = ({ children, disabled, onClick, ...props }) => {
    // const { service } = useIpfsService();

    const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
        (event) => {
            /*  if (onClick) onClick(event);
             // eslint-disable-next-line @typescript-eslint/no-empty-function
             if (!event.defaultPrevented) connect().catch(() => { }); */
        },
        [onClick]
    );

    const content = useMemo(() => {
        if (children) return children;
        /*  if (connecting) return 'Connecting ...';
         if (connected) return 'Connected';
         if (wallet) return 'Connect'; */
        return 'Connect Wallet';
    }, [children/* , connecting, connected, wallet */]);

    return (

        <></>
    );
};