import React, { createContext, useContext, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AccountInfoDeserialized, ContentSourceString } from "@dao-xyz/sdk-common";
import {
  ChannelAccount,
  getChannel,
  ChannelAuthorityAccount,
  getChannels,
  getChannelAuthorities,
  AuthorityType,
  ChannelType,
} from "@dao-xyz/sdk-social";

import { useNetwork } from "./Network";
import { Keypair, PublicKey } from "@solana/web3.js";
import {
  ChannelTree,
  getParentChannelChain,
  getParentChannelChainTree,
} from "../utils/channelUtils";
import BN from 'bn.js';

interface ChannelSelection {
  selectionPath: AccountInfoDeserialized<ChannelAccount>[];
  selectionTree: ChannelTree;
  channel: AccountInfoDeserialized<ChannelAccount>;
  authorities: AccountInfoDeserialized<ChannelAuthorityAccount>[];
  authoritiesByType: Map<
    AuthorityType,
    AccountInfoDeserialized<ChannelAuthorityAccount>[]
  >;
}
interface IChannelContext {
  loading: boolean;
  selection: ChannelSelection;
  select: (channel: PublicKey) => Promise<void>;
  dao: AccountInfoDeserialized<ChannelAccount> | undefined
}

const groupAuthoritiesByType = (
  authorities: AccountInfoDeserialized<ChannelAuthorityAccount>[]
): Map<AuthorityType, AccountInfoDeserialized<ChannelAuthorityAccount>[]> => {
  let ret = new Map();
  for (const authority of authorities) {
    for (const type of authority.data.authorityTypes) {
      let arr = ret.get(type);
      if (!arr) {
        arr = [];
        ret.set(type, arr);
      }
      arr.push(authority);
    }
  }
  return ret;
};
export const ChannelsContext = React.createContext<IChannelContext>({} as any);
export const useChannels = () => useContext(ChannelsContext);
const mockChannelSelection = (): ChannelSelection => {

  let dao = {
    data: {
      channelType: ChannelType.Chat,
      collection: undefined,
      creation_timestamp: new BN(1640991600),
      encryption: undefined,
      info: new ContentSourceString({
        string: 'Hello world!'
      }),
      name: 'dao | xyz',
      parent: undefined
    },
    pubkey: new PublicKey("4MaR5cd9MsmZ274hX1ZTP3x7vgxASPGLLbyouBbKC5tr")
  };

  let welcome = {
    data: {
      channelType: ChannelType.Chat,
      collection: undefined,
      creation_timestamp: new BN(1640991600),
      encryption: undefined,
      info: new ContentSourceString({
        string: 'Hello world!'
      }),
      name: 'Welcome',
      parent: dao.pubkey
    },
    pubkey: Keypair.generate().publicKey
  };

  let gm = {
    data: {
      channelType: ChannelType.Chat,
      collection: undefined,
      creation_timestamp: new BN(1640991600),
      encryption: 1,
      info: new ContentSourceString({
        string: 'Hello world!'
      }),
      name: 'gm',
      parent: dao.pubkey
    },
    pubkey: Keypair.generate().publicKey
  };

  let forum = {
    data: {
      channelType: ChannelType.Chat,
      collection: undefined,
      creation_timestamp: new BN(1640991600),
      encryption: 1,
      info: new ContentSourceString({
        string: 'Hello world!'
      }),
      name: 'Forum',
      parent: dao.pubkey
    },
    pubkey: Keypair.generate().publicKey
  };
  let governance = {
    data: {
      channelType: ChannelType.Chat,
      collection: undefined,
      creation_timestamp: new BN(1640991600),
      encryption: 1,
      info: new ContentSourceString({
        string: 'Hello world!'
      }),
      name: 'Governance',
      parent: dao.pubkey
    },
    pubkey: Keypair.generate().publicKey
  };
  let coreUnits = {
    data: {
      channelType: ChannelType.Chat,
      collection: undefined,
      creation_timestamp: new BN(1640991600),
      encryption: 1,
      info: new ContentSourceString({
        string: 'Hello world!'
      }),
      name: 'Core units',
      parent: dao.pubkey
    },
    pubkey: Keypair.generate().publicKey
  };

  let product = {
    data: {
      channelType: ChannelType.Chat,
      collection: undefined,
      creation_timestamp: new BN(1640991600),
      encryption: 1,
      info: new ContentSourceString({
        string: 'Hello world!'
      }),
      name: 'Product',
      parent: coreUnits.pubkey
    },
    pubkey: Keypair.generate().publicKey
  };

  let roadmap = {
    data: {
      channelType: ChannelType.Chat,
      collection: undefined,
      creation_timestamp: new BN(1640991600),
      encryption: 1,
      info: new ContentSourceString({
        string: 'Hello world!'
      }),
      name: 'Roadmap',
      parent: product.pubkey
    },
    pubkey: Keypair.generate().publicKey
  };

  let targetAudience = {
    data: {
      channelType: ChannelType.Chat,
      collection: undefined,
      creation_timestamp: new BN(1640991600),
      encryption: 1,
      info: new ContentSourceString({
        string: 'Hello world!'
      }),
      name: 'Target audience',
      parent: product.pubkey
    },
    pubkey: Keypair.generate().publicKey
  };

  let userStories = {
    data: {
      channelType: ChannelType.Chat,
      collection: undefined,
      creation_timestamp: new BN(1640991600),
      encryption: 1,
      info: new ContentSourceString({
        string: 'Hello world!'
      }),
      name: 'User stories',
      parent: product.pubkey
    },
    pubkey: Keypair.generate().publicKey
  };


  return {
    authorities: [],
    authoritiesByType: new Map(),
    channel: welcome,
    selectionPath: [welcome, dao],
    selectionTree: {
      [dao.pubkey.toBase58()]: [welcome, gm, forum, governance, coreUnits],
      [welcome.pubkey.toBase58()]: [],
      [forum.pubkey.toBase58()]: [],
      [gm.pubkey.toBase58()]: [],
      [governance.pubkey.toBase58()]: [],
      [coreUnits.pubkey.toBase58()]: [product],
      [product.pubkey.toBase58()]: [roadmap, targetAudience, userStories]
    }
  }
}
export const ChannelsProvider = ({ children }: { children: JSX.Element }) => {
  const { connection } = useConnection();


  // const [accountCache, setAccountCache] = useState(new AccountCache<ChannelAccount>(50));
  const { config, isMock } = useNetwork();
  const [selection, setSelection] = React.useState<ChannelSelection>(isMock ? mockChannelSelection() : {
    selectionPath: undefined,
    selectionTree: undefined,
    authorities: undefined,
    authoritiesByType: undefined,
    channel: undefined,
  });

  const [loading, setLoading] = useState(false);
  const selectionMemo = React.useMemo(
    () => ({
      selection,
      loading,
      dao: selection.selectionPath?.length > 0 ? selection.selectionPath[selection.selectionPath.length - 1] : undefined,
      select: async (channel: PublicKey) => {
        setLoading(true);

        if (isMock) {
          setLoading(false);
          setSelection(mockChannelSelection());
          return;
        }

        let previousSelection = selection;
        setSelection({
          selectionPath: undefined,
          selectionTree: undefined,
          authorities: undefined,
          authoritiesByType: undefined,
          channel: undefined,
        });
        let channelAccount = undefined;
        /*   if (accountCache) {
            channelAccount = await getChannel(channel, connection);
          } */
        if (!channelAccount) {
          channelAccount = await getChannel(channel, connection);
        }

        let parents = [
          channelAccount,
          ...(await getParentChannelChain(
            channelAccount,
            connection /* accountCache */
          )),
        ];
        let parentTree = await getParentChannelChainTree(parents, connection);
        let previousParentTree = previousSelection.selectionTree;

        // If same DAO, then keep memory
        if (
          selection.selectionPath &&
          parents[parents.length - 1].pubkey.equals(
            selection.selectionPath[selection.selectionPath.length - 1].pubkey
          )
        ) {
          for (const key in previousParentTree) {
            if (!parentTree[key]) {
              parentTree[key] = previousParentTree[key]; // Remember last previous things
            }
          }
        }
        let authoritiesForChannel = await getChannelAuthorities(
          channelAccount.pubkey,
          connection
        );
        setSelection({
          channel: channelAccount,
          selectionPath: parents,
          selectionTree: parentTree,
          authorities: authoritiesForChannel,
          authoritiesByType: groupAuthoritiesByType(authoritiesForChannel),
        });
        setLoading(false);
      },
    }),
    [config.type, selection, loading]
  );


  return (
    <ChannelsContext.Provider value={selectionMemo}>
      {children}
    </ChannelsContext.Provider>
  );
};
