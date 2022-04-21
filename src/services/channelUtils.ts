import { Connection, PublicKey } from "@solana/web3.js";
import { AccountInfoDeserialized } from "@dao-xyz/sdk-common";
import { ChannelAccount, getChannel, getChannelsWithParent } from "@dao-xyz/sdk-social";

export const getParentChannelChain = async (channel: AccountInfoDeserialized<ChannelAccount>, connection: Connection): Promise<AccountInfoDeserialized<ChannelAccount>[]> => {
    let ret = [];
    let current = channel;
    while (current.data.parent) {
        current = await getChannel(current.data.parent, connection);
        ret.push(current)
    }
    return ret;
}
export type ChannelTree = { [key: string]: AccountInfoDeserialized<ChannelAccount>[] };
export const CHANNEL_TREE_ROOT = 'root';

export const getParentChannelChainTree = async (parents: AccountInfoDeserialized<ChannelAccount>[], connection: Connection): Promise<ChannelTree> => {
    let ret: ChannelTree = {};
    for (const parent of parents) {
        let children = await getChannelsWithParent(parent?.pubkey, connection);
        ret[parent ? parent?.pubkey.toString() : CHANNEL_TREE_ROOT] = children;
    }
    return ret;
}