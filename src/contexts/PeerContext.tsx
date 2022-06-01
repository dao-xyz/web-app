import React, { useContext, useEffect } from "react";
import { AnyPeer } from '@dao-xyz/shard';
import { createNode } from "@dao-xyz/social-interface";
import BN from 'bn.js';

interface IPeerContext {
    peer: AnyPeer
}
export const PeerContext = React.createContext<IPeerContext>({} as any);
export const usePeer = () => useContext(PeerContext);

export const PeerProvider = ({ children }: { children: JSX.Element }) => {
    const [peer, setPeer] = React.useState<AnyPeer | undefined>(undefined);
    const memo = React.useMemo<IPeerContext>(
        () => ({
            peer
        }),
        [peer?.orbitDB?.identity?.id]
    );

    useEffect(() => {
        createNode('localhost', new BN(15 * 1000 * 1000)).then((peer) => {
            setPeer(peer);
        })
    },
        [])

    return (
        <PeerContext.Provider value={memo}>
            {children}
        </PeerContext.Provider>
    );
};
