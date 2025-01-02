import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {RootState} from "@/redux/store";

// Define a type for the slice state
interface CityState {
  selectedCityId: string
  selectedCityName: string
}

// Define the initial state using that type
const initialState: CityState = {
  selectedCityId: "",
  selectedCityName: ""
}

export const citySlice = createSlice({
  name: 'city',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setSelectedCityId: (state: CityState, action: PayloadAction<string>) => {
      state.selectedCityId = action.payload;
    },
    setSelectedCityName: (state: CityState, action: PayloadAction<string>) => {
      state.selectedCityName = action.payload;
    },
  },
})

export const {setSelectedCityId, setSelectedCityName} = citySlice.actions

export const selectCity = (state: RootState) => state.city

export default citySlice.reducer
