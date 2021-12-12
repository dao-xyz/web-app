import { PublicKey } from '@solana/web3.js';
import * as React from 'react';
import { Routes, Route } from 'react-router';
import Channel from '../pages/channels/Channel/Channel';
import { MyChannels } from '../pages/channels/MyChannels/MyChannels';
import { NewChannel } from '../pages/channels/NewChannnel/NewChannel';
import Home from '../pages/Home/Home';
import Landing from '../pages/landing/Landing';
import { ChangeUser } from '../pages/user/ChangeUser/ChangeUser';
import { NewUser } from '../pages/user/NewUser/NewUser';
export const START = 'start';
export const USER_NEW = 'user/new';
export const USER_CHANGE = 'user/change';
export const CHANNELS_MY = 'user/channels';
export const CHANNEL_NEW = 'channel/new';
export const CHANNEL = 'c';
export const HOME = '';
export const getChannelRoute = (key: PublicKey) => {
    return CHANNEL + '/' + key.toString()
}
export function ContentRoutes() {
    return <Routes
    >
        <Route path={START} element={<Landing />} />
        <Route path={USER_NEW} element={<NewUser />} />
        <Route path={USER_CHANGE} element={<ChangeUser />} />
        <Route path={CHANNELS_MY} element={<MyChannels />} />
        <Route path={CHANNEL_NEW} element={<NewChannel />} />
        <Route path={CHANNEL + '/:key'} element={<Channel />} />
        <Route path={HOME} element={<Home />} />
    </Routes>
}