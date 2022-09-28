import React, {ChangeEvent, useContext, useState} from "react";
import { makeStyles } from 'tss-react/mui';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import {DialogStateContext} from "../../providers/DialogStateProvider";
import {ProblemDisplay, ProblemsContext} from "../../providers/ProblemProvider";
import {selectProblems} from "../../utils/ebbinghaus";

import GetAppIcon from '@mui/icons-material/GetApp';
import PublishIcon from '@mui/icons-material/Publish';
import {downloadToJson} from "../../utils/localStorage";
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';

const useStyles = makeStyles()((theme) =>
  ({
    speedDial: {
      position: 'fixed',
      '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
        bottom: theme.spacing(5),
        right: theme.spacing(5),
      },
      '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
        top: theme.spacing(5),
        left: theme.spacing(5),
      },
    }
  }));

const QuickAccessButton = () => {
  const { classes } = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const {dispatch} = useContext(DialogStateContext);
  const {problems, dispatch: dispatchProblem} = useContext(ProblemsContext);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleAddProblemDialog = () => {
    if (dispatch) {
      dispatch({
        type: "toggleAddProblem",
        payload: true,
      });
    }
  };

  const handleRefreshSelectedProblems = () => {
    if (dispatchProblem) {
      dispatchProblem({
        type: "updateWeightsNormCumulated",
      });
    }
    const selected = selectProblems(problems, 3);
    if (dispatchProblem) {
      dispatchProblem({
        type: "addSelectedProblems",
        payload: selected
      });
    }
  };

  const handleSortProblemsDialog = () => {
    if (dispatch) {
      dispatch({
        type: "toggleSortProblems",
        payload: true,
      });
    }
  };

  const handleUploadFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const uploadProblems = JSON.parse(reader.result as string) as ProblemDisplay[];
        if (problems.length === 0) {
          if (dispatchProblem) {
            dispatchProblem({
              type: "addProblems",
              payload: uploadProblems
            })
          }
        } else {
          for (let p of uploadProblems) {
            if (!problems.find(e => e.index === p.index)) {
              if (dispatchProblem) {
                dispatchProblem({
                  type: "addProblem",
                  payload: p
                });
              }
            }
          }
        }
      };
      reader.readAsText(event.target.files[0]);
    }
  }

  return (
    <div>
      <SpeedDial
        ariaLabel="Quick Access"
        className={classes.speedDial}
        icon={<SpeedDialIcon/>}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        <SpeedDialAction
          title='Add Problem'
          icon={<NoteAddIcon/>}
          tooltipTitle='Add Problem'
          onClick={() => {
            handleClose();
            handleAddProblemDialog();
          }}
        />
        <SpeedDialAction
          title='Refresh Selected Problems'
          icon={<AutorenewIcon/>}
          tooltipTitle='Refresh Selected Problems'
          onClick={() => {
            handleClose();
            handleRefreshSelectedProblems();
          }}
        />
        <SpeedDialAction
          title={'Sort Problems'}
          icon={<SortByAlphaIcon/>}
          tooltipTitle={'Sort Problems'}
          onClick={() => {
            handleClose();
            handleSortProblemsDialog();
          }}
        />
        <SpeedDialAction
          title={'Download Problems'}
          icon={<GetAppIcon/>}
          tooltipTitle={'Download Problems'}
          onClick={() => downloadToJson(problems)}
        />
        <SpeedDialAction
          title={'Upload Problems'}
          icon={
            <div>
              <input type={'file'} id={'contained-button-file'} style={{display: 'none'}} onChange={handleUploadFile}/>
              <label htmlFor={'contained-button-file'}>
                <PublishIcon/>
              </label>
            </div>}
          tooltipTitle={'Upload Problems'}
          onClick={handleClose}
        />
      </SpeedDial>
    </div>
  )
}

export default QuickAccessButton;