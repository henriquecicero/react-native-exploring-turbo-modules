/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('../specs/NativeLocalStorage', () => require('../__mocks__/NativeLocalStorage').default);
jest.mock('../specs/NativeSampleModule', () => require('../__mocks__/NativeSampleModule').default);

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
