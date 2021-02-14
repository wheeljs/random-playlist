import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { Workspace } from '../../models';

import {
  workspaceService,
  SaveWorkspace,
  UpdateWorkspace,
} from '../../services';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';

export const fetchWorkspaces = createAsyncThunk('workspace/fetch', async () => {
  return workspaceService.list();
});

export const addWorkspace = createAsyncThunk(
  'workspace/add',
  async (newWorkspace: SaveWorkspace, { dispatch, rejectWithValue }) => {
    try {
      const addedWorkspace = await workspaceService.add(newWorkspace);
      dispatch(fetchWorkspaces());
      return addedWorkspace;
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error(err);
      rejectWithValue(err);
    }

    return null;
  }
);

export const updateWorkspace = createAsyncThunk(
  'workspace/update',
  async (workspace: UpdateWorkspace, { dispatch, rejectWithValue }) => {
    try {
      const updatedWorkspace = await workspaceService.update(workspace);
      dispatch(fetchWorkspaces());
      return updatedWorkspace;
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error(err);
      rejectWithValue(err);
    }

    return null;
  }
);

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
    builder
      .addCase(fetchWorkspaces.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWorkspaces.fulfilled, (state, { payload }) => {
        state.status = 'fulfilled';

        if (!state.selectedWorkspaceId) {
          state.selectedWorkspaceId = payload[0].id;
        }
        workspaceAdapter.setAll(state, payload);
      })
      .addCase(fetchWorkspaces.rejected, (state, { error }) => {
        state.status = 'rejected';
        state.error = error.message;
        workspaceAdapter.removeAll(state);
      })

      .addCase(addWorkspace.fulfilled, (state, { payload }) => {
        workspaceAdapter.upsertOne(state, payload);
      })

      .addCase(updateWorkspace.fulfilled, (state, { payload }) => {
        workspaceAdapter.upsertOne(state, payload);
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

export const selectLastWorkspace = (state: RootState) => {
  const lastId = state.workspace.ids[state.workspace.ids.length - 1];
  return selectWorkspace(state, lastId);
};
