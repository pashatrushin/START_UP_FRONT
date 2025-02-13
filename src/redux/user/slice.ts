import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {User, UserState} from '../../interfaces/user'
// const initialState: any = {}
const initialState: UserState = {
  user: null
}
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser:  (state) => {
      state.user = null;
    },
  },
});

export const { setUser , clearUser  } = userSlice.actions;
export default userSlice.reducer;

// export const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {
//     userState: (state, action: PayloadAction<any>) => {
//       state.value = action.payload
//     },

//   },
// })

// export const { userState } = userSlice.actions

// export default userSlice.reducer