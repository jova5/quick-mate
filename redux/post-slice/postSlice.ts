import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {RootState} from "@/redux/store";
import {GeoLocation} from "@/db/collections/posts";

// Define a type for the slice state
interface PostState {
  isCompleteDialogShowing: boolean,
  existingPostLoading: boolean,
  postForCompletionId: string | undefined,
  postForCompletionTitle: string | undefined,
  newPostAddress: string | undefined,
  newPostGeoLocation: GeoLocation | undefined,
}

// Define the initial state using that type
const initialState: PostState = {
  isCompleteDialogShowing: false,
  existingPostLoading: false,
  postForCompletionId: undefined,
  postForCompletionTitle: undefined,
  newPostAddress: undefined,
  newPostGeoLocation: undefined
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
    setPostForCompletion: (state: PostState, action: PayloadAction<{
      title: string,
      id: string
    }>) => {
      state.postForCompletionId = action.payload.id;
      state.postForCompletionTitle = action.payload.title;
    },
    setNewPostAddress: (state: PostState, action: PayloadAction<string>) => {
      state.newPostAddress = action.payload;
    },
    setNewPostGeoLocation: (state: PostState, action: PayloadAction<GeoLocation>) => {
      state.newPostGeoLocation = action.payload;
    }
  },
})

export const {
  showCompleteDialog,
  hideCompleteDialog,
  setExistingPostLoading,
  setExistingPostNotLoading,
  setPostForCompletion,
  setNewPostGeoLocation,
  setNewPostAddress
} = postSlice.actions

export const selectPost = (state: RootState) => state.post

export default postSlice.reducer
