import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addItem, minusItem, removeItem } from '../../redux/cart/slice'
// import { removeItem } from '../../redux/favorite/favSlice'
import { CartItem as CartItemType } from '../../redux/cart/types'
import { RxCross2 } from "react-icons/rx";
import { CartItem } from '../../redux/cart/types'
import { selectCartItemById } from '../../redux/cart/selectors'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { removeItemFav } from '../../redux/favorite/favSlice'
import { FavoriteContext } from '../../routes/Favorites'
import axios, { AxiosRequestConfig } from 'axios';

import { GlobalContext } from '../../routes/router'
import { HiPlusSm } from "react-icons/hi"
import { HiMinusSm } from "react-icons/hi"
import { RootState } from '../../redux/store'

type FavoriteItemProps = {
  id: string,
  image: string,
  name: string,
  price: number,
  quantity: number,
  description: string
}
type CartItemProps = {
  id: string,
  image: string,
  name: string,
  price: number,
  quantity: number,
  description: string
}
export const FavoriteItem: React.FC<CartItemProps> = ({
  id = '0',
  image = '',
  name = '',
  price = 0,
  quantity = 0,
  description = ''
}) => {
  const dispatch = useDispatch()
  const {likeItems, setLikeItems} = useContext(FavoriteContext)
  const cartItem2 = useSelector(selectCartItemById(id))
  const [isCounter, setIsCounter] = useState(localStorage.getItem('isCounter') === 'true')
  const addedCount2 = cartItem2 ? cartItem2.count: 0
  const params = useContext(GlobalContext);
  const user = useSelector((state: RootState)=> state.user.user)
  const [localQuantity, setLocalQuantity] = useState(quantity);

  // const onClickPlus = () => {
  //   dispatch(
  //     addItem({
  //       id,
  //     } as CartItemType),
  //   )
  // }
  const [selectedOptionFav, setSelectedOption] = useState<string>("")

  // const onClickMinus = () => {
  //   if (addedCount === 1){
  //     onClickRemove()
  //     setIsCounter(false)
  //   } 
  //   if (addedCount > 1) dispatch(minusItem(id))
  // }
  // const onClickRemoveFav = () => {
  //   axios.patch(`https://api.skyrodev.ru/user/${params.user}/fav?favourite_item=${id}`).then(res => {
  //     setLikeItems(res.data)
  //     console.log(likeItems)
  //   })
  // }
  // const onClickRemove = () => {
  //   if (window.confirm('Вы точно хотите удалить товар?')) {
  //     dispatch(removeItem(id))
  //   }
  // }

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
      await deleteFromCart(); // 🔹 Отправляем запрос в API
    }
  };

  const onClickRemove = async () => {
    if (window.confirm('Вы точно хотите удалить товар?')) {
      setLocalQuantity(0); // 🔹 Убираем товар сразу
      dispatch(removeItem(id));
      await deleteFromCart(); // 🔹 Удаляем из API
    }
  };

  const optionsFav: AxiosRequestConfig = {
    method: 'PATCH',
    url: 'https://api.skyrodev.ru/favourites/update',
    headers: { 'Content-Type': 'application/json' },
    data: {product_id: id, user_id: user?.id}
  };
  
  async function addToFav() {
    try {
      const { data } = await axios.request(optionsFav);
      console.log(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error message:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }

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
  const handleAddToCart = () => {
    const item: CartItem = {
      id,
      name,
      price,
      image,
      count: 0,
      description,
      isCounter: true,
      quantity: 1,
    }
    dispatch(addItem(item))
    setIsCounter(true)
    localStorage.setItem('count', addedCount.toString())
    localStorage.setItem('isCounter', (isCounter === true).toString())
    console.log(isCounter)
  }
  const onClickFav = () => {
    localStorage.setItem(`likeButton_${id}`, JSON.stringify(false));
    addToFav();
  };
  const cartItem = useSelector(selectCartItemById(id))
  const addedCount = cartItem ? cartItem.count : 0
  return (

      <div className='flex justify-between bg-[#F1F1F1] border-b-2 border-stone-700 py-2 px-2 gap-2'>

        <div className='flex justify-center items-center'>
          <Link key={id} to={`/${id}`}>
            <img
              className='w-[100px] h-[90px] rounded-[20px]'
              src={image}
              alt='Pizza'
            />
          </Link>
        </div>
        <div className='w-[165px]'>
          <Link key={id} to={`/${id}`} className='gap-2 flex flex-col'>
            <h3 className='font-term text-xl leading-4 overflow-hidden whitespace-nowrap text-ellipsis'>{name}</h3>
            <p className='font-next text-[6px] leading-2 overflow-hidden whitespace-nowrap text-ellipsis'>{description}</p>
          </Link>
          {quantity > 0 ? (
              // <div className='flex gap-2 w-10 justify-between items-center mt-4 13mini:mt-2'>
              //   <button onClick={onClickMinus} className='border-2 border-black rounded-full px-1 py-1 leading-3 text-center flex items-center'><HiMinusSm/></button>
              //   <span className='font-bold font-next'>{addedCount}</span>
              //   <button onClick={onClickPlus} className='border-2 border-black rounded-full px-1 py-1 leading-3 text-center flex items-center'><HiPlusSm/></button>
              // </div>
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
               ) : (
                <div className='mt-4'>
                    <button
                      onClick={addToCart}
                      className='border-2 border-[#ABABAB] w-[30vw] py-1 rounded-md landing-1 uppercase font-next text-[10px] font-bold text-center 12pro:w-[28vw] 13mini:mt-2'>
                      Добавить
                      {/* {addedCount > 0 && <i className='text-[10px] font-next font-bold bg-black text-white px-[5px] py-[2px] rounded-full ml-2'>{addedCount}</i>} */}
                    </button>
                </div>
               )}
        </div>
        <div className='flex flex-col w-[90px] self-center items-center gap-1'>
          <div className='text-right'>
            <b className='text-xl font-term color w-[80px] text-right text-stone-600'>{price}P</b>
          </div>
          <div onClick={onClickFav} className='border-2 border-stone-600 rounded-full px-1 py-1'>
            <div className=''><RxCross2 /></div>
          </div>
        </div>
      </div>
  )
}