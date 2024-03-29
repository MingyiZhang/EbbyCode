import React from 'react';
import {createRoot} from 'react-dom/client'
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {ProblemsProvider} from "./providers/ProblemProvider";
import {DialogStateProvider} from "./providers/DialogStateProvider";
import {ChoicesProvider} from "./providers/ChoiceProvider";
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews, useInitial} from "./dev";

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
    <React.StrictMode>
      <ChoicesProvider>
        <ProblemsProvider>
          <DialogStateProvider>
            <DevSupport ComponentPreviews={ComponentPreviews}
                        useInitialHook={useInitial}
            >
              <App/>
            </DevSupport>
          </DialogStateProvider>
        </ProblemsProvider>
      </ChoicesProvider>
    </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
