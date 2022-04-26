import { ContentCopy } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { PublicKey } from "@solana/web3.js";
import * as React from "react";
import { usePublicKeyToCopy } from '../../utils/keys';

const PublickeyText: React.FC<{ publicKey: PublicKey }> = ({ publicKey }) => {

    const {
        base58,
        copyAddress,
        content
    } = usePublicKeyToCopy(publicKey, (_: boolean) => { });

    return (
        <Button endIcon={<ContentCopy />} variant="text" onClick={copyAddress}>
            <Typography>
                {content}
            </Typography>
        </Button>
    )
};

export default PublickeyText;