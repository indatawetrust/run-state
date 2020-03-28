/* eslint-disable */
import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import { useData, RunStateProvider } from './index.js';
import 'jsdom-global/register';

const originalConsoleError = console.error;
console.error = (...args) => {
  if (/Warning.*not wrapped in act/.test(args[0])) {
    return;
  }
  originalConsoleError(...args);
};

describe('<RunStateProvider />', () => {
  const DemoChild = () => {
    const { getState, updateState, runAction } = useData();

    const { data, error } = getState('TEST');

    const handleAction = () => runAction('TEST');

    const handleUpdate = () => updateState('TEST', text => text.toUpperCase())

    return (
      <div>
        <h1>{data}</h1>
        <span>{error && 'oh sh*t'}</span>
        <button id="action" onClick={handleAction}>action</button>
        <button id="update" onClick={handleUpdate}>update</button>
      </div>
    );
  };

  const DemoFulfilled = () => (
    <RunStateProvider
      store={{ TEST: { action: () => Promise.resolve('hello world') } }}
    >
      <DemoChild />
    </RunStateProvider>
  );

  it('<DemoFulfilled /> mount test', (done) => {
    const wrapper = mount(<DemoFulfilled />);
    wrapper.find('#action').simulate('click');

    setTimeout(() => {
      expect(wrapper.find('h1').text()).toBe('hello world');

      setImmediate(done);
    });
  });

  it('<DemoFulfilled /> renders correctly', () => {
    const tree = renderer.create(<DemoFulfilled />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  const DemoRejected = () => (
    <RunStateProvider store={{ TEST: { action: () => Promise.reject() } }}>
      <DemoChild />
    </RunStateProvider>
  );

  it('<DemoRejected /> mount test', (done) => {
    const wrapper = mount(<DemoRejected />);
    wrapper.find('#action').simulate('click');

    setTimeout(() => {
      expect(wrapper.find('span').text()).toBe('oh sh*t');

      setImmediate(done);
    });
  });

  it('<DemoRejected /> renders correctly', () => {
    const tree = renderer.create(<DemoRejected />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  const DemoUpdateState = () => (
    <RunStateProvider store={{ TEST: { action: () => Promise.resolve('hello world') } }}>
      <DemoChild />
    </RunStateProvider>
  );

  it('<DemoUpdateState /> mount test', (done) => {
    const wrapper = mount(<DemoUpdateState />);

    wrapper.find('#action').simulate('click');

    setTimeout(() => {
      wrapper.find('#update').simulate('click');

      expect(wrapper.find('h1').text()).toBe('HELLO WORLD');

      setImmediate(done);
    });
  });

  it('<DemoUpdateState /> renders correctly', () => {
    const tree = renderer.create(<DemoUpdateState />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
