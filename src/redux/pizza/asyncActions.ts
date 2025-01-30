import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Pizza, SearchPizzaParams } from './types';
import pickBy from 'lodash/pickBy';
import identity from 'lodash/identity';


let fetchItems:Array<Number> = []
export const fetchPizzas = createAsyncThunk<Pizza[], SearchPizzaParams>(
  'pizza/fetchPizzasStatus',
  async (params) => {
    const {category} = params;
    //console.log(params, 4444);
    const { data } = await axios.get<Pizza[]>(`http://127.0.0.1:8000/sbis/sbis-products`, {params: pickBy(
      // api.kimchistop.ru
      {
        fetchItems,
        category,
      },
      identity,
    ),
    
  });
    console.log(category)
    return data;
  },
)
