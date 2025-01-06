import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {RootState} from "@/redux/store";

export interface UserInfo {
  id: string | null | undefined,
  firstName: string | null | undefined,
  lastName: string | null | undefined,
  email: string | null | undefined,
  phoneNumber: string | null | undefined,
  notifyPhoneId: string | null | undefined,
  cityId: string | null | undefined,
  photoURL: string | null | undefined
}

// Define a type for the slice state
interface UserState {
  user: UserInfo | undefined,
  isLoggedIn: boolean | undefined,
}

// Define the initial state using that type
const initialState: UserState = {
  user: undefined,
  isLoggedIn: undefined,
}

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUserInfo(state, action: PayloadAction<UserInfo | undefined>) {
      state.user = action.payload;
    },
    setIsLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
    }
  },
})

export const {setUserInfo, setIsLoggedIn} = userSlice.actions

export const selectUser = (state: RootState) => state.user

export default userSlice.reducer
