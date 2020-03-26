import React, { useReducer, useContext, createContext } from 'react';
import PropTypes from 'prop-types';

const isPromise = (value) => Boolean(value && typeof value.then === 'function');

const initialDataState = {
  data: null,
  error: false,
  loading: false,
};

const initialState = {
  pockets: {},
};

const RunStateContext = createContext(null);

const updateState = (state, key, value = {}) => ({
  ...state,
  pockets: {
    ...state.pockets,
    [key]: {
      ...state.pockets[key],
      ...value,
    },
  },
});

const reducer = (state, { type, key, payload }) => {
  /* eslint no-param-reassign:0 */
  if (!state.pockets[key]) state.pockets[key] = initialDataState;

  switch (type) {
    case 'pending':
      return updateState(state, key, {
        loading: true,
      });
    case 'fulfilled':
      return updateState(state, key, {
        loading: false,
        data: payload,
      });
    case 'rejected':
      return updateState(state, key, {
        loading: false,
        error: true,
      });
    default:
      return state;
  }
};

export const RunStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    () => initialState,
  );

  const run = (key, promise) => {
    dispatch({ type: 'pending', key });

    return (isPromise(promise) ? promise : Promise.resolve(promise))
      .then((data) => dispatch({ type: 'fulfilled', key, payload: data }))
      .catch(() => dispatch({ type: 'rejected', key }));
  };

  return (
    <RunStateContext.Provider
      value={{
        run,
        getState: (key) => state.pockets[key] || initialDataState,
      }}
    >
      {children}
    </RunStateContext.Provider>
  );
};

RunStateProvider.propTypes = { children: PropTypes.node.isRequired };

export const useData = () => useContext(RunStateContext);