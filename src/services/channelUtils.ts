import { Connection, PublicKey } from "@solana/web3.js";
import { AccountInfoDeserialized } from "@dao-xyz/sdk-common";
import { ChannelAccount } from "@dao-xyz/sdk-social";

export const getParentChannelParentChain = async (channel: AccountInfoDeserialized<ChannelAccount>, connection: Connection): Promise<AccountInfoDeserialized<ChannelAccount>[]> => {
    let ret = [];
    let current = channel;
    while (current.data.parent) {
        let current = getChannel(current.data.parent, connection)
    }
    getChannelsWithParent(channel.pubkey, connection).then((channels) => {
        setTree({
            [channel.pubkey.toString()]: channelsToTree(channels)
        });
    })
}