import React, {
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
  useContext,
} from "react";
import qs from "qs";
import { useSelector } from "react-redux";
import {
  categoriesList,
  Сategories,
  sortList,
  SortPopup,
  PizzaBlock,
  Skeleton,
  Search,
  Pagination,
  InfoBox,
} from "../components";
import { setCategory, setCurrentPage, setFilters } from "../redux/filter/slice";
import { SearchPizzaParams } from "../redux/pizza/types";
import { RootState, store, useAppDispatch } from "../redux/store";
import { selectFilter } from "../redux/filter/selectors";
import { Category } from "../redux/filter/types";
import { fetchPizzas } from "../redux/pizza/asyncActions";
import { selectPizzaData } from "../redux/pizza/selectors";
import { redirect, useNavigate } from "react-router-dom";
import menuSvg from '../assets/images/menu.svg';
import { GiMilkCarton } from "react-icons/gi";
import Cart from "./Cart";
import Error from "./Error";
import { Link } from "react-router-dom";
import arrow_back from "../assets/images/Arrow 5.svg";
import { GlobalContext } from "./router";
import userSlice, { setUser } from '../redux/user/slice'
// import { FavoriteContext } from "./Favorites";
import axios, {AxiosRequestConfig} from "axios";
import "../scss/components/menu.css";
import { FaHome, FaHeart, FaSearch, FaUser } from "react-icons/fa";
import Preloader from "./Preloader";
import {User} from '../interfaces/user'
import Categories from "./Categories";
import { API_BASE_URL } from '../config/apiConfig';
const categoriesList2 = [
  { id: 0, name: 'Популярное' },
  { id: 2506, name: 'Говядина' },
  { id: 2424, name: 'Морепродукты' },
  { id: 2425, name: 'Без мяса' },
  { id: 2426, name: 'Свинина острая' },
  { id: 2427, name: 'Свинина неострая' },
  { id: 2424, name: 'Супы' },
  { id: 2516, name: 'Сосиски' },
  { id: 2465, name: 'Фри' },
  { id: 2423, name: 'Курица' },
  { id: 2552, name: 'Добавки' },
  { id: 2441, name: 'Соусы' },
  { id: 2475, name: 'Бар' },
  { id: 2528, name: 'Холодильник' },
  { id: 2476, name: 'Десерты' },
]
export const Catalog: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMounted = useRef(false);
  const userParams = useContext(GlobalContext);
  const [likeItems, setLikeItems] = useState([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const { category, sort, currentPage, searchValue } =
    useSelector(selectFilter);
  const { items, status } = useSelector(selectPizzaData);
  const params = useContext(GlobalContext);

  const onChangeCategory = React.useCallback(
    (idx: Category) => {
      dispatch(setCategory(idx));
    },
    [dispatch]
  );

  const onChangePage = (page: number) => {
    dispatch(setCurrentPage(page));
  };


  // UserOptions

  // const userOptions: AxiosRequestConfig = {
  //   method: 'GET',
  //   url: `${API_BASE_URL}/user/${params.user}`,
  // };
  // async function getUser () {
  //   try {

  //     const { data } = await axios.request(userOptions);
  //     dispatch(setUser(data))
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       console.error('Error message:', error.message);
  //     } else {
  //       console.error('Unexpected error:', error);
  //     }
  //   }
  // }

  // useEffect(() => {
  //   getUser();
  // }, [dispatch])

  useEffect(() => {
    let tgUserNick;
    let tgUserId;
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
      tgUserNick = tgUser.username;
      tgUserId = tgUser.id;
  
      // Если есть username — ищем по нему, иначе по id
      const userUrl = tgUserNick
        ? `${API_BASE_URL}/user/${tgUserNick}`
        : `${API_BASE_URL}/user/id/${tgUserId}`;
  
      axios.get(userUrl)
        .then(res => {
          console.log("tgNick", res.data.nickname);
          console.log("DATA", res.data);
          localStorage.setItem('tgParams', JSON.stringify(res.data));
          // Делаем setstate только если nickname определён
          if (res.data.nickname) {
            fetch(`https://music-shop24.ru/user/setstate?nickname=${encodeURIComponent(res.data.nickname)}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }
            });
          } else {
            console.warn('nickname отсутствует в ответе backend!');
          }
        });
      console.log('tgUser.id:', tgUserId, 'tgUser.username:', tgUserNick);
    } else {
      // fallback для локальной разработки
      tgUserId = 1;
      console.log('Локальный режим, используем тестовый tgUserId:', tgUserId);
      axios.get(`${API_BASE_URL}/user/id/${tgUserId}`)
        .then(res => {
          localStorage.setItem('tgParams', JSON.stringify(res.data));
          if (res.data.nickname) {
            fetch(`https://music-shop24.ru/user/setstate?nickname=${encodeURIComponent(res.data.nickname)}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }
            });
          }
        });
    }
  }, []);

  const getPizzas = async () => {
    // const sortBy = sort.sortProperty.replace('-', '')
    const sortBy = "hierarchicalId";
    const order = sort.sortProperty.includes("-") ? "asc" : "desc";
    // const categoryId = category.id > 0 ? String(category.id) : "";
    const categoryId = category.id > 0 ? String(category.id) : '';
    const search = searchValue;

    dispatch(
      fetchPizzas({
        sortBy,
        order,
        category: categoryId,
        search,
        currentPage: String(currentPage),
      })
    );
    window.scrollTo(0, 0);
  };

  // Если изменили параметры и был первый рендер
  useLayoutEffect(() => {
    if (isMounted.current) {
      const params = {
        categoryId: category.id > 0 ? category.id : null,
        // currentPage: currentPage,
      };

      const queryString = qs.stringify(params, { skipNulls: true });
      navigate(`#/?${queryString}`);
    }
    if (window.location.search) {
      const params = qs.parse(
        window.location.search.substring(1)
      ) as unknown as SearchPizzaParams;
      const sortObj = sortList.find(
        (obj) => obj.sortProperty === params.sortBy
      );
      const categoryObj = categoriesList.find(
        (obj) => obj.id === Number(params.category)
      );
      dispatch(
        setFilters({
          searchValue: params.search,
          category: categoryObj || categoriesList[0],
          currentPage: Number(params.currentPage),
          sort: sortObj || sortList[0],
        })
      );
    }
    getPizzas();
  }, [category.id, currentPage]);
  useEffect(() => {
    // Get all the tabs
    const tabs = document.querySelectorAll(".tab");

    tabs.forEach((clickedTab) => {
      // Add onClick event listener on each tab
      clickedTab.addEventListener("click", () => {
        // Remove the active class from all the tabs (this acts as a "hard" reset)
        tabs.forEach((tab) => {
          tab.classList.remove("active");
        });

        // Add the active class on the clicked tab
        clickedTab.classList.add("active");
        const clickedTabBGColor =
          getComputedStyle(clickedTab).getPropertyValue("color");
        console.log(clickedTabBGColor);
      });
    });
  });
  // Парсим параметры при первом рендере
  useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(
        window.location.search.substring(1)
      ) as unknown as SearchPizzaParams;
      const sort = sortList.find((obj) => obj.sortProperty === params.sortBy);
      const category = categoriesList.find(
        (obj) => obj.id === Number(params.category)
      );

      dispatch(
        setFilters({
          searchValue: params.search,
          category: category || categoriesList[0],
          currentPage: Number(params.currentPage),
          sort: sort || sortList[0],
        })
      );
    }
    isMounted.current = true;
  }, [dispatch, userParams.user]);

  const filteredItems = selectedCategory
  ? items.filter((item) => item.category === selectedCategory)
  : items;

