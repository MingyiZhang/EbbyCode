import React, {useContext, useEffect} from 'react';
import './App.css';
import {ProblemsContext} from "./providers/ProblemProvider";
import {Container, Grid, Typography} from "@mui/material";
import QuickAccessButton from "./components/Buttons/QuickAccessButton";
import AddProblemDialog from "./components/Dialogs/AddProblemDialog";
import {saveState} from "./utils/localStorage";
import ProblemCard from "./components/Cards/ProblemCard";
import {makeStyles} from 'tss-react/mui';
import { ThemeProvider, StyledEngineProvider, createTheme } from '@mui/material/styles';
import SelectedProblemCard from "./components/Cards/SelectedProblemCard";
import SortProblemsDialog from "./components/Dialogs/SortProblemsDialog";

const theme = createTheme();

const useStyles = makeStyles()((theme) => {
  return {
    heroContent: {
      // backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(8, 0, 6)
    },
    heroButtons: {
      marginTop: theme.spacing(4)
    },
    cardGrid: {
      paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(8)
    },
    card: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    cardMedia: {
      paddingTop: '56.25%', // 16:9
    },
    cardContent: {
      flexGrow: 1,
    },
  };
});

const App = () => {
  const {classes} = useStyles();
  const {problems, selectedProblems} = useContext(ProblemsContext);

  useEffect(() => {
    console.log("save to local storage")
    saveState(problems);
  }, [problems])

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <div className="App">
          {
            selectedProblems.length !== 0 &&
            <Container className={classes.heroContent} maxWidth="sm">
              <Typography component="h1" variant="h2" align="center" gutterBottom>
                Selected Problems
              </Typography>
            </Container>
          }
          {
            selectedProblems.length !== 0 &&
            <Container className={classes.cardGrid} maxWidth="md">
              <Grid container spacing={4}>
                {selectedProblems.map(p => (
                  <Grid item key={p.index} xs={12} sm={6} md={4}>
                    <SelectedProblemCard problem={p}/>
                  </Grid>
                ))}
              </Grid>
            </Container>
          }
          <Container className={classes.heroContent} maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" gutterBottom>
              Problems
            </Typography>
          </Container>
          <Container className={classes.cardGrid} maxWidth="md">
            <Grid container spacing={4}>
              {problems.map(p => (
                <Grid item key={p.index} xs={12} sm={6} md={4}>
                  <ProblemCard problem={p}/>
                </Grid>
              ))}
            </Grid>
          </Container>
          <QuickAccessButton/>
          <AddProblemDialog/>
          <SortProblemsDialog/>
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
