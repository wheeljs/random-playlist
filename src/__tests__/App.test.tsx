import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import App from '../renderer/App';
import { history, configuredStore } from '../renderer/store/store';

const store = configuredStore();

describe('App', () => {
  it('should render', () => {
    expect(render(<App store={store} history={history} />)).toBeTruthy();
  });
});
