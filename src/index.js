import React, { useReducer, useContext, createContext } from 'react';
import PropTypes from 'prop-types';

const isPromise = value => Boolean(value && typeof value.then === 'function');

const initialDataState = {
  data: null,
  error: false,
  loading: false,
};

const initialState = {
  pockets: {},
};

const RunStateContext = createContext(null);

/**
 * return state
 * @param   {object} state  state
 * @param   {string} key    key of the value to be changed
 * @param   {object} value  new value
 * @return  {object}        state
 */
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

/**
 * return state
 * @param   {object} state  state
 * @param   {object} action reducer action
 * @return  {object}        state
 */
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

export const RunStateProvider = ({ children, store }) => {
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    () => initialState,
  );

  const runAction = (key, ...params) => {
    const promise = store[key].action(...params);

    dispatch({ type: 'pending', key });

    return (isPromise(promise) ? promise : Promise.resolve(promise))
      .then(data => dispatch({ type: 'fulfilled', key, payload: data }))
      .catch(() => dispatch({ type: 'rejected', key }));
  };

  return (
    <RunStateContext.Provider
      value={{
        runAction,
        getState: key => state.pockets[key] || initialDataState,
      }}
    >
      {children}
    </RunStateContext.Provider>
  );
};

RunStateProvider.propTypes = {
  children: PropTypes.node.isRequired,
  /*eslint react/no-unused-prop-types:0*/
  store: PropTypes.object.isRequired,
};

export const useData = () => useContext(RunStateContext);
