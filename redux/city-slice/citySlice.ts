import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {RootState} from "@/redux/store";

// Define a type for the slice state
interface CityState {
  selectedCityId: string | undefined
  selectedCityName: string | undefined
  cities: any[]
}

// Define the initial state using that type
const initialState: CityState = {
  selectedCityId: undefined,
  selectedCityName: undefined,
  cities: []
}

export const citySlice = createSlice({
  name: 'city',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setSelectedCityId: (state: CityState, action: PayloadAction<string | undefined>) => {
      state.selectedCityId = action.payload;
    },
    setSelectedCityName: (state: CityState, action: PayloadAction<string | undefined>) => {
      state.selectedCityName = action.payload;
    },
    setCities: (state: CityState, action: PayloadAction<any[]>) => {
      state.cities = action.payload;
    }
  },
})

export const {setSelectedCityId, setSelectedCityName} = citySlice.actions

export const selectCity = (state: RootState) => state.city

export default citySlice.reducer
