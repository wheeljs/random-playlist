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
    selectedWorkspaceId: null,
    status: 'idle',
    error: null,
  }),
  reducers: {
    setSelectedId: (state, { payload }) => {
      state.selectedWorkspaceId = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWorkspaces.pending, (state) => {
      state.status = 'loading';
    });

    builder.addCase(fetchWorkspaces.fulfilled, (state, { payload }) => {
      state.status = 'fulfilled';

      if (!state.selectedWorkspaceId) {
        state.selectedWorkspaceId = payload[0].id;
      }
      workspaceAdapter.setAll(state, payload);
    });

    builder.addCase(fetchWorkspaces.rejected, (state, { error }) => {
      state.status = 'rejected';
      state.error = error.message;
      workspaceAdapter.removeAll(state);
    });
  },
});

export const { setSelectedId } = workspaceSlice.actions;

export default workspaceSlice.reducer;

export const {
  selectAll: selectWorkspaces,
  selectById: selectWorkspace,
} = workspaceAdapter.getSelectors<RootState>((state) => state.workspace);

export const selectWorkspaceOrDefault = (state: RootState) =>
  selectWorkspace(
    state,
    state.workspace.selectedWorkspaceId || state.workspace.ids[0]
  );
