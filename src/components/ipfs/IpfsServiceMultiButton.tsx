import { Avatar, Button, ButtonProps, Menu, MenuItem } from '@mui/material';

import React, { FC, useCallback, useEffect, useMemo, useRef, useState, MouseEvent, ReactElement, CSSProperties } from 'react';
import { useIpfsService } from '../../contexts/IpfsServiceContext';
import { WalletConnectButton } from './IpfsProviderConnectButton';
import { WalletModalButton } from './IpfsProviderModalButton';
import { IpfsServiceIcon } from './IpfsServiceIcon';
import { useIpfsProviderModal } from './useIpfsProviderModal';



export const IpfsServiceMultiButtonMui: FC<ButtonProps & { onWalletModalClick: () => void }> = ({ children, onWalletModalClick, ...props }) => {
    const { service, reset } = useIpfsService();
    const { setVisible } = useIpfsProviderModal();
    const ref = useRef<HTMLUListElement>(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);


    // const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
    /*   const copyAddress = useCallback(async () => {
          if (base58) {
              await navigator.clipboard.writeText(base58);
              setCopied(true);
              setTimeout(() => setCopied(false), 400);
          }
      }, [base58]); */

    const handleClose = () => {
        setAnchorEl(null);
    };
    const disconnect = () => {
        reset();
        handleClose();
    }

    const openDropdown = (event: MouseEvent<any>) => setAnchorEl(event.currentTarget)

    const openModal = useCallback((event) => {
        handleClose();
        setVisible(true);

    }, [setVisible]);

    if (!service) return <WalletModalButton {...props} onClick={onWalletModalClick} />;
    /* if (!base58) return <WalletConnectButton {...props} />; */
    return (
        <>
            <Button variant="outlined" onClick={openDropdown} startIcon={<Avatar alt={service.name} src={service.icon} />}>
                {service.name}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={openModal}>Change IPFS service</MenuItem>
                <MenuItem onClick={disconnect}>Disconnect</MenuItem>
            </Menu>
        </>
    );
};