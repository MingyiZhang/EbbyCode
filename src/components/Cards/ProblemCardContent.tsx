import React from 'react';
import {CardContent, Grid, LinearProgress, Typography} from "@mui/material";
import { makeStyles } from 'tss-react/mui';
import {difficulty, platform, ProblemDisplay} from "../../providers/ProblemProvider";

const useStyles = makeStyles()(() =>
  ({
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },

    title: {
      fontSize: 14,
    },

    pos: {
      marginBottom: 12,
    },

    content: {
      textAlign: "left",
    }
  }));

export interface ProblemCardProps {
  problem: ProblemDisplay;
}

const ProblemCardContent = (props: ProblemCardProps) => {
  const { classes } = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  const problem = props.problem;

  return (
    <CardContent className={classes.content}>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            {platform[problem.platform]} {bull} {problem.serial} {bull} {difficulty[problem.difficulty]}
          </Typography>
        </Grid>
        <Grid item xs={12} style={{height: 100}}>
          <Typography variant="h6" component="h3">
            {problem.title}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.pos} color="textSecondary">
            Practiced: {problem.practice}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.pos} color="textSecondary">
            Remembered: {problem.remember}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <LinearProgress variant="determinate" value={(1 - problem.weight) * 100} style={{height: 10}}/>
        </Grid>
      </Grid>
    </CardContent>
  )
};

export default ProblemCardContent;