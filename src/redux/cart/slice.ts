import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';
import { calcTotalCount } from '../../utils/calcTotalCount';
import { calcTotalPrice } from '../../utils/calcTotalPrice';
import { getCartFromLS } from '../../utils/getCartFromLS';
import { CartItem, CartSliceState } from './types';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (userId: number) => {
  const response = await axios.get(`${API_BASE_URL}/cart/data`, {
    params: { user_id: userId },
  });
  return response.data.cart; // Ожидается объект { productId: quantity }
});

export const updateCart = createAsyncThunk(
  'cart/updateCart',
  async ({ userId, productId, quantity }: { userId: number; productId: string; quantity: number }) => {
    await axios.post(`${API_BASE_URL}/cart/add`, {
      user_id: userId,
      product_id: productId,
      quantity,
    });
    const response = await axios.get(`${API_BASE_URL}/cart/data`, {
      params: { user_id: userId },
    });
    return response.data.cart;
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ userId, productId }: { userId: number; productId: string }) => {
    await axios.delete(`${API_BASE_URL}/cart/remove`, {
      params: { user_id: userId, product_id: productId },
    });
    const response = await axios.get(`${API_BASE_URL}/cart/data`, {
      params: { user_id: userId },
    });
    return response.data.cart;
  }
);

const initialState: CartSliceState = getCartFromLS();

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const findItem = state.items.find((obj) => obj.id === action.payload.id);
      if (findItem) {
        findItem.quantity++; // Увеличиваем количество
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1, // Устанавливаем начальное количество
        });
      }
      state.totalCount = calcTotalCount(state.items);
      state.totalPrice = calcTotalPrice(state.items);
    },
    minusItem(state, action: PayloadAction<string>) {
      const findItem = state.items.find((obj) => obj.id === action.payload);
      if (findItem && findItem.quantity > 1) {
        findItem.quantity--; // Уменьшаем количество
      } else {
        state.items = state.items.filter((obj) => obj.id !== action.payload);
      }
      state.totalCount = calcTotalCount(state.items);
      state.totalPrice = calcTotalPrice(state.items);
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((obj) => obj.id !== action.payload);
      state.totalCount = calcTotalCount(state.items);
      state.totalPrice = calcTotalPrice(state.items);
    },
    clearItems(state) {
      state.items = [];
      state.totalPrice = 0;
      state.totalCount = 0;
    },
    discount(state) {
      let ds = state.totalPrice / 100 * 10;
      state.totalPrice = state.totalPrice - ds;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { addItem, removeItem, minusItem, clearItems, discount } = cartSlice.actions;

export default cartSlice.reducer;