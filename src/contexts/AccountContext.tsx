import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  NftStorageAdapter,
  PinataAdapter,
  IPFSAdapter,
} from "@dao-xyz/ipfs-pinning-adapter";

import { SimpleConfig, KeySecretConfig } from "@dao-xyz/ipfs-pinning-adapter";
import {
  useConnection,
  useLocalStorage,
  useWallet,
} from "@solana/wallet-adapter-react";
import { hash } from "./EncryptionContext";
import { Encrypter } from "../helpers/encrypter";
import { Balance } from "@mui/icons-material";
import { useNetwork } from "./Network";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export interface AccountState {
  balance: number | undefined;
  transactionEvent: () => void;
}

export const AccountContext = createContext<AccountState>({} as AccountState);

export function useAccount(): AccountState {
  return useContext(AccountContext);
}

export const AccountProvider: FC = ({ children, ...props }) => {
  const [balance, setBalance] = useState<number | undefined>(0);
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const state = useMemo<AccountState>(
    () => ({
      balance,
      transactionEvent: () => {
        updateTokenBalance();
      },
    }),
    [balance, publicKey]
  );
  const updateTokenBalance = useCallback(() => {
    if (publicKey)
      connection.getBalance(publicKey).then((balance) => {
        setBalance(balance / LAMPORTS_PER_SOL);
      });
    else {
      setBalance(undefined);
    }
  }, [publicKey]);
  useEffect(() => {
    updateTokenBalance();
  }, [publicKey]); // we should also have some change detection when transaction are done (balance will cahnge)

  return (
    <AccountContext.Provider value={state}>{children}</AccountContext.Provider>
  );
};
