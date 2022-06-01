import { Wallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useCallback, useMemo } from "react";

export const usePublicKeyWalletToCopy = (
  publicKey: PublicKey | null,
  wallet: Wallet | null,
  children: React.ReactNode,
  setCopied: (copied: boolean) => any
) => {
  const base58 = useMemo(() => typeof publicKey != 'string' ? publicKey?.toBase58() : publicKey, [publicKey]);
  const content = useMemo(() => {
    if (children) return children;
    if (!wallet || !base58) return null;
    return base58.slice(0, 4) + ".." + base58.slice(-4);
  }, [children, wallet, base58]);
  const copyAddress = useCallback(async () => {
    if (base58) {
      await navigator.clipboard.writeText(base58);
      setCopied(true);
      setTimeout(() => setCopied(false), 400);
    }
  }, [base58]);
  return {
    base58,
    content,
    copyAddress,
  };
};

export const usePublicKeyToCopy = (
  publicKey: PublicKey | null,
  setCopied: (copied: boolean) => any
) => {
  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
  const content = useMemo(() => {
    if (!base58) return null;
    return base58.slice(0, 4) + ".." + base58.slice(-4);
  }, [, base58]);
  const copyAddress = useCallback(async () => {
    if (base58) {
      await navigator.clipboard.writeText(base58);
      setCopied(true);
      setTimeout(() => setCopied(false), 400);
    }
  }, [base58]);
  return {
    base58,
    content,
    copyAddress,
  };
};
