import * as React from 'react';
import { Routes, Route } from 'react-router';
import { MyChannels } from '../pages/channels/MyChannels/MyChannels';
import { NewChannel } from '../pages/channels/NewChannnel/NewChannel';
import Home from '../pages/Home/Home';
import Landing from '../pages/landing/Landing';
import { ChangeUser } from '../pages/user/ChangeUser/ChangeUser';
import { NewUser } from '../pages/user/NewUser/NewUser';
export const START = 'start';
export const USER_NEW = 'user/new';
export const USER_CHANGE = 'user/change';
export const CHANNELS_MY = 'channels/my';
export const CHANNELS_NEW = 'channels/new';
export const HOME = '/';

export function ContentRoutes() {
    return <Routes
    >
        <Route path={START} element={<Landing />} />
        <Route path={USER_NEW} element={<NewUser />} />
        <Route path={USER_CHANGE} element={<ChangeUser />} />
        <Route path={CHANNELS_MY} element={<MyChannels />} />
        <Route path={CHANNELS_NEW} element={<NewChannel />} />
        <Route path={HOME} element={<Home />} />
    </Routes>
}