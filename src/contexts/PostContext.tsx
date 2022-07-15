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
  loadingRoot: boolean,
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
  const [loadingRoot, setLoadingRoot] = useState(false);

  if (peer) {
    peer?.node.pubsub.ls().then((ls) => console.log(ls));
  }
  useEffect(() => {
    if (peer?.node) {
      setLoadingRoot(true);
      console.log('load post from root cid', config.rootPostShard)
      Shard.loadFromCID<PostInterface>(config.rootPostShard, peer.node).then(async (shard) => {
        console.log('got shard from root cid', shard)
        await shard.init(peer);
        await shard.interface.comments.load();
        console.log("found root shard", shard.interface.comments.db.address)
        setRoot(shard)

        while (true) {

          // console.log(Object.keys(shard.interface.comments.db.db.index._index), Object.keys(shard.interface.comments.db.db.all).length);
          await new Promise(r => setTimeout(r, 2000));

        }

      }).finally(() => {
        setLoadingRoot(false);
      })
    }
  },
    [config?.rootPostShard, !!peer?.node])
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
          console.log('load post from cid', postCID)
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

        let authoritiesForPost = Object.values(post.interface.acl.db.index);
        setSelection({
          channel: post,
          selectionPath: parents,
          selectionTree: parentTree,
          authorities: authoritiesForPost,
          authoritiesByType: groupAuthoritiesByType(authoritiesForPost),
        });
        setLoading(false);
      },
      loadingRoot
    }),
    [selection, loading, root?.cid, !!peer?.node, loadingRoot]
  );




  return (
    <Postscontext.Provider value={selectionMemo}>
      {children}
    </Postscontext.Provider>
  );
};
