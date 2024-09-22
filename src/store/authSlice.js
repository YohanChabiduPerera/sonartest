// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// export const login = createAsyncThunk('auth/login', async ({ email, password }) => {
//   const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
//   return response.data;
// });

// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     token: localStorage.getItem('token') || null,
//     status: 'idle',
//     error: null,
//   },
//   reducers: {
//     logout: (state) => {
//       state.token = null;
//       localStorage.removeItem('token');
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(login.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.token = action.payload.token;
//         localStorage.setItem('token', action.payload.token);
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.error.message;
//       });
//   },
// });

// export const { logout } = authSlice.actions;

// export default authSlice.reducer;
