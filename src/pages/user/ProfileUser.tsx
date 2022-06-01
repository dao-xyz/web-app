import { Avatar, Box, CircularProgress, Container, FormControl, FormGroup, FormHelperText, Grid, IconButton, Input, InputLabel, Paper, Slide, Snackbar, Theme, Toolbar, Typography } from '@mui/material';

import { FC, useCallback, useEffect, useState, } from "react";
import { UserProfileSettings } from '../../components/user/UserProfileImageSetting';
import { Navigate, Params, useLocation, useParams } from 'react-router';
import EditIcon from '@mui/icons-material/Edit';
/* import { fetchNFTManifestImageUrl, fetchProfile, useUser } from '../../contexts/UserContext';
 */
import { useConnection } from '@solana/wallet-adapter-react';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';


export const USERNAME_PATH_PARAM = "user"


export const ProfileUser: FC = () => {
    /*  const params = useParams<{ user: string | undefined }>();
     const [canEdit, setCanEdit] = useState(false);
     // const { user } = useUser();
     const [thisUser, setThisUser] = useState<AccountInfoDeserialized<UserAccount> | undefined>(undefined);
     const [showEdit, setShowEdit] = useState<AccountInfoDeserialized<UserAccount> | undefined>(undefined);
 
     const { user } = useUser();
     const { connection } = useConnection();
     const { config } = useNetwork();
 
     const [profile, setProfile] = useState<Profile | undefined>(undefined);
     const [profieImageUrl, setProfileImageUrl] = useState<string | undefined>(undefined);
     const [value, setValue] = useState('1');
 
     const handleChange = (event: any, newValue: string) => {
         setValue(newValue);
     };
     useEffect(() => {
         setCanEdit(!!user && !!thisUser && user.pubkey.equals(thisUser.pubkey))
     }, [user, thisUser])
 
     useEffect(() => {
         if (profile?.image) {
             fetchNFTManifestImageUrl(profile.image).then((url) => {
                 setProfileImageUrl(url)
             })
 
         }
         if (params.user) {
 
             getUserByName(params.user, connection).then((user) => {
                 setThisUser(user);
 
                 if (user?.data?.profile) {
                     fetchProfile(user.data.profile).then((profile) => {
                         setProfile(profile);
                     })
                 }
                 else {
                     setProfile(undefined)
 
                 }
             })
         }
         else {
             setThisUser(undefined);
 
         }
 
     }, [params.user])
     const userContent = useCallback(() => {
         return <Grid item container direction="column">
             <Grid item container spacing={4} columns={2} justifyContent='center' direction="row" sx={{ mt: 5 }} >
                 <Grid item>
                     <Avatar
                         alt="broken"
                         src={profieImageUrl}
                         sx={{ width: 100, height: 100 }}
                     />
                 </Grid>
                 <Grid item container direction="row" width="initial" justifyContent="center">
 
                     <Grid item>
                         <Typography variant="h4" component="h4" gutterBottom>{params.user}</Typography>
                         {profile ? <>
                             {profile.name ? <Typography variant="h5" component="h5">{profile.name}</Typography> : <Typography fontStyle="italic">No name exist</Typography>}
                             {profile.description ? <Typography>{profile.description}</Typography> : <Typography fontStyle="italic">No description exist</Typography>}
                         </> : canEdit ? <Typography fontStyle='italic'>No user info</Typography> : <></>}
                     </Grid>
                     {canEdit ? <Grid item>
                         <IconButton  > <EditIcon /></IconButton>
                     </Grid> : <></>}
                 </Grid>
 
             </Grid>
             <Grid item sx={{ mt: 2 }}>
                 <TabContext value={value}>
                     <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                         <TabList onChange={handleChange} aria-label="tabs">
                             <Tab label="Posts" value="1" />
                             <Tab label="Stakes" value="2" />
                         </TabList>
                     </Box>
                     <TabPanel value="1">Posts</TabPanel>
                     <TabPanel value="2">Stakes</TabPanel>
                 </TabContext>
             </Grid>
         </Grid>
 
     }, [params, profile, value])
 
     return <Container maxWidth="sm" component="main" sx={{ pt: 5, pb: 10 }}>
         <Grid container spacing={4} columns={2} direction="row" wrap="nowrap">
             {!thisUser ? <Grid item sx={{ display: 'flex', justifyContent: 'center', width: "100%" }}><Typography fontStyle='italic' variant="h4" component="h4">User named "{params.user}" does not exist</Typography></Grid> :
                 userContent()}
         </Grid>
     </Container > */
    return <></>
}