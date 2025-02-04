import { Link, redirect } from 'react-router-dom'
import { CartItem } from '../components/CartItem'
import { useSelector, useDispatch } from 'react-redux'
import { useContext, useState } from 'react'
import { clearItems, discount } from '../redux/cart/slice'
import { selectCart } from '../redux/cart/selectors'
import { HiPlusSm } from "react-icons/hi"
import { HiMinusSm } from "react-icons/hi"
import cutlery from '../assets/images/cutlery_2.svg'
import bus from '../assets/images/bus.svg'
import money from '../assets/images/money_hand.svg'
import commentImage from '../assets/images/list_items.svg'
import promo from '../assets/images/promocode.svg'
import arrow_back from '../assets/images/Arrow 5.svg'
import EmptyCart from './EmptyCart'
import axios from 'axios'
import qs from 'qs'
import React from 'react'
import { GlobalContext } from './router'
import cutlery_2 from '../assets/images/cutlery.svg'
import ukassa from '../assets/images/ukassa.svg'
import sbp from '../assets/images/sbp.svg'
import cash from '../assets/images/cash.svg'
import $ from 'jquery'
import { selectComment } from '../redux/comment/selectors'
import "jquery"
import { useEffect } from 'react'
import '../scss/components/promo.css'
// import { JQuery } from 'jquery'

export default function Cart({ initialCount = 1 }) {

  const dispatch = useDispatch()
  const { totalCount, totalPrice, items } = useSelector(selectCart)
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

  const [isLoading, setIsLoading] = useState(true);

  // Эффект для скрытия прелоудера через 5 секунд
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Скрываем прелоудер
    }, 5000); // 5 секунд

    return () => clearTimeout(timer); // Очистка таймера при размонтировании компонента
  }, []);
  let sendData: any = {
    "number": Math.floor(Math.random() * 100000),
    "items": items,
    "total": totalPrice,
    "date": `${day}.${month}.${year}`,
    "address": "г. Южно-Сахалинск, ул. Мира 231/9",
    "state": "Отправлен",
    "isDelivery": true ? selectedOption === "ДОСТАВКА" : false,
    "payment": selectedOptionPay,
    "comment": comment,
    "cutlery": localStorage.getItem("spoonCount"),
    "client": userID
  }
  // console.log(params, sendData)
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


    axios.post(`https://api.kimchistop.ru/order/?chatID=${params.chatID}`, sendData)
    dispatch(clearItems())
    // window.location.href = `https://api.kimchistop.ru/payments/?amount=${totalPrice}&number=${sendData.number}`
    const tg = Telegram.WebApp
    tg.openLink(`https://ecom.alfabank.ru/standalone/pay/?depositFlag=1&logo=0&standalone_name=i-kimchistop65-api&currency%5B%5D=RUB&def=%7B%22name%22%3A%22amount%22%2C%22value%22%3A%22${totalPrice}%22%2C%22title%22%3A%22%D0%9E%D0%BF%D0%BB%D0%B0%D1%82%D0%B0+%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0+${sendData.number}%22%7D&showcase=constructor&language=ru`)


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
    // Проверка localStorage при загрузке компонента
    const promoStatus = localStorage.getItem("promocode");

    if (!promoStatus) {
      localStorage.setItem("promocode", "false");
    }

    const isPromoActive = localStorage.getItem("promocode") === "true";

    // Обновление состояния React
    setPromoActive(isPromoActive);
  }, []);

  React.useEffect(() => {
    saveToLocalStorage()
    axios.get(`https://api.kimchistop.ru/user/${params.user}`).then(e => {
      setUserData(e.data)
      setUserID(e.data.id)
    })
  }, [count])

  // let img = ""
  // if(selectedOption === "ДОСТАВКА"){
  //   img = "../assets/images/bus.svg"
  // } else{
  //   img = '../assets/images/cutlery_2.svg'
  // }

  return (
    <div className="content">
      {items.length > 0 ? (
        <div className="container container--cart">
          <div className="cart pb-[7vh] h-auto">
            <div className="w-full  bg-headerNav bg-cover flex justify-center items-center">
              <h1 className="text-white font-term text-2xl w-full text-center tracking-[5px] leading-5 px-5 py-5">
                корзина
              </h1>
            </div>
            <div className="content__items">
              {items.map((item: any) => (
                <CartItem key={item.id} {...item} />
              ))}
            </div>
            <div className="cart__bottom">
              {/* <div className='flex w-full justify-between px-2 py-2 bg-[#F1F1F1] border-b-[1px] border-[#A2A2A2]'>
                <span className='uppercase font-term text-2xl'> Итого: </span>
                <p className='uppercase font-term text-2xl'>{totalPrice} P</p>
              </div>
              <div className='bg-[#F1F1F1] px-2 py-2 border-b-[1px] border-[#A2A2A2]'>
                <p className='text-[10px] font-roboto font-bold'>Призаказе от 2000р Батат фри с пармезаном всего за 120р Для получения скидки добавьте блюдо в заказ самостоятельно его можно найти в разделе Закуски</p>
              </div> */}

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
              {/* <div className='flex w-full justify-between px-2 py-2 bg-[#F1F1F1] border-b-[1px] border-[#A2A2A2]'>
                <span className='uppercase font-term text-2xl'> Итого: </span>
                <p className='uppercase font-term text-2xl'>{totalPrice} P</p>
              </div>
              <div className='bg-[#F1F1F1] px-2 py-2 border-b-[1px] border-[#A2A2A2]'>
                <p className='text-[10px] font-roboto font-bold'>Призаказе от 2000р Батат фри с пармезаном всего за 120р Для получения скидки добавьте блюдо в заказ самостоятельно его можно найти в разделе Закуски</p>
              </div> */}

              <div className="flex justify-between px-2 py-4 items-center border-[#A2A2A2] promo-block">
                <div className="input-container">
                  <input placeholder="Add Item" type="text" />
                  <button className="button">Add</button>
                </div>
              </div>
              <div className="fixed w-[100vw] flex flex-col items-center justify-center left-0 px-5 bottom-[125px]">
                <div className="flex w-full justify-between px-2 py-2 bg-[#F1F1F1] border-b-[1px] border-[#A2A2A2]">
                  <span className="uppercase font-term text-2xl"> Итого: </span>
                  <p className="uppercase font-term text-2xl">{totalPrice} P</p>
                </div>
                <div className="bg-[#F1F1F1] px-2 py-2 border-b-[1px] border-[#A2A2A2]">
                  <p className="text-[10px] font-roboto font-bold">
                    Призаказе от 2000р Батат фри с пармезаном всего за 120р Для
                    получения скидки добавьте блюдо в заказ самостоятельно его
                    можно найти в разделе Закуски
                  </p>
                </div>
              </div>

              <div className="hidden flex justify-between px-2 py-4 items-center bg-[#F1F1F1] border-b-[1px] border-[#A2A2A2] promo-actived">
                <div className="flex items-center gap-4 ml-2">
                  <img src={promo} alt="" />
                  <div className="flex flex-col gap-1">
                    <h1 className="text-lg font-term pl-2">
                      Промокод KIMCHI10 активирован!
                    </h1>
                  </div>
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