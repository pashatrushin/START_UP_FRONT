import { useState, useEffect, useContext } from "react";
// import { addItem } from '../redux/cart/slice'
import { GlobalLoader } from "../components/GlobalLoader";
import { useSelector, useDispatch } from "react-redux";
import PlusSvg from "../svg/PlusSvg";
import { useParams, useNavigate } from "react-router-dom";
import axios, { AxiosRequestConfig } from 'axios';
// import { addItem } from '../redux/cart/slice'
// import { addItemFav } from '../redux/favorite/favSlice'
import { selectCartItemById } from "../redux/cart/selectors";
import { CartItem } from "../redux/cart/types";
import { FavItem } from "../redux/favorite/types_fav";
import heart_img from "../assets/images/heart_img.svg";
import heart_active from "../assets/images/heart.png";
import { Link } from "react-router-dom";
import arrow_back from "../assets/images/Arrow 5.svg";
// import { FavoriteContext } from "./Favorites";
import $ from "jquery";
import { CartItem as CartItemType } from "../redux/cart/types";
import qs, { ParsedQs } from "qs";
import { GlobalContext } from "./router";
import { addItem, minusItem, removeItem } from "../redux/cart/slice";
import { HiPlusSm } from "react-icons/hi";
import { HiMinusSm } from "react-icons/hi";
import "../scss/components/add_button.css";
import "../scss/components/add_button.css";
import { RootState } from "../redux/store";
import { API_BASE_URL } from '../config/apiConfig';
const typeNames = ["тонкое", "традиционное"];

export type PizzaBlockProps = {
  id: string;
  image: string;
  name: string;
  description: string;
  price: number;
  count: number;
};

