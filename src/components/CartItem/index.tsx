import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import MinusCartSvg from '../../svg/MinusCartSvg'
import PlusCartSvg from '../../svg/PlusCartSvg'
import RemoveCartSvg from '../../svg/RemoveCartSvg'
import { useDispatch, useSelector } from 'react-redux'
import { addItem, minusItem, removeItem } from '../../redux/cart/slice'
import { CartItem as CartItemType } from '../../redux/cart/types'
import { HiPlusSm } from "react-icons/hi"
import { HiMinusSm } from "react-icons/hi"
import { RxCross2 } from "react-icons/rx"
import '../../scss/components/cart_item.css'
import axios, { AxiosRequestConfig } from 'axios';
import { RootState } from '../../redux/store'
type CartItemProps = {
  id: string,
  image: string,
  name: string,
  price: number,
  quantity: number,
  description: string
}

export const CartItem: React.FC<CartItemProps> = ({
  id = '0',
  image = '',
  name = '',
  price = 0,
  quantity = 0,
  description = ''
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  
  // 🔹 Локальное состояние для мгновенного обновления quantity
  const [localQuantity, setLocalQuantity] = useState(quantity);

  const onClickPlus = async () => {
    setLocalQuantity((prev) => prev + 1); // 🔹 Обновляем локально
    dispatch(addItem({ id } as CartItemType));
    await addToCart(); // 🔹 Отправляем запрос в API
  };

  const onClickMinus = async () => {
    if (localQuantity === 1) {
      onClickRemove();
    } else {
      setLocalQuantity((prev) => prev - 1); // 🔹 Обновляем локально
      dispatch(minusItem(id));
      await decrementToCart(); // 🔹 Отправляем запрос в API
    }
  };

  const onClickRemove = async () => {
    if (window.confirm('Вы точно хотите удалить товар?')) {
      setLocalQuantity(0); // 🔹 Убираем товар сразу
      dispatch(removeItem(id));
      await deleteFromCart(); // 🔹 Удаляем из API
    }
  };

  const options: AxiosRequestConfig = {
    method: 'DELETE',
    url: 'https://api.skyrodev.ru/cart/delete',
    params: {product_id: id ,user_id: user?.id}
  };

  async function deleteFromCart () {
    try {
      const { data } = await axios.request(options);
      console.log(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error message:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }

  const addToCart = async () => {
    try {
      await axios.request({
        method: 'POST',
        url: 'https://api.skyrodev.ru/cart/add',
        headers: { 'Content-Type': 'application/json' },
        data: { product_id: id, quantity: 1, user_id: user?.id },
      });
    } catch (error) {
      console.error('Ошибка при добавлении товара:', error);
    }
  };
  const decrementToCart = async () => {
    try {
      await axios.request({
        method: 'POST',
        url: 'https://api.skyrodev.ru/cart/add',
        headers: { 'Content-Type': 'application/json' },
        data: { product_id: id, quantity: -1, user_id: user?.id },
      });
    } catch (error) {
      console.error('Ошибка при добавлении товара:', error);
    }
  };
  return (
    <div className='flex justify-between bg-[#F1F1F1] border-[1px] border-[#A2A2A2] py-2 px-2 gap-2'>
      <div className='flex justify-center items-center'>
        <Link key={id} to={`/${id}`}>
          <img className='w-[100px] h-[80px] rounded-[20px]' src={image} alt='Pizza' />
        </Link>
      </div>
      <div className='w-[165px]'>
        <Link key={id} to={`/${id}`} className='gap-2 flex flex-col'>
          <h3 className='font-term text-xl leading-4 overflow-hidden whitespace-nowrap text-ellipsis'>{name}</h3>
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
          <div onClick={onClickRemove} className='border-2 border-stone-600 rounded-full px-1 py-1'>
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