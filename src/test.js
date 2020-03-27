import React from 'react';
import { mount} from 'enzyme';
import { useData, RunStateProvider } from './index.js';
import renderer from 'react-test-renderer';
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
    const { getState, runAction } = useData();

    const handleClick = () => runAction('TEST');

    const { data, error } = getState('TEST');

    return (
      <div>
        <h1>{data}</h1>
        <span>{error && 'oh sh*t'}</span>
        <button onClick={handleClick}>get</button>
      </div>
    );
  };

  const DemoFulfilled = () => (
    <RunStateProvider store={{ TEST: { action: () => Promise.resolve('hello world') } }}>
      <DemoChild />
    </RunStateProvider>
  );

  it('<DemoFulfilled /> mount test', done => {
    const wrapper = mount(<DemoFulfilled />);
    wrapper.find('button').simulate('click');

    setTimeout(() => {
      expect(wrapper.find('h1').text()).toBe('hello world');

      setImmediate(done);
    });
  });

  it('<DemoFulfilled /> renders correctly', () => {
    const tree = renderer
      .create(<DemoFulfilled />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  const DemoRejected = () => (
    <RunStateProvider store={{ TEST: { action: () => Promise.reject() } }}>
      <DemoChild />
    </RunStateProvider>
  );

  it('<DemoRejected /> mount test', done => {
    const wrapper = mount(<DemoRejected />);
    wrapper.find('button').simulate('click');

    setTimeout(() => {
      expect(wrapper.find('span').text()).toBe('oh sh*t');

      setImmediate(done);
    });
  });

  it('<DemoRejected /> renders correctly', () => {
    const tree = renderer
      .create(<DemoRejected />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

});
