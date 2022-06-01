import { Routes, Route } from "react-router";
import { Navigate } from 'react-router';
import { ProfileUser, USERNAME_PATH_PARAM } from "../pages/user/ProfileUser";
import { Channel } from "../components/channel/Channel";
import { Deposit } from "../pages/account/Deposit";
import { NewChannel } from "../pages/channel/NewChannel";
import { DAOExplore } from "../pages/dao/DAOExplore";
import { MyChannels } from "../pages/dao/MyDAOs";
import Join from "../pages/join/Join";
import Landing from "../pages/landing/Landing";
import { SmartWalletSetup } from "../pages/smartwallet/SmartWalletSetup";
import { NewUser } from "../pages/user/NewUser";
import { SettingsUser } from "../pages/user/SettingsUser";
import { Chat } from "../components/channel/post/Chat";
export const USER_NEW = "user/new";
export const USER_SETTINGS = "settings";
export const USER_PROFILE = "user/:" + USERNAME_PATH_PARAM;
export const getUserProfilePath = (user: string) => "user/" + user;
export const HOME = "";
export const EXPLORE = "explore";
export const WAIT_LIST = "wait";
export const DEPOSIT = "deposit";
export const WITHDRAW = "withdraw";
export const SETTINGS = "/settings";
export const SETTINGS_BURNER = "/settings/burner";
export const ABOUT = "about";
export const DAOS_MY = "user/channels";
export const DAO = "dao";
export const DAO_NEW = "dao/new";

export const getChannelRoute = (key: string) => {
  return "/" + DAO + "/" + key;
};

export const getUserRoute = (key: string) => {
  return "/" + DAO + "/" + key;
};

export const getNewChannelRoute = (parent: string | undefined) => {
  if (!parent) {
    return "/" + DAO_NEW;
  }
  return "/" + DAO_NEW + "/" + parent;
};

export function BaseRoutes() {
  return (
    <Routes>
      <Route path={USER_NEW} element={<NewUser />} />
      <Route path={USER_SETTINGS} element={<SettingsUser />} />
      <Route path={USER_PROFILE} element={<ProfileUser />} />
      <Route path={SETTINGS} element={<SettingsUser />} />
      <Route path={SETTINGS_BURNER} element={<SmartWalletSetup />} />
      <Route path={DEPOSIT} element={<Deposit />} />
      <Route path={WAIT_LIST} element={<Join />} />
      <Route path={ABOUT} element={<Landing />} />
      <Route path={EXPLORE} element={<DAOExplore />} />
      <Route path={DAOS_MY} element={<MyChannels />} />
      <Route path={DAO_NEW + "/:key"} element={<NewChannel />} />
      <Route path={DAO_NEW} element={<NewChannel />} />
      <Route path={"/:key"} element={<Chat />} />
      <Route path={"/"} element={<Chat />} />

      {/*  <Route path="*" element={
        <Navigate to="/dao/JD7a6iHv7S9VRHkyH9uS5W1HQ37xeM9LGHYZWoR23KB" />
      } /> */}
    </Routes>
  );
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
