import * as React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Avatar, Button, CardActionArea, CardActions, Container, Divider, Grid, Link, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import logo from "./../../logo.png";
import "./Landing.css"
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PaidIcon from '@mui/icons-material/Paid';
import { Link as RouterLink } from "react-router-dom";
import { NetworkContext } from "../../contexts/Network";
import { HOME } from "../../routes/routes";

// Landing page for choosing network
export default function Landing() {
  const icon = PublicIcon;
  const config = React.useContext(NetworkContext);
  return (
    <>
      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item  >
            <Typography
              component="h1"
              variant="h2"
              align="center"
              gutterBottom
              fontWeight={600}
            >
              Stake together
            </Typography>
          </Grid>
          <Grid item>
            <img src={logo} className="Landing-logo" alt="logo" />
          </Grid>
        </Grid>
        <Typography variant="h5" align="center" color="text.secondary" component="p">
          A social network built on <Link href="https://solana.com/">Solana</Link > where <span style={{ color: '#fbb03b' }}>likes</span> are <span style={{ color: '#fbb03b' }}>stakes</span>.
          Make profits by liking quality content early.
          Lose by doing the opposite.
        </Typography>
      </Container>
      { }
      <Container maxWidth="md" component="main">
        <Grid container spacing={2} justifyContent="center"  >
          <Grid item
            xs={12}
            md={4}  >
            <Card sx={{ minWidth: 275 }}>
              <CardContent >
                <Grid container spacing={1}
                >
                  <Grid item>
                    <SportsEsportsIcon fontSize='large' />
                  </Grid>
                  <Grid item>
                    <Typography variant="h5" gutterBottom>
                      A social game
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color="text.secondary" >
                      Coming soon
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body1">
                      If you like some content, you convert SOL into a "Like" token with an exchange rate that favors early stakes. The exchange rate "penalty" is controlled by content creators.
                    </Typography>
                  </Grid>
                </Grid>

              </CardContent>
            </Card>
          </Grid>
          <Grid item
            xs={12}
            md={4}  >
            <Card sx={{ minWidth: 275 }}>
              <CardContent >
                <Grid container spacing={1}          >
                  <Grid item>
                    <PublicIcon fontSize='large' />
                  </Grid>
                  <Grid item >
                    <Typography variant="h5" gutterBottom>
                      Decentralized
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body1">
                      Content is stored in accounts on-chain which lets you access it from anywhere, anytime.
                    </Typography>
                  </Grid>
                </Grid>

              </CardContent>
            </Card>
          </Grid>
          <Grid item
            xs={12}
            md={4}  >
            <Card sx={{ minWidth: 275 }}>
              <CardContent >
                <Grid container flexDirection="column" spacing={1}>

                  <Grid item >
                    <Grid container spacing={1}>
                      <Grid item>
                        <PaidIcon fontSize='large' />

                      </Grid>
                      <Grid item>
                        <Typography variant="h5" gutterBottom>
                          Rewards
                        </Typography>
                      </Grid>
                    </Grid>

                  </Grid>

                  <Grid item>

                  </Grid>
                  <Grid item>
                    <Typography variant="body1">
                      Stakes yield rewards by delegating funds to Solana validators.
                    </Typography>
                  </Grid>
                </Grid>

              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      { }

      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item  >
            <Typography
              variant="h4"
              align="center"
              gutterBottom
            >
              Not launched yet but...
            </Typography>
          </Grid>

        </Grid>
        <Typography variant="h5" align="center" color="text.primary" component="p">
          Right now you can stake you SOL with our stake pool to earn rewards. In turn you will recieve S2G tokens which you will in the future can use to interact with content on the platform.
        </Typography>
      </Container>
      { }
      {/* <Container maxWidth="lg" component="main">
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


                </Grid>

              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Container> */}
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
