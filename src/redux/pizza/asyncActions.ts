import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Pizza, SearchPizzaParams } from './types';
import pickBy from 'lodash/pickBy';
import identity from 'lodash/identity';


export const fetchPizzas = createAsyncThunk<Pizza[], SearchPizzaParams>(
  'pizza/fetchPizzasStatus',
  async (params) => {
    const {category} = params;
    //console.log(params, 4444);
    const { data } = await axios.get<Pizza[]>(`http://localhost:8000/sbis/sbis-products`, {params: pickBy(
      // api.kimchistop.ru
      {
        category,
      },
      identity,
    ),
    
  });
    console.log(category)
    return data;
  },
)
