import {
  createAsyncThunk,
  createSlice,
  SliceCaseReducers,
} from '@reduxjs/toolkit';
import { IConfig } from '../../models';
import { configService } from '../../services';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';

export interface ConfigState {
  showing: boolean;
  configs: Record<string, IConfig>;
  status: string;
  error: unknown;
}

export const fetchConfigs = createAsyncThunk('config/fetch', async () =>
  configService.listByKeys()
);

const configSlice = createSlice<ConfigState, SliceCaseReducers<ConfigState>>({
  name: 'config',
  initialState: {
    showing: true,
    configs: {},
    status: 'idle',
    error: null,
  },
  reducers: {
    setVisible(state, { payload }) {
      state.showing = payload;
    },
    setConfigs(state, { payload }: { payload: Record<string, IConfig> }) {
      state.configs = payload;
    },
    setConfig(state, { payload }: { payload: IConfig }) {
      state.configs[payload.key] = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfigs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchConfigs.fulfilled, (state, { payload }) => {
        state.status = 'fulfilled';

        state.configs = payload;
      })
      .addCase(fetchConfigs.rejected, (state, { error }) => {
        state.status = 'rejected';
        state.error = error.message;
        state.configs = {};
      });
  },
});

export const { setVisible } = configSlice.actions;

export default configSlice.reducer;

export const selectShowing = (state: RootState) => state.config.showing;
export const selectConfigs = (state: RootState) => state.config.configs;
