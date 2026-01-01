/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../src/App';

jest.mock('app/specs', () => {
  const ReactRuntime = require('react');
  const { View } = require('react-native');

  return {
    NativeCounterView: (props: any) => ReactRuntime.createElement(View, props),
    NativePDFView: (props: any) => ReactRuntime.createElement(View, props),
    NativeWebView: (props: any) => ReactRuntime.createElement(View, props),
    NativeLocalStorage: require('../__mocks__/NativeLocalStorage').default,
    NativeSampleModule: require('../__mocks__/NativeSampleModule').default,
  };
});

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
