import { PublicKey } from '@solana/web3.js';
import { Routes, Route } from 'react-router';
import { useUser } from '../contexts/UserContext';
import { Deposit } from '../pages/account/Deposit';
import { Channel } from '../pages/channel/Channel';
import { ChannelsExplore } from '../pages/channel/ChannelsExplore';
import { MyChannels } from '../pages/channel/MyChannels';
import { NewChannel } from '../pages/channel/NewChannel';
import Home from '../pages/home/Home';
import Join from '../pages/join/Join';
import Landing from '../pages/landing/Landing';
import { NewUser } from '../pages/user/NewUser';
import { ProfileUser, USERNAME_PATH_PARAM } from '../pages/user/ProfileUser';
import { SettingsUser } from '../pages/user/SettingsUser';
export const USER_NEW = 'user/new';
export const USER_SETTINGS = 'settings';
export const USER_PROFILE = 'user/:' + USERNAME_PATH_PARAM;
export const userProfilePath = (user: string) => 'user/' + user;
export const HOME = '';
export const CHANNELS = 'channel';
export const WAIT_LIST = 'wait'
export const DEPOSIT = 'deposit'
export const WITHDRAW = 'withdraw'
export const ABOUT = 'about';
export const CHANNELS_MY = 'user/channels';
export const CHANNEL_NEW = 'channel/new';
export const CHANNEL = 'c';
export const getChannelRoute = (key: PublicKey) => {
    return '/' + CHANNEL + '/' + key.toString()
}



export function ContentRoutes() {
    return <Routes
    >
        <Route path={USER_NEW} element={<NewUser />} />
        <Route path={USER_SETTINGS} element={<SettingsUser />} />
        <Route path={USER_PROFILE} element={<ProfileUser />} />
        <Route path={DEPOSIT} element={<Deposit />} />

        <Route path={WAIT_LIST} element={<Join />} />
        <Route path={ABOUT} element={<Landing />} />
        <Route path={HOME} element={<Home />} />
        <Route path={CHANNELS} element={<ChannelsExplore />} />

        <Route path={CHANNEL + '/:key'} element={<Channel />} />
        <Route path={CHANNELS_MY} element={<MyChannels />} />
        <Route path={CHANNEL_NEW} element={<NewChannel />} />
    </Routes>
}