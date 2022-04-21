import { PublicKey } from '@solana/web3.js';
import { Routes, Route } from 'react-router';
import { Deposit } from '../pages/account/Deposit';
import { DAOExplore } from '../pages/dao/DAOExplore';
import { MyChannels } from '../pages/dao/MyDAOs';
import { NewChannel } from '../pages/channel/NewChannel';
import Home from '../pages/home/Home';
import Join from '../pages/join/Join';
import Landing from '../pages/landing/Landing';
import { NewUser } from '../pages/user/NewUser';
import { ProfileUser, USERNAME_PATH_PARAM } from '../pages/user/ProfileUser';
import { SettingsUser } from '../pages/user/SettingsUser';
import { Channel } from '../components/channel/Channel';
export const USER_NEW = 'user/new';
export const USER_SETTINGS = 'settings';
export const USER_PROFILE = 'user/:' + USERNAME_PATH_PARAM;
export const getUserProfilePath = (user: string) => 'user/' + user;
export const HOME = '';
export const EXPLORE = 'explore';
export const WAIT_LIST = 'wait'
export const DEPOSIT = 'deposit'
export const WITHDRAW = 'withdraw'
export const SETTINGS = 'settings'
export const ABOUT = 'about';
export const DAOS_MY = 'user/channels';
export const DAO = 'c';
export const DAO_NEW = 'dao/new';

export const getChannelRoute = (key: PublicKey) => {
    return '/' + DAO + '/' + key.toString()
}

export const getUserRoute = (key: PublicKey) => {
    return '/' + DAO + '/' + key.toString()
}

export const getNewChannelRoute = (parent: PublicKey | undefined) => {
    if (!parent) {
        return '/' + DAO_NEW
    }
    return '/' + DAO_NEW + '/' + parent.toString()
}


export function BaseRoutes() {
    return <Routes>
        <Route path={USER_NEW} element={<NewUser />} />
        <Route path={USER_SETTINGS} element={<SettingsUser />} />
        <Route path={USER_PROFILE} element={<ProfileUser />} />
        <Route path={SETTINGS} element={<SettingsUser />} />
        <Route path={DEPOSIT} element={<Deposit />} />
        <Route path={WAIT_LIST} element={<Join />} />
        <Route path={ABOUT} element={<Landing />} />
        <Route path={EXPLORE} element={<DAOExplore />} />
        <Route path={DAO + '/:key'} element={<Channel />} />
        <Route path={DAOS_MY} element={<MyChannels />} />
        <Route path={DAO_NEW + '/:key'} element={<NewChannel />} />

        <Route path={DAO_NEW} element={<NewChannel />} />
    </Routes>
}
/* 
export function ContentRoutes() {
    return <Routes>
        <Route path={EXPLORE} element={<DAOExplore />} />
        <Route path='' element={<Channel />} />
        <Route path={DAO_NEW + '/:key'} element={<NewChannel />} />
        <Route path={DAO_NEW} element={<NewChannel />} />
    </Routes>
} */

