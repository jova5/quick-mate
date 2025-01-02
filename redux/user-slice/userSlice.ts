import {createSlice} from '@reduxjs/toolkit'
import {RootState} from "@/redux/store";

// Define a type for the slice state
interface UserState {
  user: string | undefined
}

// Define the initial state using that type
const initialState: UserState = {
  user: undefined
}

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
  },
})

export const {} = userSlice.actions

export const selectUser = (state: RootState) => state.user

export default userSlice.reducer
