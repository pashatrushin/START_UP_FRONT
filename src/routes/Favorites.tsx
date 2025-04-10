import { Link } from 'react-router-dom';
import { FavoriteItem } from '../components/FavoriteItem';
import arrow_back from '../assets/images/Arrow 5.svg';
import { useEffect, useState } from 'react';
import EmptyFav from './EmptyFav';
import axios, { AxiosRequestConfig } from 'axios';
import { RootState } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { API_BASE_URL } from '../config/apiConfig';
import { setUser } from '../redux/user/slice';
import { Pizza } from '../redux/pizza/types';
import { useContext } from 'react';
import { GlobalContext } from './router';
export default function Favorites() {
  const [favItems, setFavItems] = useState<Pizza[]>([]); // Состояние для избранных товаров
  const user = useSelector((state: RootState) => state.user.user); // Получаем текущего пользователя
  const allItems = useSelector((state: RootState) => state.pizza.items); // Все товары из Redux Store
  const dispatch = useDispatch();
  const params = useContext(GlobalContext);

  // Опции для получения данных пользователя
  const userOptions: AxiosRequestConfig = {
    method: 'GET',
    url: `${API_BASE_URL}/user/${params.user}`,
  };

  // Функция для получения данных пользователя
  async function getUser() {
    try {
      const { data } = await axios.request(userOptions);
      dispatch(setUser(data));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error message:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }

  // Опции для получения избранных товаров
  const favRequestOptions: AxiosRequestConfig = {
    method: 'GET',
    url: `${API_BASE_URL}/favorites/`,
    params: { user_id: user?.id },
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Функция для получения избранных товаров
  async function getFav() {
    try {
      const response = await axios.request(favRequestOptions);
      const favIds = Array.isArray(response.data.favorites) // Проверяем, что favorites - массив
        ? response.data.favorites
        : [];

      // Фильтруем товары, оставляя только те, которые есть в избранном
      const matchedItems = allItems.filter((item) => favIds.includes(Number(item.id)));
      setFavItems(matchedItems);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  }

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    getUser();
    getFav();
  }, [dispatch]);

  return (
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
              {favItems.map((item) => (
                <FavoriteItem key={item.id} {...item} image={item.image[0]} />
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