// Сортируем: сначала категории с большим id, потом с меньшим
  const sortedItems = [...filteredItems].sort((a: any, b: any) => a.id - b.id);

  const pizzas = sortedItems.map((obj: any) => (
    <PizzaBlock key={obj.id} {...obj} />
  ));

  // const pizzas = items.map((obj: any) => <PizzaBlock key={obj.id} {...obj} />)
  const skeletons = [...new Array(4)].map((_, index) => (
    <Skeleton key={index} />
  ));
React.useEffect(() => {
  // console.log(items)
  items.map((item)=>{
    if(item.category == 2506)
      console.log(item)
  })
})
  return (
    // <FavoriteContext.Provider value={{ likeItems, setLikeItems }}>
      <div>
        {status === "error" ? (
          <div>
            <div>
              <div className="flex w-full  bg-red-600 px-3 py-5">
                <Link
                  to={`/`}
                  className="font-bold flex justify-between gap-1 items-center px-[10px] py-1 w-auto"
                >
                  <img src={arrow_back} alt="" className="h-5 absolute" />
                </Link>
                <h1 className="text-white font-term text-2xl w-full text-center tracking-[5px] leading-5">
                  ОШИБКА
                </h1>
              </div>
              <div>
                <div className="container">
                  <Error />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div>
              <div className="w-full  bg-headerNav bg-cover flex justify-center items-center">
                <h1 className="text-white font-term text-2xl w-full text-center tracking-[5px] leading-5 px-5 py-5">
                  МЕНЮ
                </h1>
              </div>
              <div className="warning text-center px-2 py-[0px] bg-white">
                <h1 className="font-term kor_love text-[12px] pt-[5px]">
                  ВНИМЕНИЕ ЛЮБИТЕЛЯМ КОРЕЙСКОЙ ЕДЫ!
                </h1>
                <p className="mt-2 font-sans font-medium text-[11.5px]  top-[-3px] relative">
                  Адрес навынос: г. Южно-Сахалинск, ул. Мира 231/9
                </p>
                <p className="font-sans font-medium text-[11.5px] top-[-5px] relative">
                  Принимаем заказы: ежедневно с 10:00 до 21:30
                </p>
              </div>
              <div className="container">
                <div className="content__top">
                  {/* <Сategories
                  value={category}
                  onChangeCategory={onChangeCategory}
                /> */}
                  <Categories
                    categories={categoriesList2}
                    selectedCategory={selectedCategory || 0}
                    onSelectCategory={setSelectedCategory}
                  />
                </div>
                <div className="info__wrapper"></div>
                <div className="grid grid-cols-2 gap-3 overflow-hidden overflow-y-scroll px-2 pb-[100px] pt-5">
                  {status === "loading" ? <Preloader /> : pizzas}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    // </FavoriteContext.Provider>
  );
};
