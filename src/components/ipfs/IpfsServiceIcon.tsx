import { Avatar, Grid, GridProps, Typography } from "@mui/material";
import React, { FC, useMemo } from "react";
import { IpfsServiceMeta } from "../../contexts/IpfsServiceContext";

export const IpfsServiceIcon: FC<GridProps & { service: IpfsServiceMeta }> = ({ service, ...props }) => {
    return <Grid item {...props}>
        <Grid container direction='row' spacing={2} alignItems="center  ">
            <Grid item>
                <Avatar alt={service.name} src={service.icon} />
            </Grid>
            <Grid item>
                <Typography>{service.name}</Typography>
            </Grid>
        </Grid>
    </Grid>
}