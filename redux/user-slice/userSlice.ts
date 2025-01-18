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
  photoURL: string | null | undefined,
  cityName: string | null | undefined
}

// Define a type for the slice state
interface UserState {
  user: UserInfo | undefined,
  isLoggedIn: boolean | undefined,
  isLoggingOut: boolean
}

// Define the initial state using that type
const initialState: UserState = {
  user: undefined,
  isLoggedIn: undefined,
  isLoggingOut: false
}

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo | undefined>) => {
      state.user = action.payload;
    },
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    setUserPhoneAndCity: (state, action: PayloadAction<{
      phoneNumber: string | null | undefined,
      cityId: string | null | undefined,
      cityName: string | null | undefined
    }>) => {
      state.user!.phoneNumber = action.payload.phoneNumber;
      state.user!.cityId = action.payload.cityId;
      state.user!.cityName = action.payload.cityName;
    },
    setIsLoggingOut: (state, action: PayloadAction<boolean>) => {
      state.isLoggingOut = action.payload;
    }
  },
})

export const {setUserInfo, setIsLoggedIn, setUserPhoneAndCity, setIsLoggingOut} = userSlice.actions

export const selectUser = (state: RootState) => state.user

export default userSlice.reducer
