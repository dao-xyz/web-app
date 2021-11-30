import { Button, ButtonProps } from '@mui/material';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import React, { FC, MouseEvent, useCallback } from 'react';

export const WalletModalButton: FC<ButtonProps> = ({ children = 'Signin with wallet', onClick, ...props }) => {
    const { visible, setVisible } = useWalletModal();

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