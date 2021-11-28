import { Button } from "@mui/material";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { createChannelAccountTransaction } from "@solvei/solvei-client";
import React, { FC, useCallback } from "react";
import { getNetworkConfig } from "../../services/network";
import { NetworkType } from "../../types/chain";

export const Send = (props: { disabled?: boolean, name: string, network: NetworkType }) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const onClick = useCallback(async () => {
    if (!publicKey)
      throw new WalletNotConnectedError();

    const networkConfig = getNetworkConfig(props.network);
    const [transaction, _] = await createChannelAccountTransaction(props.name, publicKey, connection, networkConfig.programId);
    const signature = await sendTransaction(new Transaction().add(transaction), connection);

    await connection.confirmTransaction(signature, "processed");
  }, [publicKey, sendTransaction, connection]);

  return (

    <Button onClick={onClick} disabled={!publicKey || props.disabled}>
      Create
    </Button>
  );
};
