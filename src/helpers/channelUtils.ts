import { ChannelAccount } from "@dao-xyz/sdk-social"

export const isDao = (channel: ChannelAccount): boolean => {
    return !channel.parent
}