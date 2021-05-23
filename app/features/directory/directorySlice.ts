import { createAsyncThunk } from '@reduxjs/toolkit';

import { directoryService, UpdateDirectory } from '../../services';
// eslint-disable-next-line import/no-cycle
import { fetchWorkspaces } from '../workspace/workspaceSlice';

// eslint-disable-next-line import/prefer-default-export
export const updateDirectory = createAsyncThunk(
  'directory/update',
  async (directory: UpdateDirectory, { dispatch, rejectWithValue }) => {
    try {
      const updatedDirectory = await directoryService.update(directory);
      dispatch(fetchWorkspaces());
      return updatedDirectory;
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error(err);
      rejectWithValue(err);
    }

    return null;
  }
);
