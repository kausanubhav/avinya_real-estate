import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
}

const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true
    },
    signInSuccess: (state, action) => {
      console.log("in signinsuccess", state, action.payload)
      state.currentUser = action.payload
      state.loading = false
      state.error = null
    },
    signInFailure: (state, action) => {
      console.log("in failure function", state)
      state.error = action.payload
      state.loading = false
    },
    updateUserStart: (state) => {
      state.loading = true
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload
      state.loading = false
      state.error = null
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    deleteUserStart:(state)=>{
      state.loading=true
    },
    deleteUserSuccess:(state)=>{
      state.currentUser=null
      state.loading=false
      state.error=null
    },
    deleteUserFailure:(state,action)=>{
      state.error=action.payload
      state.loading=false
    },
    signoutUserStart:(state)=>{
      state.loading=true
    },
    signoutUserSuccess:(state)=>{
      state.currentUser=null
      state.loading=false
      state.error=null
    },
    signoutUserFailure:(state,action)=>{
      state.error=action.payload
      state.loading=false
    }
  },
})

export const { signInStart, signInFailure, signInSuccess,updateUserSuccess,updateUserFailure,updateUserStart,deleteUserSuccess,deleteUserFailure,deleteUserStart,signoutUserFailure,signoutUserStart,signoutUserSuccess } = userSlice.actions
export default userSlice.reducer
