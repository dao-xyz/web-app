import { Button, ButtonProps } from '@mui/material';
import React, { FC, MouseEvent, useCallback } from 'react';
import { useIpfsProviderModal } from './useIpfsProviderModal';

export const WalletModalButton: FC<ButtonProps> = ({ children = 'Connect IPFS service', onClick, ...props }) => {
    const { visible, setVisible } = useIpfsProviderModal();

    const handleClick = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            if (onClick) onClick(event);
            if (!event.defaultPrevented) setVisible(!visible);
        },
        [onClick, setVisible, visible]
    );

    return (
        <Button //className="wallet-adapter-button-trigger" 
            onClick={handleClick} {...props}>
            {children}
        </Button>
    );
};