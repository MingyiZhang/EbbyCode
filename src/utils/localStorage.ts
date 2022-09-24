import {ProblemDisplay} from "../providers/ProblemProvider";

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const saveState = (state: ProblemDisplay[]) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch (err) {
    console.error(err);
  }
};

export const downloadToJson = (state: ProblemDisplay[]) => {
  const filename = "state.json";
  const contentType = "application/json;charset=utf-8;";
  const a = document.createElement('a');
  a.download = filename;
  a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(state));
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};