import { PublicKey } from '@solana/web3.js';
import { Routes, Route } from 'react-router';
import { ConditionalRedirect } from '../components/navigation/ConditionalRedirect';
import { useUser } from '../contexts/UserContext';
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
export const WAIT_LIST = 'wait'
export const START = HOME;

export function ContentRoutes() {
    const { user } = useUser();
    return <Routes
    >

        <Route path={USER_NEW} element={<NewUser />} />
        <Route path={USER_SETTINGS} element={<SettingsUser />} />
        <Route path={USER_PROFILE} element={<ProfileUser />} />
        <Route path={WAIT_LIST} element={<Join />} />
        <Route path={HOME} element={<Landing />} />

    </Routes>
}