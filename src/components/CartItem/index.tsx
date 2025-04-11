import React, { useState, startTransition, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addItem, minusItem, removeItem } from '../../redux/cart/slice'
import { CartItem as CartItemType } from '../../redux/cart/types'
import { HiPlusSm, HiMinusSm } from "react-icons/hi"
import { RxCross2 } from "react-icons/rx"
import axios, { AxiosRequestConfig } from 'axios'
import { RootState } from '../../redux/store'
import { API_BASE_URL } from '../../config/apiConfig'

type CartItemProps = {
  id: string,
  image: string,
  foodName: string,
  price: number,
  quantity: number,
  description: string,
  refreshCart?: (id: string) => void
}

export const CartItem: React.FC<CartItemProps> = ({
  id = '0',
  image = '',
  foodName = '',
  price = 0,
  quantity = 0,
  description = '',
  refreshCart,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  
  // Локальное состояние для мгновенного обновления количества
  const [localQuantity, setLocalQuantity] = useState(quantity);

  useEffect(() => {
    if (!CartItem) {
      setLocalQuantity(0); // Сбрасываем локальное состояние, если товар удален из корзины
    }
  }, [CartItem]);

  // Функция для полного удаления товара с сервера
  async function deleteFromCart(quantityToRemove: number) {
    const options: AxiosRequestConfig = {
      method: 'DELETE',
      url: `${API_BASE_URL}/cart/remove`,
      params: { product_id: id, user_id: user?.id, quantity: quantityToRemove },
      headers: { 'Content-Type': 'application/json' },
    };
    try {
      const { data } = await axios.request(options);
      console.log("Удалено на сервере:", data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error message:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }

  // Функция для уменьшения количества товара на 1 (без удаления)
  const decrementToCart = async () => {
    try {
      await axios.request({
        method: 'POST',
        url: `${API_BASE_URL}/cart/add`,
        params: { user_id: user?.id, product_id: id, quantity: -1 },
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Ошибка при уменьшении количества товара:', error);
    }
  };

  // Функция для добавления товара (увеличение на 1)
  const addToCart = async () => {
    if (!user?.id) {
      console.error("Пользователь не определён");
      return;
    }
    try {
      await axios.request({
        method: 'POST',
        url: `${API_BASE_URL}/cart/add`,
        params: { user_id: user?.id, product_id: id, quantity: 1 },
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error("Ошибка при добавлении товара:", error);
    }
  };

  const onClickPlus = async () => {
    startTransition(() => {
      setLocalQuantity((prev) => prev + 1);
      dispatch(addItem({ id } as CartItemType));
    });
    await addToCart(); // Обновляем сервер
  };

  const onClickMinus = async () => {
    startTransition(() => {
      if (localQuantity > 1) {
        setLocalQuantity((prev) => prev - 1);
        dispatch(minusItem(id));
      } else {
        onClickRemove();
      }
    });
    await decrementToCart(); // Обновляем сервер
  };

  const onClickRemove = async () => {
    if (window.confirm('Вы точно хотите удалить товар?')) {
      // Мгновенно удаляем товар из UI:
      dispatch(removeItem(id));
      if (refreshCart) {
        refreshCart(id);
      }
      // Отправляем запрос на удаление с сервера
      await deleteFromCart(localQuantity);
    }
  };

  return (
    <div className='flex justify-between bg-[#F1F1F1] border-[1px] border-[#A2A2A2] py-2 px-2 gap-2'>
      <div className='flex justify-center items-center'>
        <Link to={`/${id}`}>
          <img className='w-[100px] h-[80px] rounded-[20px]' src={image} alt='Product' />
        </Link>
      </div>
      <div className='w-[165px]'>
        <Link to={`/${id}`} className='flex flex-col gap-1'>
          <h3 className='font-term text-xl leading-4 overflow-hidden whitespace-nowrap text-ellipsis'>{foodName}</h3>
          <p className='font-next text-[6px] leading-2 overflow-hidden whitespace-nowrap text-ellipsis'>{description}</p>
        </Link>
        <div className='flex items-center gap-2 mt-2'>
          <button
            disabled={localQuantity === 0}
            onClick={onClickMinus}
            className='px-[2px] py-[2px] border-2 border-stone-600 rounded-full text-center'
          >
            <HiMinusSm />
          </button>
          <b>{localQuantity}</b>
          <button
            onClick={onClickPlus}
            className='px-[2px] py-[2px] border-2 border-stone-600 rounded-full text-center'
          >
            <HiPlusSm />
          </button>
        </div>
      </div>
      <div className='flex flex-col w-[100px] self-center items-center gap-1'>
        <div className="mt-[-30px] ml-[50px] absolute">
          <div onClick={onClickRemove} className='border-2 border-stone-600 rounded-full px-1 py-1 cursor-pointer'>
            <RxCross2 />
          </div>
        </div>
        <div className='text-right'>
          <b className='text-xl font-term text-stone-600'>{price * localQuantity} P</b>
        </div>
      </div>
    </div>
  );
};