
import { Connection, PublicKey, SendOptions, Transaction, TransactionSignature } from '@solana/web3.js';

import {
    BaseMessageSignerWalletAdapter,
    EventEmitter,
    scopePollingDetectionStrategy,
    SendTransactionOptions,
    WalletAccountError,
    WalletConnectionError,
    WalletDisconnectedError,
    WalletDisconnectionError,
    WalletError,
    WalletName,
    WalletNotConnectedError,
    WalletNotReadyError,
    WalletPublicKeyError,
    WalletReadyState,
    WalletSignTransactionError,
    WalletWindowClosedError,
} from '@solana/wallet-adapter-base';

import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
interface MetaMaskWalletEvents {
    connect(...args: unknown[]): unknown;
    disconnect(...args: unknown[]): unknown;
}

interface MetaMaskWallet extends EventEmitter<MetaMaskWalletEvents> {
    isMetaMask?: boolean;
    selectedAddress: string;
    publicKey?: { toBytes(): Uint8Array };
    isConnected(): boolean;
    signTransaction(transaction: Transaction): Promise<Transaction>;
    signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
    signAndSendTransaction(
        transaction: Transaction,
        options?: SendOptions
    ): Promise<{ signature: TransactionSignature }>;
    signMessage(message: Uint8Array): Promise<{ signature: Uint8Array }>;
    request(arg: {
        method: string;
        params?: unknown[] | object;
    }): Promise<unknown>;
}

interface MetaMaskWindow extends Window {
    ethereum?: MetaMaskWallet;
}

declare const window: MetaMaskWindow;

export interface MetaMaskWalletAdapterConfig { }

export const MetaMaskWalletName = 'MetaMask' as WalletName;

export const checkConnection = async (provider: Web3Provider): Promise<boolean> => {
    try {
        /*  const resp = await wallet
             .request({ method: 'eth_accounts', params: [] }); */
        // MetaMask requires requesting permission to connect users accounts
        await provider.send("eth_requestAccounts", []);

        return true;
    } catch (error) {
        /*   let connected = await waitForAccount(wallet);
          return connected; */
        return false;
    }
}
/* export async function waitForAccount(wallet: MetaMaskWallet): Promise<boolean> {
    const timeOut = 10 * 1000;
    let start = +new Date;
    while (+new Date - start < timeOut) {
        try {
            const accounts = await wallet.request({ method: 'eth_accounts' });
            if (accounts instanceof Array && accounts.length > 0) {
                return true;
            }
        } catch (e) { }
    }
    return false;
}
 */
export class MetaMaskWalletAdapter extends BaseMessageSignerWalletAdapter {
    name = MetaMaskWalletName;
    url = 'https://metamask.io';
    icon = 'data:image/png;base64,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'

    private _connecting: boolean;
    private _wallet: MetaMaskWallet | null;
    private _provider: Web3Provider | null;
    private _readyState: WalletReadyState =
        typeof window === 'undefined' || typeof document === 'undefined'
            ? WalletReadyState.Unsupported
            : WalletReadyState.NotDetected;

    constructor(config: MetaMaskWalletAdapterConfig = {}) {
        super();
        this._connecting = false;
        this._wallet = null;
        this._provider = null;

        if (this._readyState !== WalletReadyState.Unsupported) {
            scopePollingDetectionStrategy(() => {
                if (window.ethereum?.isMetaMask) {
                    this._readyState = WalletReadyState.Installed;
                    console.log('installed', this._readyState)
                    this.emit('readyStateChange', this._readyState);
                    return true;
                }
                return false;
            });
        }

    }

    get publicKey(): PublicKey | null {
        return this._wallet?.selectedAddress as any as PublicKey;
    }

    get connecting(): boolean {
        return this._connecting;
    }

    get connected(): boolean {
        return !!this._wallet?.isConnected();
    }

    get readyState(): WalletReadyState {
        return this._readyState;
    }

