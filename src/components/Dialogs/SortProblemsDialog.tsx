import React, {ChangeEvent, useContext, useState} from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup, Switch
} from "@mui/material";
import {DialogStateContext} from "../../providers/DialogStateProvider";
import {ProblemsContext, sortEntries, sortEntryLabels, sortEntry} from "../../providers/ProblemProvider";

const SortProblemsDialog = () => {
  const {sortProblemsDialogOpen, dispatch} = useContext(DialogStateContext);
  const {dispatch: problemDispatch} = useContext(ProblemsContext);

  const [entry, setEntry] = useState<sortEntry>("serial");
  const [isReverse, setIsReverse] = useState<boolean>(false);

  const handleClose = () => {
    if (dispatch) {
      dispatch({
        type: "toggleSortProblems",
        payload: false,
      });
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEntry(((event.target as HTMLInputElement).value) as sortEntry);
  };

  const handleSort = () => {
    if (problemDispatch) {
      problemDispatch({
        type: "sortProblems",
        payload: {
          sortEntry: entry,
          isReverse: isReverse,
        },
      });
    }
  };

  const handleIsReverse = (event: ChangeEvent<HTMLInputElement>) => {
    setIsReverse(event.target.checked);
  };

  return (
    <Dialog
      open={sortProblemsDialogOpen}
      onClose={handleClose}
    >
      <DialogTitle>Sort Problems By...</DialogTitle>
      <DialogContent>
        <FormControl component="fieldset">
          <RadioGroup
            value={entry}
            onChange={handleChange}
          >
            {sortEntries.map((value => (
              <FormControlLabel
                key={value}
                value={value}
                control={<Radio/>}
                label={sortEntryLabels[value]}
              />
            )))}
            <FormControlLabel
              control={
                <Switch
                  checked={isReverse}
                  onChange={handleIsReverse}
                  color="primary"
                />
              }
              label="Reverse"
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            handleClose();
            handleSort();
          }}
          color="primary"
          autoFocus
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )

};

export default SortProblemsDialog;