import { Connection, PublicKey } from "@solana/web3.js";
import { AccountInfoDeserialized } from "@dao-xyz/sdk-common";
import {
  ChannelAccount,
  getChannel,
  getChannelsWithParent,
} from "@dao-xyz/sdk-social";
import {
  ContentSourceExternal,
  ContentSourceString,
} from "@dao-xyz/sdk-common";
import { isValidHttpUrl } from "./urlUtils";
import { AccountCache } from "./accountCache";
export const getParentChannelChain = async (
  channel: AccountInfoDeserialized<ChannelAccount>,
  connection: Connection,
  accountCache?: AccountCache<ChannelAccount>
): Promise<AccountInfoDeserialized<ChannelAccount>[]> => {
  let ret = [];
  let current = channel;
  while (current?.data.parent) {
    if (accountCache && !!accountCache.get(current?.data.parent)) {
      current = accountCache.get(current.data.parent);
    } else {
      current = await getChannel(current.data.parent, connection);
    }
    ret.push(current);
  }
  return ret;
};
export type ChannelTree = {
  [key: string]: AccountInfoDeserialized<ChannelAccount>[];
};
export const CHANNEL_TREE_ROOT = "root";

export const getParentChannelChainTree = async (
  parents: AccountInfoDeserialized<ChannelAccount>[],
  connection: Connection
): Promise<ChannelTree> => {
  let ret: ChannelTree = {};
  for (const parent of parents) {
    let children = await getChannelsWithParent(parent?.pubkey, connection);
    ret[parent ? parent?.pubkey.toString() : CHANNEL_TREE_ROOT] = children;
  }
  return ret;
};

export const getChannelContentString = async (
  channel: ChannelAccount
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
