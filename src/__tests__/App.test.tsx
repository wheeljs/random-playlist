import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import App from '../renderer/App';
import { configuredStore } from '../renderer/store/store';

const store = configuredStore();

describe('App', () => {
  it('should render', () => {
    expect(render(<App store={store} />)).toBeTruthy();
  });
});
