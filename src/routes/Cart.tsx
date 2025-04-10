import { Link, redirect } from 'react-router-dom'
import { CartItem } from '../components/CartItem'
import { useSelector, useDispatch } from 'react-redux'
import { useContext, useState } from 'react'
import { clearItems, discount } from '../redux/cart/slice'
import { selectCart } from '../redux/cart/selectors'
import { HiPlusSm } from "react-icons/hi"
import { HiMinusSm } from "react-icons/hi"
import cutlery from '../assets/images/cutlery_2.svg'
import EmptyCart from './EmptyCart'
import axios, { AxiosRequestConfig } from 'axios'
import React from 'react'
import { GlobalContext } from './router'
import { selectComment } from '../redux/comment/selectors'
import "jquery"
import { useEffect } from 'react'
import '../scss/components/promo.css'
import { RootState } from '../redux/store'
import { selectPizzaData } from '../redux/pizza/selectors'
import userSlice, { setUser } from '../redux/user/slice'
import { API_BASE_URL } from '../config/apiConfig'

export default function Cart({ initialCount = 1 }) {

  const dispatch = useDispatch()
  // const { totalCount, totalPrice, items } = useSelector(selectCart)
  const [userID, setUserID] = React.useState<number>()
  const [userData, setUserData] = React.useState({})
  const [promoactive, setPromoactive] = React.useState(false)
  const params = useContext(GlobalContext)
  const { comment } = useSelector(selectComment)
  const year: any = new Date().getFullYear()
  const month: any = new Date().getMonth() + 1
  const day: any = new Date().getDate()
  const selectedOption = localStorage.getItem("selectedOption")
  const selectedOptionPay = localStorage.getItem("selectedOptionPay")
  const [promo, setPromo] = useState(""); // Состояние для ввода промокода
  const [promoError, setPromoError] = useState(""); // Состояние для ошибки
  const [promoActive, setPromoActive] = useState(false);
  const user = useSelector((state: RootState) => state.user.user)
  const {items, status} = useSelector(selectPizzaData)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [TotalPrice, setTotalPrice] = useState(0)
    

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Скрываем прелоудер
    }, 5000); // 5 секунд

    return () => clearTimeout(timer); // Очистка таймера при размонтировании компонента
  }, []);
  let sendData: any = {
    "number": Math.floor(Math.random() * 100000),
    "items": items,
    // "total": totalPrice,
    "date": `${day}.${month}.${year}`,
    "address": "г. Южно-Сахалинск, ул. Мира 231/9",
    "state": "Отправлен",
    "isDelivery": true ? selectedOption === "ДОСТАВКА" : false,
    "payment": selectedOptionPay,
    "comment": comment,
    "cutlery": localStorage.getItem("spoonCount"),
    "client": user?.id
  }
  const onClickPromo = () => {
    if (promo === "") {
      setPromoError("Введите промокод");
      return;
    }

    // Проверка на валидный промокод (регистр не имеет значения)
    if (promo.toLowerCase() === "kimchi10") {
      dispatch(discount());
      setPromoError(""); // Очистка ошибок
      setPromoActive(true); // Устанавливаем промокод как активный
      setPromo(""); // Очищаем поле ввода
      localStorage.setItem("promocode", "true"); // Сохраняем в localStorage
    } else {
      setPromoError("Данный промокод не действителен или истёк!"); // Ошибка для неверного промокода
    }
  };

  const onClickPay = () => {
    axios.post(`${API_BASE_URL}/order/?chatID=${params.chatID}`, sendData);
    dispatch(clearItems());
    // window.location.href = `https://api.kimchistop.ru/payments/?amount=${totalPrice}&number=${sendData.number}`
    const tg = Telegram.WebApp
    // tg.openLink(`https://ecom.alfabank.ru/standalone/pay/?depositFlag=1&logo=0&standalone_name=i-kimchistop65-api&currency%5B%5D=RUB&def=%7B%22name%22%3A%22amount%22%2C%22value%22%3A%22${totalPrice}%22%2C%22title%22%3A%22%D0%9E%D0%BF%D0%BB%D0%B0%D1%82%D0%B0+%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0+${sendData.number}%22%7D&showcase=constructor&language=ru`)
  }
  const [count, setCount] = useState(initialCount)

  const handleIncrement = () => {
    setCount(count + 1)
  }

  const handleDecrement = () => {
    if (count > 0) {
      setCount(count - 1)
    }
  }
  const saveToLocalStorage = () => {
    localStorage.setItem('spoonCount', count.toString())
  }
  
  const loadFromLocalStorage = () => {
    const storedCount = localStorage.getItem('spoonCount')
    if (storedCount) {
      setCount(parseInt(storedCount))
    }
  }
  useEffect(() => {
    const promoStatus = localStorage.getItem("promocode");

    if (!promoStatus) {
      localStorage.setItem("promocode", "false");
    }

    const isPromoActive = localStorage.getItem("promocode") === "true";

    setPromoActive(isPromoActive);
  }, []);

  const userOptions: AxiosRequestConfig = {
    method: 'GET',
    url: `${API_BASE_URL}/user/${params.user}`,
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

  const cartRequestOptions:  AxiosRequestConfig ={
    method: "GET",
    // url: `${API_BASE_URL}/cart/data/${user?.id}`,
    url: `${API_BASE_URL}/cart/data`,
    params: { user_id: user?.id },
    headers: {
      "Content-Type": "application/json"}
  }

  async function getCart() {
    try {
      const response = await axios.request(cartRequestOptions);
      let cart = response.data.cart;
      let cartData: any[] = [];

      if (Array.isArray(cart)) {
        // Если пришёл массив, осуществляем обычное мапирование
        cartData = cart.map((item: any) =>
          typeof item === 'number' ? { id: item.toString(), quantity: 1 } : item
        );
      } else if (typeof cart === 'object' && cart !== null) {
        // Преобразуем объект { [productId]: quantity } в массив объектов
        cartData = Object.keys(cart).map((key) => ({
          id: key,
          quantity: cart[key],
        }));
      } else {
        console.warn("Unexpected cart format:", cart);
      }

      setCartItems(cartData);
    } catch (error) {
      console.error(error);
    }
  }

  async function getCartTotalPrice() {
    try {
      const response = await axios.request(cartRequestOptions)
      setTotalPrice(response.data.totalPrice)
    } catch (error) {
      console.error(error)
    }
  }




  React.useEffect(() => {
    saveToLocalStorage()
    // axios.get(`https://api.skyrodev.ru/user/${params.user}`).then(e => {
    //   setUserData(e.data)
    //   setUserID(e.data.id)
    // })
    getUser();
    getCart();
    getCartTotalPrice()
    console.log(cartItems)
  }, [count])

  return (
    <div className="content">
      {cartItems.length > 0 ? (
        <div className="container container--cart">
          <div className="cart pb-[7vh] h-auto">
            <div className="w-full  bg-headerNav bg-cover flex justify-center items-center">
              <h1 className="text-white font-term text-2xl w-full text-center tracking-[5px] leading-5 px-5 py-5">
                корзина
              </h1>
            </div>
            <div className="content__items">
              {cartItems.map((item: any) => (
                <CartItem key={item.id} {...item} />
              ))}
            </div>
            <div className="cart__bottom">
              <div className="flex justify-between px-2 py-2 items-center bg-[#F1F1F1] border-b-[1px] border-[#A2A2A2] w-full">
                <div className="flex items-center gap-2">
                  <img src={cutlery} alt="" />
                  <div className="flex flex-col gap-1">
                    <h2 className="font-term text-xl leading-3">ПРИБОРЫ</h2>
                    <p className="font-roboto text-[10]">бесплатно</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="border-2 border-stone-800 rounded-full px-[2px] py-[2px]"
                    onClick={handleDecrement}
                  >
                    <HiMinusSm />
                  </button>
                  <p className="font-bold font-roboto">{count}</p>
                  <button
                    className="border-2 border-stone-800 rounded-full px-[2px] py-[2px]"
                    onClick={handleIncrement}
                  >
                    <HiPlusSm />
                  </button>
                </div>
              </div>
              <div className='flex justify-between px-2 py-2 items-center bg-[#9e9999] border-b-[1px] border-[#A2A2A2] w-full'>
                  <input type="text" placeholder='email для отправки чека' className='w-full px-[10px] py-[10px] text-lg rounded-xl mb-[65px]'/>
              </div>
              {/* <div className="flex justify-between px-2 py-4 items-center border-[#A2A2A2] promo-block">
                <div className="input-container">
                  <input placeholder="Add Item" type="text" />
                  <button className="button">Add</button>
                </div>
              </div> */}
              <div className="fixed w-[100vw] flex flex-col items-center justify-center left-0 px-5 bottom-[125px]">
                <div className="flex w-full justify-between px-2 py-2 bg-[#F1F1F1] border-b-[1px] border-[#A2A2A2]">
                  <span className="uppercase font-term text-2xl"> Итого: </span>
                  <p className="uppercase font-term text-2xl">{TotalPrice} P</p>
                </div>
                <div className="bg-[#F1F1F1] px-2 py-2 border-b-[1px] border-[#A2A2A2]">
                  <p className="text-[10px] font-roboto font-bold">
                    Призаказе от 2000р Батат фри с пармезаном всего за 120р Для
                    получения скидки добавьте блюдо в заказ самостоятельно его
                    можно найти в разделе Закуски
                  </p>
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={onClickPay}
                  className="fixed bottom-0 bg-blue-600 w-full left-0 py-5 rounded-t-2xl z-10"
                >
                  <span className="uppercase font-bold font-term text-white text-xl tracking-widest">
                    Оплатить сейчас
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EmptyCart />
      )}
    </div>
  );
}