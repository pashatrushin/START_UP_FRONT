import axios from "axios"
import { FavItem } from "../redux/favorite/types_fav"
import { calcTotalCount } from "./calcTotalCountFav"
import { calcTotalPrice } from "./calcTotalPriceFav"
import qs from "qs"
import { GlobalContext } from "../routes/router"
import { useContext } from "react"
import { API_BASE_URL } from '../config/apiConfig';

let data: FavItem[] = []
async function getData() {
  const ls: any = localStorage.getItem('tgParams')
  // const ls: any = {
  //   "address": "string",
  //   "id": 1,
  //   "nickname": "string",
  //   "chatID": "string",
  //   "role": "string",
  //   "name": "string",
  //   "tel": "string",
  //   "orders": "string",
  //   "favourites": []
  // }
  const params: any = JSON.parse(ls)
  await axios.post(`${API_BASE_URL}/user/setstate?nickname=${params.user}`)
  // await axios.get(`https://api.skyrodev.ru/user/${params.user}/fav`).then(e => {
  //   e.data.forEach((item:any) =>{
  //     data.push(item)
  //     console.log(item)
  //   })
  // })
  console.log(data)
}

export const getFavFromLS = () => {
  getData();
  const items = data.map((item) => ({
    ...item,
    quantity: item.quantity || 1, // Убедитесь, что у каждого объекта есть quantity
  }));
  const totalPrice = calcTotalPrice(items);
  const totalCount = calcTotalCount(items);
  return {
    items: items as FavItem[],
    totalPrice,
    totalCount,
  };
};