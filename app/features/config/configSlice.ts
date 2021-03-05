import {
  createAsyncThunk,
  createSlice,
  SliceCaseReducers,
} from '@reduxjs/toolkit';
import { IConfig, SaveOrUpdateConfig } from '../../models';
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

export const updateConfigs = createAsyncThunk(
  'config/update',
  async (configs: SaveOrUpdateConfig[]) => {
    return configService.update(configs);
  }
);

const configSlice = createSlice<ConfigState, SliceCaseReducers<ConfigState>>({
  name: 'config',
  initialState: {
    showing: false,
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
      })

      .addCase(updateConfigs.fulfilled, (state, { payload }) => {
        state.configs = {
          ...state.configs,
          ...payload,
        };
      });
  },
});

export const { setVisible } = configSlice.actions;

export default configSlice.reducer;

export const selectShowing = (state: RootState) => state.config.showing;
export const selectConfigs = (state: RootState) => state.config.configs;
