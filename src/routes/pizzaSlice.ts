import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPizzas = createAsyncThunk(
  'pizza/fetchPizzas',
  async (params: { categoryId: number | null }) => {
    const { categoryId } = params;
    const query = categoryId ? `?category=${categoryId}` : '';
    const response = await axios.get(`https://api.example.com/pizzas${query}`);
    return response.data;
  }
);

const pizzaSlice = createSlice({
  name: 'pizza',
  initialState: {
    items: [],
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPizzas.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPizzas.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPizzas.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default pizzaSlice.reducer;
