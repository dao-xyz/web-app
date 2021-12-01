import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import React, { createContext, useReducer } from "react";
import { getNetworkConfig, NetworkConfig } from "../services/network";



const initialState = getNetworkConfig(WalletAdapterNetwork.Devnet);

export const Context = createContext<[NetworkConfig, React.Dispatch<any>]>([initialState, () => { }]);

type Action =
    | { type: 'devnet' }

const Reducer = (state: NetworkConfig, action: Action): NetworkConfig => {
    switch (action.type) {
        case 'devnet':
            return {
                ...state
            };
        default:
            throw new Error("Not supported")
    }
};

const NetConfig = ({ children }: { children: JSX.Element[] }) => {
    const [state, dispatch] = useReducer(Reducer, initialState);
    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
};

export default NetConfig;