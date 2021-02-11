import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { Workspace } from '../../models';

import { workspaceService } from '../../services';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';

export const fetchWorkspaces = createAsyncThunk('workspace/fetch', async () => {
  return workspaceService.list();
});

const workspaceAdapter = createEntityAdapter<Workspace>();

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: workspaceAdapter.getInitialState({
    status: 'idle',
    error: null,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchWorkspaces.pending, (state) => {
      state.status = 'loading';
    });

    builder.addCase(fetchWorkspaces.fulfilled, (state, { payload }) => {
      state.status = 'fulfilled';

      workspaceAdapter.setAll(state, payload);
    });

    builder.addCase(fetchWorkspaces.rejected, (state, { error }) => {
      state.status = 'rejected';
      state.error = error.message;
      workspaceAdapter.removeAll(state);
    });
  },
});

export default workspaceSlice.reducer;

export const {
  selectAll: selectWorkspaces,
} = workspaceAdapter.getSelectors<RootState>((state) => state.workspace);
