import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {RootState} from "@/redux/store";

// Define a type for the slice state
interface CounterState {
  value: number,
  test: string
}

// Define the initial state using that type
const initialState: CounterState = {
  value: 0,
  test: "hello"
}

export const counterSlice = createSlice({
  name: 'counter',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    increment: (state: any) => {
      state.value += 1
      console.log("incremented")
    },
    decrement: (state: any) => {
      state.value -= 1
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state: any, action: PayloadAction<number>) => {
      state.value += action.payload
    },
  },
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.counter

export default counterSlice.reducer
