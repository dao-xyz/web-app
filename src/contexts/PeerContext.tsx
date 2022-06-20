import React, { useContext, useEffect } from "react";
import { AnyPeer } from '@dao-xyz/shard';
import { createNode } from "@dao-xyz/social-interface";
import BN from 'bn.js';
import * as IPFS from 'ipfs';
import { IPFS as IPFSInstance } from 'ipfs-core-types'
import { create } from 'ipfs-http-client'
import { useWallet } from "@solana/wallet-adapter-react";
import { MetaMaskWalletAdapter } from "./MetamaskWallet";
import Identities from "orbit-db-identity-provider";

interface IPeerContext {
    peer: AnyPeer
}
export const PeerContext = React.createContext<IPeerContext>({} as any);
export const usePeer = () => useContext(PeerContext);

export const PeerProvider = ({ children }: { children: JSX.Element }) => {
    const [peer, setPeer] = React.useState<AnyPeer | undefined>(undefined);
    const wallet = useWallet()
    const memo = React.useMemo<IPeerContext>(
        () => ({
            peer
        }),
        [peer?.orbitDB?.identity?.id]
    );
    /* 
       
        */
    useEffect(() => {
        if (!wallet.publicKey)
            return;


        if (wallet.wallet.adapter instanceof MetaMaskWalletAdapter === false) {
            console.error(`Wallet adapter: ${wallet.wallet.adapter.constructor.name} is not supported for OrbitDB yet`)
            return;
        }
        console.log('create ipfs node')

        /* 
        new Promise((resolve) => resolve(create({
            port: 5001,
            timeout: 10000,
        })))
        ; 
        */
        console.log('create ipfs node start');
        IPFS.create({
            relay: { enabled: false, hop: { enabled: false, active: false } },
            preload: { enabled: false },
            EXPERIMENTAL: { ipnsPubsub: false, pubsub: true },
            offline: true,
            config: {
                Bootstrap: [

                ],
                Addresses: {
                    Swarm: []
                },
                Discovery: {
                    MDNS: { enabled: false },
                    webRTCStar: { enabled: false },
                },
            },

            repo: String(Math.random() + Date.now())

        }).then(async (node) => {

            console.log("Created ipfs node", node);
            node.libp2p.connectionManager.opts.autoDial = false;
            await node.libp2p.connectionManager.dialer.stop();
            console.log(node.libp2p)
            await node.swarm.connect("/ip4/127.0.0.1/tcp/5432/ws/p2p/12D3KooWC1Pb6XmSxY4YKGUPicYME8Ea27Y2gS4SbFKRndPzgF4C")
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true)
                }, 10000)
            })
            Identities.createIdentity({
                type: "ethereum",
                wallet: (wallet.wallet.adapter as MetaMaskWalletAdapter).provider.getSigner(),
            }).then((identity) => {
                console.log('config', identity)
                createNode(node, identity, false).then(async (peer) => {
                    console.log("Created peer", peer);
                    setPeer(peer);
                    console.log('subs', (await node.pubsub.ls()))

                })
            });
        })
        setTimeout(async () => {
            /*             console.log("Test swarm connect to", "/ip4/127.0.0.1/tcp/4332/ws/p2p/12D3KooWC1Pb6XmSxY4YKGUPicYME8Ea27Y2gS4SbFKRndPzgF4C");
                       console.log('MY ID', (await node.id()).id.toString());
                        console.log("CONFIG BEFORE CONN", await node.swarm.addrs());*/

            /*             await node.swarm.connect("/ip4/127.0.0.1/tcp/4332/ws/p2p/12D3KooWC1Pb6XmSxY4YKGUPicYME8Ea27Y2gS4SbFKRndPzgF4C");
            
            console.log("CONFIG AFTER CONN", await node.swarm.addrs()); */
            /*  setTimeout(() => {
                 node.pubsub.publish("hello", Buffer.from("world"));
             }, 3000) */


        }, 10000);





    }
        ,
        [wallet?.publicKey ? (typeof wallet?.publicKey == 'string' ? wallet?.publicKey : wallet?.publicKey.toBase58()) : undefined])

    return (
        <PeerContext.Provider value={memo}>
            {children}
        </PeerContext.Provider>
    );
};
