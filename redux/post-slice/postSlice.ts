import {createSlice} from '@reduxjs/toolkit'
import {RootState} from "@/redux/store";

// Define a type for the slice state
interface PostState {
  isCompleteDialogShowing: boolean
}

// Define the initial state using that type
const initialState: PostState = {
  isCompleteDialogShowing: false
}

export const postSlice = createSlice({
  name: 'post',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    showCompleteDialog: (state: PostState) => {
      state.isCompleteDialogShowing = true;
    },
    hideCompleteDialog: (state: PostState) => {
      state.isCompleteDialogShowing = false;
    },
  },
})

export const { showCompleteDialog, hideCompleteDialog } = postSlice.actions

export const selectPost = (state: RootState) => state.post

export default postSlice.reducer
