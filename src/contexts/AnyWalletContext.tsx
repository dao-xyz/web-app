import React, { useContext, useEffect } from "react";
import { Network } from "./SolanaNetwork";

import { Adapter, MessageSignerWalletAdapterProps, SendTransactionOptions, SignerWalletAdapterProps, WalletName, WalletReadyState } from '@solana/wallet-adapter-base';
import { Connection, PublicKey, Transaction, TransactionSignature } from '@solana/web3.js';
export interface Wallet {
    adapter: Adapter;
    readyState: WalletReadyState;
}
export interface IAnyWalletContext {
    /*   autoConnect: boolean;
      wallets: Wallet[];
      wallet: Wallet | null;
      publicKey: PublicKey | null;
      connecting: boolean;
      connected: boolean;
      disconnecting: boolean;
      select(walletName: WalletName): void;
      connect(): Promise<void>;
      disconnect(): Promise<void>;
      sendTransaction(transaction: Transaction, connection: Connection, options?: SendTransactionOptions): Promise<TransactionSignature>;
      signTransaction: SignerWalletAdapterProps['signTransaction'] | undefined;
      signAllTransactions: SignerWalletAdapterProps['signAllTransactions'] | undefined;
      signMessage: MessageSignerWalletAdapterProps['signMessage'] | undefined; */
}


export const AnyWalletContext = React.createContext<IAnyWalletContext>({} as any);
export const useAnyWallet = () => useContext(AnyWalletContext);

export const AnyWalletProvider = ({ children }: { children: JSX.Element }) => {
    const memo = React.useMemo<IAnyWalletContext>(
        () => ({

        }),
        []
    );

    useEffect(() => { }, [])

    return (
        <AnyWalletContext.Provider value={memo}>
            <Network>
                {children}
            </Network>
        </AnyWalletContext.Provider>
    );
};
