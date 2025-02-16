import { Link } from 'react-router-dom';
import { FavoriteItem } from '../components/FavoriteItem';
import arrow_back from '../assets/images/Arrow 5.svg'
import { createContext, useContext, useEffect, useState } from 'react';
import { GlobalContext } from './router';
import EmptyFav from './EmptyFav';
import { Detail } from './Detail';
import axios, { AxiosRequestConfig } from 'axios'
import { RootState } from '../redux/store';
import { selectPizzaData } from "../redux/pizza/selectors";
import { Pizza } from '../redux/pizza/types';
import userSlice, { setUser } from '../redux/user/slice'
import { useSelector, useDispatch } from 'react-redux'
export const FavoriteContext = createContext<{ likeItems: any; setLikeItems: (items: any) => void }>({likeItems: [], setLikeItems: () => {}})

export default function Favorites() {
  // const  [likeItems, setLikeItems]  = useState([]);
  const [favItems, setFavItems] = useState<Pizza[]>([])
  const user = useSelector((state: RootState) => state.user.user)
  const { items, status } = useSelector(selectPizzaData);
  const params = useContext(GlobalContext);
  const dispatch = useDispatch()

  const userOptions: AxiosRequestConfig = {
    method: 'GET',
    url: `https://api.skyrodev.ru/user/${params.user}`,
  };
  async function getUser () {
    try {

      const { data } = await axios.request(userOptions);
      dispatch(setUser(data))
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error message:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }

  const favRequestOptions: AxiosRequestConfig ={
    method: "GET",
    url: `https://api.skyrodev.ru/favourites/${user?.id}`,
    headers: {
      "Content-Type": "application/json"}
  }

  async function getFav() {
    try {
      const response = await axios.request(favRequestOptions);
      const favIds = response.data.items.map((favItem: { product_id: number }) => favItem.product_id);
  
      // Фильтруем товары, оставляя только те, у которых id есть в избранном
      const matchedItems = items.filter((item) => favIds.includes(item.id));
      console.log(matchedItems)
      setFavItems(matchedItems);
    } catch (error) {
      console.error(error);
    }
  }
  

  useEffect(()=>{
    getUser();
    getFav();
  }, [])
  return (
    // <FavoriteContext.Provider value={{ likeItems, setLikeItems }}>
      <div className="h-full bg-white">
      {favItems.length > 0 ? (
        <div className="container container--cart">
          <div className="cart">
            <div className="flex w-full bg-red-600 px-3 py-5">
              <Link
                to="/"
                className="font-bold flex justify-between gap-1 items-center px-[10px] py-1 w-auto"
              >
                <img src={arrow_back} alt="" className="h-5 absolute" />
              </Link>
              <h1 className="text-white font-term text-2xl w-full text-center tracking-[6px] leading-5">
                ИЗБРАННОЕ
              </h1>
            </div>
            <div className="content__items">
              {favItems.map((item: any) => (
                <FavoriteItem key={item.id} {...item} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <EmptyFav />
      )}
    </div>
  );

}

