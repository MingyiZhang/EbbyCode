import React, {useContext} from 'react';
import { makeStyles } from 'tss-react/mui';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import {ProblemDisplay, ProblemsContext} from "../../providers/ProblemProvider";
import {ButtonGroup, IconButton, Tooltip} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import ProblemCardContent, {ProblemCardProps} from "./ProblemCardContent";

const useStyles = makeStyles()(() =>
  ({
    card: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }
  }));

const ProblemCard = (props: ProblemCardProps) => {
  const { classes } = useStyles();
  const problem = props.problem;

  const {dispatch} = useContext(ProblemsContext);

  const handleDelete = (index: string) => {
    if (dispatch) {
      dispatch({
        type: "deleteProblem",
        payload: index,
      });
      dispatch({
        type: "deleteSelectedProblem",
        payload: index,
      })
    }
  };

  const handleUpdate = (p: ProblemDisplay, button: "remembered" | "fail-to-remember" | "reset") => {
    p.updateTime = new Date().getTime();
    p.weight = 0;
    switch (button) {
      case "remembered":
        p.practice++;
        p.remember++;
        break;
      case "fail-to-remember":
        p.practice++;
        break;
      case "reset":
        p.practice = 1;
        p.remember = 1;
        break;
    }
    if (dispatch) {
      dispatch({
        type: "updateProblem",
        payload: p,
      });
    }
  };

  return (
    <Card className={classes.card}>
      <ProblemCardContent problem={problem}/>
      <CardActions>
        <ButtonGroup>
          <IconButton
            aria-label={"delete"}
            onClick={() => handleDelete(problem.index)}
            size="large">
            <Tooltip title={"delete"}>
              <CloseIcon color={"secondary"}/>
            </Tooltip>
          </IconButton>
          <IconButton
            aria-label={"remembered"}
            onClick={() => handleUpdate(problem, "remembered")}
            size="large">
            <Tooltip title={"remembered"}>
              <CheckIcon style={{color: "green"}}/>
            </Tooltip>
          </IconButton>
          <IconButton
            aria-label={"fail-to-remember"}
            onClick={() => handleUpdate(problem, "fail-to-remember")}
            size="large">
            <Tooltip title={"forget"}>
              <RadioButtonUncheckedIcon style={{color: "orange"}}/>
            </Tooltip>
          </IconButton>
          <IconButton
            aria-label={"reset"}
            onClick={() => handleUpdate(problem, "reset")}
            size="large">
            <Tooltip title={"reset"}>
              <RotateLeftIcon style={{color: "blue"}}/>
            </Tooltip>
          </IconButton>
        </ButtonGroup>
      </CardActions>
    </Card>
  );
};

export default ProblemCard;
