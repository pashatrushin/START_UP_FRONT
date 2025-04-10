import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Pizza, SearchPizzaParams } from './types';
import pickBy from 'lodash/pickBy';
import identity from 'lodash/identity';
import { API_BASE_URL } from '../../config/apiConfig';

export const fetchPizzas = createAsyncThunk<Pizza[], SearchPizzaParams>(
  'pizza/fetchPizzasStatus',
  async (params) => {
    const { category } = params;
    const { data } = await axios.get<Pizza[]>(`${API_BASE_URL}/food`, {
      params: pickBy(
        {
          category,
        },
        identity,
      ),
    });
    console.log(category);
    return data;
  },
);
