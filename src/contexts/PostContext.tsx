import React, { createContext, useContext, useEffect, useState } from "react";
import { PostInterface, Access, AccessType } from '@dao-xyz/social-interface';
import { Shard } from '@dao-xyz/shard';
import { usePeer } from "./PeerContext";
import { getParentPostChain, getParentPostChainTree, PostTree } from "../utils/postUtils";
import { useConfig } from "./ConfigContext";

interface PostSelection {
  selectionPath: Shard<PostInterface>[];
  selectionTree: PostTree;
  channel: Shard<PostInterface>;
  authorities: Access[];
  authoritiesByType: Map<
    AccessType,
    Access[]
  >;
}
interface IPostContext {
  loading: boolean;
  selection: PostSelection;
  select: (postCID: string) => Promise<void>;
  dao: Shard<PostInterface>
  root: Shard<PostInterface>
}

const groupAuthoritiesByType = (
  authorities: Access[]
): Map<AccessType, Access[]> => {
  let ret = new Map();
  for (const authority of authorities) {
    for (const type of authority.accessTypes) {
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
export const Postscontext = React.createContext<IPostContext>({} as any);
export const usePosts = () => useContext(Postscontext);
/* const mockChannelSelection = (): ChannelSelection => {

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
} */
export const PostsProvider = ({ children }: { children: JSX.Element }) => {


  // const [accountCache, setAccountCache] = useState(new AccountCache<Shard<PostInterface>>(50));
  const [selection, setSelection] = React.useState<PostSelection>(/* isMock ? mockChannelSelection() :  */{
    selectionPath: undefined,
    selectionTree: undefined,
    authorities: undefined,
    authoritiesByType: undefined,
    channel: undefined,
  });
  const { config } = useConfig();
  const { peer } = usePeer();
  const [loading, setLoading] = useState(false);
  const [root, setRoot] = useState<Shard<PostInterface>>();

  useEffect(() => {
    if (peer?.node)
      Shard.loadFromCID<PostInterface>(config.postShardCID, peer.node).then((shard) => {
        setRoot(shard)
      })
  },
    [config?.postShardCID, !!peer?.node])
  const selectionMemo = React.useMemo(
    () => ({
      selection,
      loading,
      root,
      dao: selection.selectionPath?.length > 0 ? selection.selectionPath[selection.selectionPath.length - 1] : undefined,
      select: async (postCID: string) => {
        if (!peer?.node) {
          return undefined;
        }
        setLoading(true);
        let previousSelection = selection;
        setSelection({
          selectionPath: undefined,
          selectionTree: undefined,
          authorities: undefined,
          authoritiesByType: undefined,
          channel: undefined,
        });
        let post: Shard<PostInterface> = undefined;

        if (!post) {
          post = await Shard.loadFromCID<PostInterface>(postCID, peer.node);
        }

        let parents: Shard<PostInterface>[] = [
          post,
          ...(await getParentPostChain(
            post,
            peer /* accountCache */
          )),
        ];
        let parentTree = await getParentPostChainTree(parents);
        let previousParentTree = previousSelection.selectionTree;

        // If same DAO, then keep memory
        if (
          selection.selectionPath &&
          parents[parents.length - 1].cid == (
            selection.selectionPath[selection.selectionPath.length - 1].cid
          )
        ) {
          for (const key in previousParentTree) {
            if (!parentTree[key]) {
              parentTree[key] = previousParentTree[key]; // Remember last previous things
            }
          }
        }

        let authoritiesForPost = post.interface.acl.db.all;
        setSelection({
          channel: post,
          selectionPath: parents,
          selectionTree: parentTree,
          authorities: authoritiesForPost,
          authoritiesByType: groupAuthoritiesByType(authoritiesForPost),
        });
        setLoading(false);
      },
    }),
    [selection, loading, root?.cid, !!peer?.node]
  );


  return (
    <Postscontext.Provider value={selectionMemo}>
      {children}
    </Postscontext.Provider>
  );
};
