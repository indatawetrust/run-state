[![Build Status](https://travis-ci.org/indatawetrust/run-state.svg?branch=master)](https://travis-ci.org/indatawetrust/run-state)

#### run-state

[![Edit kind-banzai-n5lrb](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/kind-banzai-n5lrb?fontsize=14&hidenavigation=1&theme=dark)

```jsx
import React, { useEffect } from 'react';
import { useData, RunStateProvider } from 'run-state';

const Demo = () => {
  const { getState, updateState, runAction } = useData();

  const update = () => updateState('GET_POST', post => ({ ...post, title: 'oh sh*t' }));

  useEffect(() => {
    runAction("GET_POST", 1);
  }, []);

  const { loading, data } = getState("GET_POST");

  return (
    <div>
      {loading ? "⌛" : "✅"}
      <pre>{JSON.stringify(data, null, 4)}</pre>
      <button onClick={update}>update</button>
    </div>
  );
};

const AnotherDemo = () => {
  const { getState } = useData();

  const { loading, data } = getState("GET_POST");

  return (
    <div style={{ padding: "1rem", border: "solid 1rem #ccc" }}>
      {loading ? "⌛" : "✅"}
      <pre>{JSON.stringify(data, null, 4)}</pre>
      {null}
    </div>
  );
};

const store = {
  GET_POST: {
    action: id =>
      new Promise(resolve => {
        setTimeout(() => {
          fetch("https://jsonplaceholder.typicode.com/posts/" + id)
            .then(response => {
              return response.json();
            })
            .then(data => resolve(data));
        }, 1000);
      })
  }
};

export default function App() {
  return (
    <RunStateProvider store={store}>
      <Demo />
      <AnotherDemo />
    </RunStateProvider>
  );
}
```
