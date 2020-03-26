[![Build Status](https://travis-ci.org/indatawetrust/run-state.svg?branch=master)](https://travis-ci.org/indatawetrust/run-state)

#### run-state

[![Edit kind-banzai-n5lrb](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/kind-banzai-n5lrb?fontsize=14&hidenavigation=1&theme=dark)

```jsx
import React, { useEffect } from 'react';
import { useData, RunStateProvider } from 'run-state';

const Demo = () => {
  const { getState, run } = useData();

  useEffect(() => {
    run(
      "GET_POST",
      new Promise((resolve) => {
        setTimeout(() => {
          fetch("https://jsonplaceholder.typicode.com/posts/1")
          .then(response => {
            return response.json();
          })
          .then(resolve)
        }, 5000)
      })
    )
  }, []);

  const { loading, data } = getState('GET_POST');

  return (
    <div>
      {
        loading ? '⌛' : '✅'
      }
      <pre>{JSON.stringify(data, null, 4)}</pre>
    </div>
  );
};

const AnotherDemo = () => {
  const { getState } = useData();

  const { loading, data } = getState('GET_POST');

  return (
    <div style={{ padding: '1rem', border: 'solid 1rem #ccc' }}>
      {
        loading ? '⌛' : '✅'
      }
      <pre>{JSON.stringify(data, null, 4)}</pre>
    </div>
  );
}

export default function App() {
  return (
    <RunStateProvider>
      <Demo />
      <AnotherDemo />
    </RunStateProvider>
  );
}
```
