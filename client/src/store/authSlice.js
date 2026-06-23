import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

axios.defaults.withCredentials = true;

export const loginUser = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/api/auth/login', { email, password });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/api/auth/register', userData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async ({ email, otp }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/api/auth/verify-otp', { email, otp });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Verification failed');
  }
});

export const resendOtp = createAsyncThunk('auth/resendOtp', async ({ email }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/api/auth/resend-otp', { email });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to resend OTP');
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get('/api/auth/me');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Not authenticated');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await axios.post('/api/auth/logout');
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null, loading: false, error: null, otpSent: false, otpEmail: null, otpLoading: false, otpError: null },
  reducers: {
    clearError: (state) => { state.error = null; state.otpError = null; },
    resetOtp: (state) => { state.otpSent = false; state.otpEmail = null; state.otpLoading = false; state.otpError = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; state.token = action.payload.token; })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = true;
        state.otpEmail = action.payload.email || action.payload.user?.email;
      })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(verifyOtp.pending, (state) => { state.otpLoading = true; state.otpError = null; })
      .addCase(verifyOtp.fulfilled, (state, action) => { state.otpLoading = false; state.user = action.payload.user; state.token = action.payload.token; state.otpSent = false; state.otpEmail = null; })
      .addCase(verifyOtp.rejected, (state, action) => { state.otpLoading = false; state.otpError = action.payload; })
      .addCase(resendOtp.pending, (state) => { state.otpLoading = true; state.otpError = null; })
      .addCase(resendOtp.fulfilled, (state) => { state.otpLoading = false; })
      .addCase(resendOtp.rejected, (state, action) => { state.otpLoading = false; state.otpError = action.payload; })
      .addCase(fetchMe.fulfilled, (state, action) => { state.user = action.payload.user; })
      .addCase(fetchMe.rejected, (state) => { state.user = null; state.token = null; })
      .addCase(logoutUser.fulfilled, (state) => { state.user = null; state.token = null; });
  }
});

export const { clearError, resetOtp } = authSlice.actions;
export default authSlice.reducer;
