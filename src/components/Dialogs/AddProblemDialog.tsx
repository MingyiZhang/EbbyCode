import React, {ChangeEvent, Dispatch, SetStateAction, useContext, useState} from 'react';
import {DialogStateContext} from "../../providers/DialogStateProvider";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
  useMediaQuery,
  useTheme
} from "@mui/material";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker"
import {ProblemDisplay, ProblemsContext} from "../../providers/ProblemProvider";
import {getWeight} from "../../utils/ebbinghaus";
import {ChoicesContext, LeetCodeChoice} from "../../providers/ChoiceProvider";
import {Autocomplete} from '@mui/material';

const AddProblemDialog = () => {
  const {addProblemDialogOpen, dispatch} = useContext(DialogStateContext);
  const {dispatch: problemDispatch} = useContext(ProblemsContext);
  const {leetCodeChoices} = useContext(ChoicesContext);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [platform, setPlatform] = useState<number>(0);
  const [serial, setSerial] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [difficulty, setDifficulty] = useState<number>(0);
  const [time, setTime] = useState<Date | null>(null);
  const [choice, setChoice] = useState<LeetCodeChoice | null>(null);

  const handleClose = () => {
    if (dispatch) {
      dispatch({
        type: "toggleAddProblem",
        payload: false,
      });
    }
    setPlatform(0);
    setSerial("");
    setTitle("");
    setDifficulty(0);
    setTime(null);
    setChoice(null)
  };

  const handleChange = <T extends any>(setter: Dispatch<SetStateAction<T>>) => {
    return (event: ChangeEvent<{ value: unknown }>) => {
      setter(event.target.value as T);
    };
  };

  const handleOnChange = (choice: LeetCodeChoice) => {
    setSerial(choice.id.toString());
    setTitle(choice.title);
    setDifficulty(choice.difficulty);
  }

  const handleAdd = () => {
    const currentTime = new Date().getTime();
    const createTime = time === null ? currentTime : time.getTime();

    const problem: ProblemDisplay = {
      platform: platform,
      serial: serial,
      title: title,
      index: (serial + title).replace(" ", "").toLowerCase(),
      practice: 1,
      remember: 1,
      difficulty: difficulty,
      createTime: createTime,
      updateTime: createTime,
      weight: getWeight(currentTime, createTime, 1, 1),
      normCumulatedWeight: 0
    };
    if (problemDispatch) {
      problemDispatch({
        type: "addProblem",
        payload: problem
      });
    }
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={addProblemDialogOpen}
      onClose={handleClose}
      aria-labelledby="add-problem-dialog"
    >
      <DialogTitle id="add-problem-dialog-title">{"Add New Problem"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} justifyContent={"center"} alignItems={"center"} sx={{pt: 2}}>
          <Grid item xs={12} sm={6}>
            <TextField
              id={"platform"}
              fullWidth
              required
              variant={"outlined"}
              label={"Platform"}
              value={platform}
              onChange={handleChange(setPlatform)}
              select
            >
              <MenuItem value={0}>LeetCode</MenuItem>
              <MenuItem value={1}>Codility</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              id="serial"
              options={[...leetCodeChoices].sort((a, b) => a.id - b.id)}
              getOptionLabel={option => option.id.toString()}
              value={choice}
              onChange={(event, newValue) => {
                if (newValue !== null) {
                  setChoice(newValue)
                  handleOnChange(newValue);
                }
              }}
              inputValue={serial}
              onInputChange={(event, newInputValue) => {
                setSerial(newInputValue)
              }}
              fullWidth
              renderInput={params =>
                <TextField
                  {...params}
                  required
                  variant={"outlined"}
                  label={platform === 0 ? "Serial Number" : "Lesson Number"}
                />}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              id="title"
              options={[...leetCodeChoices].sort((a, b) => a.title.localeCompare(b.title))}
              getOptionLabel={option => option.title}
              value={choice}
              onChange={(event, newValue) => {
                if (newValue !== null) {
                  setChoice(newValue)
                  handleOnChange(newValue);
                }
              }}
              inputValue={title}
              onInputChange={(event, newInputValue) => {
                setTitle(newInputValue)
              }}
              fullWidth
              renderInput={params =>
                <TextField
                  {...params}
                  required
                  variant="outlined"
                  label="Problem Title"
                />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            {
              platform === 0 &&
                <TextField
                    disabled={leetCodeChoices.length !== 0}
                    id={"difficulty"}
                    fullWidth
                    required
                    variant={"outlined"}
                    label={"Difficulty"}
                    value={difficulty}
                    onChange={handleChange(setDifficulty)}
                    select
                >
                    <MenuItem value={0}>Easy</MenuItem>
                    <MenuItem value={1}>Medium</MenuItem>
                    <MenuItem value={2}>Hard</MenuItem>
                </TextField>
            }
            {
              platform === 1 &&
                <TextField
                    id={"difficulty"}
                    fullWidth
                    required
                    variant={"outlined"}
                    label={"Difficulty"}
                    value={difficulty}
                    onChange={handleChange(setDifficulty)}
                    select
                >
                    <MenuItem value={4}>Painless</MenuItem>
                    <MenuItem value={5}>Respectable</MenuItem>
                </TextField>
            }
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                slotProps={{textField: {color: 'secondary'}}}
                ampm={false}
                value={time}
                label="Create Time"
                onChange={(date) => setTime(date)}
                onError={console.log}
                viewRenderers={{
                  hours: null,
                  minutes: null,
                  seconds: null,
                }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (serial && title) {
              handleAdd();
              handleClose();
            }
          }}
          color="primary"
          autoFocus
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProblemDialog;
