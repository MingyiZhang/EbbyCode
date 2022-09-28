import React, {useContext} from 'react';
import { makeStyles } from 'tss-react/mui';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import {ProblemDisplay, ProblemsContext} from "../../providers/ProblemProvider";
import {ButtonGroup, IconButton} from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ProblemCardContent, {ProblemCardProps} from "./ProblemCardContent";

const useStyles = makeStyles()(() =>
  ({
    card: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }
  }));

const SelectedProblemCard = (props: ProblemCardProps) => {
  const { classes } = useStyles();
  const problem = props.problem;

  const {dispatch} = useContext(ProblemsContext);

  const handleUpdate = (p: ProblemDisplay, button: "remembered" | "fail-to-remember") => {
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
    }
    if (dispatch) {
      dispatch({
        type: "updateProblem",
        payload: p,
      });
      dispatch({
        type: "deleteSelectedProblem",
        payload: p.index,
      });
    }
  };

  return (
    <Card className={classes.card}>
      <ProblemCardContent problem={problem}/>
      <CardActions>
        <ButtonGroup>
          <IconButton
            aria-label={"remembered"}
            onClick={() => handleUpdate(problem, "remembered")}
            size="large">
            <CheckIcon style={{color: "green"}}/>
          </IconButton>
          <IconButton
            aria-label={"fail-to-remember"}
            onClick={() => handleUpdate(problem, "fail-to-remember")}
            size="large">
            <RadioButtonUncheckedIcon style={{color: "orange"}}/>
          </IconButton>
        </ButtonGroup>
      </CardActions>
    </Card>
  );
};

export default SelectedProblemCard;
