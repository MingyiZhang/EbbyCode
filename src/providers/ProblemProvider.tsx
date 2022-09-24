import React, {createContext, Dispatch, ReactElement, ReactNode, useReducer} from 'react';
import {loadState} from "../utils/localStorage";
import {selectProblems, updateWeightsNormCumulated} from "../utils/ebbinghaus";

export interface ProblemDisplay {
  platform: number;
  serial: string;
  index: string;
  title: string;
  createTime: number;
  updateTime: number;
  practice: number;
  remember: number;
  weight: number;
  difficulty: number;
  normCumulatedWeight: number;
}

export type sortEntry = "platform" | "serial" | "title" | "practice" | "remember" | "weight" | "difficulty";

interface SortType {
  sortEntry: sortEntry;
  isReverse: boolean;
}

type ActionType = { type: 'addProblem', payload: ProblemDisplay }
  | { type: 'addProblems', payload: ProblemDisplay[] }
  | { type: 'addSelectedProblems', payload: ProblemDisplay[] }
  | { type: 'deleteProblem', payload: string }
  | { type: 'updateProblem', payload: ProblemDisplay }
  | { type: 'deleteSelectedProblem', payload: string }
  | { type: 'updateWeightsNormCumulated' }
  | { type: 'sortProblems', payload: SortType };

interface StateType {
  selectedProblems: Array<ProblemDisplay>;
  problems: Array<ProblemDisplay>;
  sortEntry: sortEntry;
  isReverse: boolean;
  dispatch?: Dispatch<ActionType>;
}

export const platform = ["LeetCode", "Codility"];
export const difficulty = ["Easy", "Medium", "Hard", "Painless", "Respectable"];
export const sortEntries: sortEntry[] = ["platform", "serial", "title", "practice", "remember", "weight", "difficulty"];
export const sortEntryLabels = {
  platform: "Platform",
  serial: "Serial",
  title: "Problem Title",
  practice: "Number of Practices",
  remember: "Number of Remembered",
  weight: "Memory Intensity",
  difficulty: "Difficulty"
}

const problems = loadState();
updateWeightsNormCumulated(problems);
const selectedProblems = selectProblems(problems, 3);

const initialState: StateType = {
  selectedProblems: selectedProblems,
  problems: problems,
  sortEntry: "platform",
  isReverse: false,
};

const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case "addProblem":
      if (action.payload && state.problems.find(element => element.index === action.payload.index)) {
        return state;
      }
      return {
        ...state,
        problems: [...state.problems, action.payload]
      };
    case "addProblems":
      if (action.payload) {
        return {
          ...state,
          problems: action.payload
        };
      }
      return state;
    case "addSelectedProblems":
      if (action.payload) {
        return {
          ...state,
          selectedProblems: action.payload
        };
      }
      return state;
    case "deleteProblem":
      if (action.payload) {
        const p = state.problems.find(element => element.index === action.payload);
        if (p !== undefined) {
          const index = state.problems.indexOf(p);
          const problemsCopy = [...state.problems];
          problemsCopy.splice(index, 1);
          return {
            ...state,
            problems: problemsCopy
          };
        }
      }
      return state;
    case "deleteSelectedProblem":
      if (action.payload) {
        const p = state.selectedProblems.find(e => e.index === action.payload);
        if (p !== undefined) {
          const index = state.selectedProblems.indexOf(p);
          const problemsCopy = [...state.selectedProblems];
          problemsCopy.splice(index, 1);
          return {
            ...state,
            selectedProblems: problemsCopy
          };
        }
      }
      return state;
    case "updateProblem":
      if (action.payload) {
        const p = state.problems.find(element => element.index === action.payload.index);
        if (p !== undefined) {
          const index = state.problems.indexOf(p);
          const problemsCopy = [...state.problems];
          problemsCopy.splice(index, 1, action.payload);
          return {
            ...state,
            problems: problemsCopy
          };
        }
      }
      return state;
    case "updateWeightsNormCumulated":
      const problemsCopy = [...state.problems];
      updateWeightsNormCumulated(problemsCopy);
      return {
        ...state,
        problems: problemsCopy
      };
    case "sortProblems":
      const sortEntry = action.payload.sortEntry;
      const isReverse = action.payload.isReverse;
      const alpha = isReverse ? -1 : 1;
      if (sortEntry !== state.sortEntry || isReverse !== state.isReverse) {
        const sortedProblems = state.problems.sort((p1, p2) => {
          let less = p1[sortEntry] < p2[sortEntry];
          if (sortEntry === "serial") {
            less = p1[sortEntry].length < p2[sortEntry].length || (p1[sortEntry].length === p2[sortEntry].length && p1[sortEntry] < p2[sortEntry]);
          }
          return less ? -alpha : alpha;
        });
        return {
          ...state,
          problems: sortedProblems,
          sortEntry: sortEntry,
          isReverse: isReverse,
        };
      }
      return state;
    default:
      return state;
  }
};

export const ProblemsContext = createContext(initialState)

export const ProblemsProvider = ({children}: { children: ReactNode }): ReactElement => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ProblemsContext.Provider value={{...state, dispatch}}>
      {children}
    </ProblemsContext.Provider>
  )
}