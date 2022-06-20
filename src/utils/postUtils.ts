
import { PostInterface, TextContent } from "@dao-xyz/social-interface";
import { Shard, AnyPeer } from '@dao-xyz/shard';
import { AccountCache } from "./accountCache";
export const getParentPostChain = async (
  channel: Shard<PostInterface>,
  node: AnyPeer,
  accountCache?: AccountCache<Shard<PostInterface>>,
): Promise<Shard<PostInterface>[]> => {
  let ret = [];
  let current = channel;
  while (current?.parentShardCID) {
    if (accountCache && !!accountCache.get(current?.parentShardCID)) {
      current = accountCache.get(current.parentShardCID);
    } else {
      current = await Shard.loadFromCID(current.parentShardCID, node.node)
    }
    ret.push(current);
  }
  return ret;
};
export type PostTree = {
  [key: string]: Shard<PostInterface>[];
};
export const CHANNEL_TREE_ROOT = "root";

export const getParentPostChainTree = async (
  parents: Shard<PostInterface>[]
): Promise<PostTree> => {
  let ret: PostTree = {};
  for (const parent of parents) {
    /*     if(!parent.interface.comments.db.db)
         await parent.interface.comments.db.db.load(1); */
    let children = Object.values(parent.interface.comments.db.db.all);
    ret[parent ? parent?.cid.toString() : CHANNEL_TREE_ROOT] = children;
  }
  return ret;
};
/* 
export const getChannelContentString = async (
  channel: Shard<PostInterface>
): Promise<string | undefined> => {
  if (channel.info) {
    return Promise.resolve(undefined);
  }
  if (channel.info instanceof ContentSourceString) {
    return Promise.resolve(channel.info.string);
  }
  let url = (channel.info as ContentSourceExternal).url;
  if (url && isValidHttpUrl(url)) {
    const result = await fetch(url, {}).catch(() => undefined);
    if (result) {
      if (result.status >= 200 && result.status < 300) {
        let text = await result.text().catch(() => undefined);
        return text;
      }
    }
    return undefined;
  }
};
 */





export const isDao = (post: Shard<PostInterface>): boolean => {
  return !post.parentShardCID;
};

