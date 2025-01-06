import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {RootState} from "@/redux/store";

// Define a type for the slice state
interface PostState {
  isCompleteDialogShowing: boolean,
  existingPostLoading: boolean,
  postForCompletionId: string | undefined,
  postForCompletionTitle: string | undefined,
}

// Define the initial state using that type
const initialState: PostState = {
  isCompleteDialogShowing: false,
  existingPostLoading: false,
  postForCompletionId: undefined,
  postForCompletionTitle: undefined,
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
    setExistingPostLoading: (state: PostState) => {
      state.existingPostLoading = true;
    },
    setExistingPostNotLoading: (state: PostState) => {
      state.existingPostLoading = false;
    },
    setPostForCompletion: (state: PostState, action: PayloadAction<{ title: string, id: string }>) => {
      state.postForCompletionId = action.payload.id;
      state.postForCompletionTitle = action.payload.title;
    }
  },
})

export const {
  showCompleteDialog,
  hideCompleteDialog,
  setExistingPostLoading,
  setExistingPostNotLoading,
  setPostForCompletion
} = postSlice.actions

export const selectPost = (state: RootState) => state.post

export default postSlice.reducer
