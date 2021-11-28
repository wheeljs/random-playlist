import { ipcRenderer } from 'electron';
import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import type { SliceCaseReducers } from '@reduxjs/toolkit';

import type { IConfig, SaveOrUpdateConfig } from '../../../../common/models';
import { Channel } from '../../../../common/constants';
import { configService } from '../../../services';
import type { ConfigKeys, NativeThemeSource } from '../../../services';
import type { RootState } from '../../store';

export interface ConfigState {
  useDarkTheme?: boolean;
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

export const updateContainerTheme = createAsyncThunk(
  'config/update-container-theme',
  async (theme: NativeThemeSource) => {
    return ipcRenderer.invoke(Channel.DarkMode, theme);
  }
);

const configSlice = createSlice<ConfigState, SliceCaseReducers<ConfigState>>({
  name: 'config',
  initialState: {
    useDarkTheme: false,
    showing: false,
    configs: {},
    status: 'idle',
    error: null,
  },
  reducers: {
    setVisible(state, { payload }) {
      state.showing = payload;
    },
    setUseDarkTheme(state, { payload }: { payload: boolean }) {
      state.useDarkTheme = payload;
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
      })

      .addCase(updateContainerTheme.fulfilled, (state, { payload }) => {
        state.useDarkTheme = payload;
      });
  },
});

export const { setVisible, setUseDarkTheme } = configSlice.actions;

export default configSlice.reducer;

export const selectShowing = (state: RootState) => state.config.showing;
export const selectConfigs = (state: RootState) => state.config.configs;
export const selectConfig = createSelector(
  [selectConfigs, (_state: unknown, key: ConfigKeys) => key],
  (configs, key) => {
    return configs[key];
  }
);
