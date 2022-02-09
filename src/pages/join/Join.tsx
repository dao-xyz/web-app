import * as React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Avatar, Button, CardActionArea, CardActions, Container, Divider, Grid, Link, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';

import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PaidIcon from '@mui/icons-material/Paid';
import { Link as RouterLink } from "react-router-dom";
import { NetworkContext } from "../../contexts/Network";
import { HOME } from "../../routes/routes";

// Landing page for choosing network
export default function Join() {
    const icon = PublicIcon;
    const config = React.useContext(NetworkContext);
    return (
        <>
            <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item  >
                        <Typography
                            variant="h3"
                            align="center"
                            gutterBottom
                        >
                            We have not launched yet...
                        </Typography>
                    </Grid>

                </Grid>
                <Typography variant="h5" align="center" color="text.primary" component="p">
                    However, right now you can stake you SOL with our stake pool to earn rewards. In turn you will recieve tokens which you will in the future can use to interact with content on the platform.
                </Typography>
            </Container>
            { }
            <Container maxWidth="lg" component="main">
                <Grid container spacing={2} justifyContent="center"  >
                    <Grid item
                        xs={12}
                        md={4}  >
                        <Card sx={{ minWidth: 275 }}>
                            <CardContent >
                                <Grid container spacing={1}
                                >
                                    <Grid item>
                                        <MilitaryTechIcon fontSize='large' />
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h5" gutterBottom>
                                            Top staked waiters currently
                                        </Typography>
                                    </Grid>

                                    <Grid item>
                                        <Typography variant="body1">
                                            <List sx={{ width: '100%' }}>
                                                <ListItem alignItems="flex-start">
                                                    <ListItemAvatar>
                                                        <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary="Brunch this weekend?"
                                                        secondary={
                                                            <React.Fragment>
                                                                <Typography
                                                                    sx={{ display: 'inline' }}
                                                                    component="span"
                                                                    variant="body2"
                                                                    color="text.primary"
                                                                >
                                                                    Ali Connors
                                                                </Typography>
                                                                {" — I'll be in your neighborhood doing errands this…"}
                                                            </React.Fragment>
                                                        }
                                                    />
                                                </ListItem>
                                                <Divider variant="inset" component="li" />
                                                <ListItem alignItems="flex-start">
                                                    <ListItemAvatar>
                                                        <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary="Summer BBQ"
                                                        secondary={
                                                            <React.Fragment>
                                                                <Typography
                                                                    sx={{ display: 'inline' }}
                                                                    component="span"
                                                                    variant="body2"
                                                                    color="text.primary"
                                                                >
                                                                    to Scott, Alex, Jennifer
                                                                </Typography>
                                                                {" — Wish I could come, but I'm out of town this…"}
                                                            </React.Fragment>
                                                        }
                                                    />
                                                </ListItem>
                                                <Divider variant="inset" component="li" />
                                                <ListItem alignItems="flex-start">
                                                    <ListItemAvatar>
                                                        <Avatar alt="Cindy Baker" src="https://mui.com/static/images/avatar/1.jpg" />
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary="Oui Oui"
                                                        secondary={
                                                            <React.Fragment>
                                                                <Typography
                                                                    sx={{ display: 'inline' }}
                                                                    component="span"
                                                                    variant="body2"
                                                                    color="text.primary"
                                                                >
                                                                    Sandra Adams
                                                                </Typography>
                                                                {' — Do you have Paris recommendations? Have you ever…'}
                                                            </React.Fragment>
                                                        }
                                                    />
                                                </ListItem>
                                            </List>
                                        </Typography>
                                    </Grid>
                                </Grid>

                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>
            </Container>
            { }
            <Container sx={{ mt: 10, mb: 10 }}>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item  >
                        <Button size="large" variant="contained" component={RouterLink} to={HOME} >
                            Join the staked waitlist
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}