export const Detail = () => {
  const [likeItems, setLikeItems] = useState([]);
  const params = useParams();
  const paramss = useContext(GlobalContext);
  const navigate = useNavigate();
  // const cartItem = useSelector(selectCartItemById(params.id as string))
  const [activeType, setactiveType] = useState(0);
  const [activeSize, setActiveSize] = useState(0);
  const [loading, setLoading] = useState(true);
  const [checkButton, setCheckButton] = useState("");
  const [pizza, setPizza] = useState<PizzaBlockProps>({
    id: "0",
    image: "",
    name: "",
    description: "",
    price: 0,
    count: 0,
  });
  const dispatch = useDispatch();
  // const cartItem = useSelector(selectCartItemById(id))
  const onClickSize = (i: number) => setActiveSize(i);
  const onClickType = (i: number) => setactiveType(i);
  const cartItem = useSelector(selectCartItemById(pizza.id));
  var [isCounter, setIsCounter] = useState(
    localStorage.getItem("isCounter") === "true"
  );
  const counter = cartItem ? cartItem.isCounter : false;
  const addedCount = cartItem ? cartItem.count : 0;
  const user = useSelector((state: RootState)=> state.user.user)
  const getStorageValue = (key: string, defaultValue: any): any => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      console.error(error);
      return defaultValue;
    }
  };
  // useEffect(() => {
  //   axios
  //     .get(`https://api.skyrodev.ru/user/${paramss.user}/fav`)
  //     .then((e) => setLikeItems(e.data))
  //     .catch((error) => console.error("Error fetching favorites:", error));
  // }, []);

  const setStorageValue = (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };
  const [isLiked, setIsLiked] = useState<boolean>();
  // getStorageValue(`likeButton_${id}`, false)
  // );
  const checkbutton: any = () => {
    return likeItems.find((item: any) => item.id === pizza.id)
      ? heart_active
      : heart_img;
  };

  // useEffect(() => {
  //   // Устанавливаем начальное состояние кнопки "лайк"
  //   setCheckButton(pizza.isLiked ? 'liked-icon-url' : 'unliked-icon-url');
  // }, [pizza.isLiked]); // Обновляем состояние при изменении pizza.isLiked

  // const handleLikeClick = () => {
  //   // Переключаем состояние "лайкнутого" статуса
  //   const newCheckButton = checkButton === 'liked-icon-url' ? 'unliked-icon-url' : 'liked-icon-url';
  //   setCheckButton(newCheckButton);

  //   // Дополнительно, обновляем pizza.isLiked на сервере или в глобальном состоянии
  //   // pizza.isLiked = !pizza.isLiked; // Пример, обновить состояние
  // };

  const handleClick = () => {
    setIsLiked(!isLiked);
    // setStorageValue(`likeButton_${id}`, !isLiked);
  };
  const onClickAdd = () => {
    const item: CartItem = {
      id: pizza.id,
      name: pizza.name,
      description: pizza.description,
      price: pizza.price,
      image: pizza.image,
      count: pizza.count,
      isCounter: true,
      quantity: 0
    };
    dispatch(addItem(item));
  };
  // const PizzaBlock: React.FC<PizzaBlockProps> = ({
  //   id = '0',
  //   image = '',
  //   foodName = '',
  //   price = 0,
  //   description = '',
  // }) => {
  // const onClickAdd = () => {
  //   const item: CartItem = {
  //     id,
  //     foodName,
  //     price,
  //     image,
  //     count: 0,
  //     description,
  //   }
  //   dispatch(addItem(item))
  // }

  const onClickAddFav = () => {
    const item_fav: FavItem = {
      id: pizza.id,
      name: pizza.name,
      description: pizza.description,
      price: pizza.price,
      image: pizza.image,
      count: pizza.count,
      isCounter: true,
      quantity: 0
    };
    dispatch(addItem(item_fav));
  };
  // const onClickFav = () => {
  //   axios
  //     .patch(
  //       `https://api.skyrodev.ru/user/${paramss.user}/fav?favourite_item=${pizza.id}`
  //     )
  //     .then((res) => {
  //       setLikeItems(res.data);
  //       localStorage.setItem("likeItems", JSON.stringify(res.data));
  //     });
  // };
  const handleAddToCart = () => {
    const item: CartItem = {
      id: pizza.id,
      name: pizza.name,
      description: pizza.description,
      price: pizza.price,
      image: pizza.image,
      count: pizza.count,
      isCounter: true,
      quantity: 0
    };
    dispatch(addItem(item));
    // setIsCounter(true)
    if (addedCount > 0) {
      isCounter = true;
      localStorage.setItem("isCounter", (isCounter === true).toString());
    } else {
      isCounter = false;
      localStorage.setItem("isCounter", (isCounter === false).toString());
    }
    console.log(isCounter);
  };


  const options: AxiosRequestConfig = {
    method: 'POST',
    url: `${API_BASE_URL}/cart/add`,
    headers: { 'Content-Type': 'application/json' },
    params: {product_id: pizza.id, quantity: 1,user_id: user?.id}
  };
  
  async function addToCart() {
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

  const decrementToCart = async () => {
    try {
      await axios.request({
        method: 'POST',
        url: `${API_BASE_URL}/cart/add`,
        headers: { 'Content-Type': 'application/json' },
        params: { product_id: pizza.id, quantity: -1, user_id: user?.id },
      });
    } catch (error) {
      console.error('Ошибка при добавлении товара:', error);
    }
  };

  const optionsDelete: AxiosRequestConfig = {
    method: 'DELETE',
    url: `${API_BASE_URL}/cart/delete`,
    params: {product_id: pizza.id ,user_id: user?.id}
  };

  async function deleteFromCart () {
    try {
      const { data } = await axios.request(optionsDelete);
      console.log(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error message:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }
  const onClickRemove = () => {
    if (window.confirm("Вы точно хотите удалить товар?")) {
      dispatch(removeItem(pizza.id));
    }
    deleteFromCart();
  };
  const onClickPlus = () => {
    dispatch(
      addItem({
        id: pizza.id,
      } as CartItemType)
    );
    addToCart();
  };

  const onClickMinus = () => {
    if (addedCount === 1) {
      onClickRemove();
      setIsCounter(false);
    }
    if (addedCount > 1) dispatch(minusItem(pizza.id));
    decrementToCart();
  };


  const optionsFav: AxiosRequestConfig = {
    method: 'PATCH',
    url: `${API_BASE_URL}/favorites/update`,
    headers: { 'Content-Type': 'application/json' },
    data: {product_id: pizza.id, user_id: user?.id}
  };
  async function addToFav() {
    try {
      const { data } = await axios.request(optionsFav);
      setLikeItems(data);
      localStorage.setItem("likeItems", JSON.stringify(data));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error message:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }

  const onClickFav = () => {
    setIsLiked(!isLiked);
    localStorage.setItem(`likeButton_${pizza.id}`, JSON.stringify(!isLiked));
    addToFav();
  };
  useEffect(() => {
    async function fetchPizza() {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/food/${params.id}`
        );

        setPizza(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        alert("Ошибка при получении товара!");
        navigate("/");
      }
    }

    fetchPizza();
  }, [params.id, navigate]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="content">
      <div className="w-full  bg-headerNav bg-cover flex justify-center items-center">
        <h1 className="text-white font-term text-2xl w-full text-center tracking-[5px] leading-5 px-5 py-5">
          {pizza.name}
        </h1>
      </div>
      <div>
        <div className="pizza-block-wrapper">
          <div className="pizza-detail-block bg-white rounded-xl w-full">
            <div className="flex w-full h-[300px] justify-center">
              <div className="w-full h-[300px] relative">
                <img
                  className="w-full rounded-t-xl h-[300px]"
                  src={pizza.image}
                  alt="Food"
                />
                {/* <div className="before w-14 h-14 absolute top-5 right-5 bg-transparent rounded-full border-2 border-white px-2 py-2"> */}
                  {/* <div className="w-full h-full flex justify-center items-center"> */}
                    {/* <div className="heart-container" title="Like">
                      <input type="checkbox" className="checkbox" checked={isLiked} id="Give-It-An-Id"     onChange={() => {
                          onClickFav();
                          setIsLiked(!isLiked); // обновление состояния isLiked при каждом клике
                        }} />
                      <div className="svg-container">
                        <svg
                          viewBox="0 0 24 24"
                          className="svg-outline"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z"></path>
                        </svg>
                        <svg
                          viewBox="0 0 24 24"
                          className="svg-filled"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"></path>
                        </svg>
                        <svg
                          className="svg-celebrate"
                          width="100"
                          height="100"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <polygon points="10,10 20,20"></polygon>
                          <polygon points="10,50 20,50"></polygon>
                          <polygon points="20,80 30,70"></polygon>
                          <polygon points="90,10 80,20"></polygon>
                          <polygon points="90,50 80,50"></polygon>
                          <polygon points="80,80 70,70"></polygon>
                        </svg>
                      </div>
                    </div> */}
                  {/* </div> */}
                {/* </div> */}
              </div>
            </div>
            <div className="bg-white rounded-t-2xl top-[-30px] relative">
              <div className="flex justify-between items-center w-full px-2">
                <h4 className="font-term uppercase text-xl pl-3 pt-2">
                  {pizza.name}
                </h4>
                <h4 className="font-term uppercase text-4xl pl-3 tracking-[5px] text-[#474747] pt-2">
                  {pizza.price}P
                </h4>
              </div>
              <div className="font-roboto text-l text-[14px] pl-3 text-[#5F5F5F] w-[70vw]">
                {pizza.description}
              </div>
              <div className="flex justify-between px-3 py-3 items-center relative top-[20px]">
                <div className="flex w-full justify-end items-center h-full">
                  <div className="flex justify-between">
                    <div className="container_addbutton">
                      <div className="toggle" onClick={onClickPlus}>
                        <input type="checkbox" />
                        <span className="button"></span>
                        <span className="label">+</span>
                      </div>
                      <p className="text-4xl font-bold font-term">
                        {addedCount}
                      </p>
                      <div className="toggle" onClick={onClickMinus}>
                        <input type="checkbox" />
                        <span className="button"></span>
                        <span className="label">-</span>
                      </div>
                    </div>
                    {/* {addedCount > 0 ? (
                      <div className="gap-2">
                        <button
                          onClick={onClickMinus}
                          className="border-2 border-black rounded-full px-1 py-1"
                        >
                          <HiMinusSm />
                        </button>
                        <span className="font-bold font-next mx-2">
                          {addedCount}
                        </span>
                        <button
                          onClick={onClickPlus}
                          className="border-2 border-black rounded-full px-1 py-1"
                        >
                          <HiPlusSm />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <button
                          onClick={handleAddToCart}
                          className="border-2 border-[#ABABAB] px-[18vw] py-2 rounded-md landing-1 uppercase font-next text-[15px] font-bold text-center"
                        >
                          Добавить
                        </button>
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <button onClick={handleAddToCart} className="w-full px-4">
            <div className="container_button">
              <div className="left-side">
                <div className="card_button">
                  <div className="card-line"></div>
                  <div className="buttons"></div>
                </div>
                <div className="post">
                  <div className="post-line"></div>
                  <div className="screen">
                    <div className="dollar">$</div>
                  </div>
                  <div className="numbers"></div>
                  <div className="numbers-line2"></div>
                </div>
              </div>
              <div className="right-side">
                <div className="new">New Transaction</div>

                <svg
                  viewBox="0 0 451.846 451.847"
                  height="512"
                  width="512"
                  xmlns="http://www.w3.org/2000/svg"
                  className="arrow"
                >
                  <path
                    fill="#cfcfcf"
                    data-old_color="#000000"
                    className="active-path"
                    data-original="#000000"
                    d="M345.441 248.292L151.154 442.573c-12.359 12.365-32.397 12.365-44.75 0-12.354-12.354-12.354-32.391 0-44.744L278.318 225.92 106.409 54.017c-12.354-12.359-12.354-32.394 0-44.748 12.354-12.359 32.391-12.359 44.75 0l194.287 194.284c6.177 6.18 9.262 14.271 9.262 22.366 0 8.099-3.091 16.196-9.267 22.373z"
                  ></path>
                </svg>
              </div>
            </div>
          </button> */}
        </div>
      </div>
    </div>
  );
};