    get provider(): Web3Provider {
        return this._provider;
    }

    async connect(): Promise<void> {

        try {
            console.log('CONNECT 1!', this.connected, this.connecting, this._readyState);

            if (this.connected || this.connecting) return;
            if (this._readyState !== WalletReadyState.Installed) throw new WalletNotReadyError();

            this._connecting = true;

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const wallet = window!.ethereum!;
            const provider = new ethers.providers.Web3Provider(wallet)

            while (!await checkConnection(provider)) {
                console.log('Waiting for connection to wallet');
            }
            /*  console.log('CONNECT 2!', wallet, connected, wallet.isConnected());
 
             if (!connected) {
                 try {
                     await provider.send('eth_requestAccounts', []);
                 } catch (error: any) {
                     if (error instanceof WalletError) throw error;
                     throw new WalletConnectionError(error?.message, error);
                 } finally {
                 }
             } */

            provider.on('disconnect', this._disconnected);

            this._wallet = wallet;
            this._provider = provider;

            this.emit('connect', this._wallet.selectedAddress as any as PublicKey);
            console.log("GOT ADDRS", this._wallet)
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        } finally {
            this._connecting = false;
        }
    }

    async disconnect(): Promise<void> {
        console.log('disconnect')
        const wallet = this._wallet;
        const provider = this._provider;

        if (wallet) {
            provider.off('disconnect', this._disconnected);

            this._wallet = null;
            this._provider = null;
            try {
                await provider.send(
                    "eth_requestAccounts",
                    [
                        {
                            eth_accounts: {}
                        }
                    ]
                );

            } catch (error: any) {
                this.emit('error', new WalletDisconnectionError(error?.message, error));
            }
        }

        this.emit('disconnect');
    }

    async sendTransaction(
        transaction: Transaction,
        connection: Connection,
        options?: SendTransactionOptions
    ): Promise<TransactionSignature> {
        try {
            const wallet = this._wallet;
            // Phantom doesn't handle partial signers, so if they are provided, don't use `signAndSendTransaction`
            if (wallet && 'signAndSendTransaction' in wallet && !options?.signers) {
                // HACK: Phantom's `signAndSendTransaction` should always set these, but doesn't yet
                transaction.feePayer = transaction.feePayer || this.publicKey || undefined;
                transaction.recentBlockhash =
                    transaction.recentBlockhash || (await connection.getRecentBlockhash('finalized')).blockhash;

                const { signature } = await wallet.signAndSendTransaction(transaction, options);
                return signature;
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        }

        return await super.sendTransaction(transaction, connection, options);
    }

    async signTransaction(transaction: Transaction): Promise<Transaction> {
        try {
            const wallet = this._wallet;
            if (!wallet) throw new WalletNotConnectedError();

            try {
                return (await wallet.signTransaction(transaction)) || transaction;
            } catch (error: any) {
                throw new WalletSignTransactionError(error?.message, error);
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        }
    }

    async signAllTransactions(transactions: Transaction[]): Promise<Transaction[]> {
        try {
            const wallet = this._wallet;
            if (!wallet) throw new WalletNotConnectedError();

            try {
                return (await wallet.signAllTransactions(transactions)) || transactions;
            } catch (error: any) {
                throw new WalletSignTransactionError(error?.message, error);
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        }
    }

    async signMessage(message: Uint8Array): Promise<Uint8Array> {
        try {
            const wallet = this._wallet;
            if (!wallet) throw new WalletNotConnectedError();

            try {
                const { signature } = await wallet.signMessage(message);
                return signature;
            } catch (error: any) {
                throw new WalletSignTransactionError(error?.message, error);
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        }
    }

    private _disconnected = () => {
        const wallet = this._wallet;
        if (wallet) {
            this._provider.off('disconnect', this._disconnected);

            this._wallet = null;
            this._provider = null;

            this.emit('error', new WalletDisconnectedError());
            this.emit('disconnect');
        }
    };
}