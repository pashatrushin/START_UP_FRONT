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
import { store, useAppDispatch } from "../redux/store";
import { selectFilter } from "../redux/filter/selectors";
import { Category } from "../redux/filter/types";
import { fetchPizzas } from "../redux/pizza/asyncActions";
import { selectPizzaData } from "../redux/pizza/selectors";
import { redirect, useNavigate } from "react-router-dom";
import menuSvg from "../assets/images/menu.svg";
import Cart from "./Cart";
import Error from "./Error";
import { Link } from "react-router-dom";
import arrow_back from "../assets/images/Arrow 5.svg";
import { GlobalContext } from "./router";
import { userState } from "../redux/user/slice";
import { FavoriteContext } from "./Favorites";
import axios from "axios";
import "../scss/components/menu.css";
import { FaHome, FaHeart, FaSearch, FaUser } from "react-icons/fa";
import Preloader from "./Preloader";
import food1 from '../assets/images/food1.png';
import food2 from '../assets/images/food2.png';
import food3 from '../assets/images/food3.png';
import "../scss/components/slider.css";
import '../scss/components/buttons_slider.css'
import '../scss/components/card.css'
export const Home: React.FC = () => {

  const images = [
    food1,
    food2,
    food3,
  ];
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMounted = useRef(false);
  const userParams = useContext(GlobalContext);
  const [likeItems, setLikeItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const { category, sort, currentPage, searchValue } =
    useSelector(selectFilter);
  const { items, status } = useSelector(selectPizzaData);

  const onChangeCategory = React.useCallback(
    (idx: Category) => {
      dispatch(setCategory(idx));
    },
    [dispatch]
  );

  const onChangePage = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const getPizzas = async () => {
    // const sortBy = sort.sortProperty.replace('-', '')
    const sortBy = "hierarchicalId";
    const order = sort.sortProperty.includes("-") ? "asc" : "desc";
    const categoryId = category.id > 0 ? String(category.id) : "";
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
  // useEffect(() => {
  //     // Инициализация Owl Carousel
  //     $(".custom-carousel").owlCarousel({
  //       autoWidth: true,
  //       loop: true,
  //     });

  //     // Обработчик для кликов
  //     $(".custom-carousel .item").on("click", function () {
  //       $(".custom-carousel .item").not($(this)).removeClass("active");
  //       $(this).toggleClass("active");
  //     });
  //   }, []);
  // Если изменили параметры и был первый рендер


  // Slider


  const handleNextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart && touchEnd) {
      // Свайп вправо
      if (touchStart - touchEnd > 50) handleNextSlide();
      // Свайп влево
      if (touchEnd - touchStart > 50) handlePrevSlide();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };


  useLayoutEffect(() => {
    if (isMounted.current) {
      const params = {
        categoryId: category.id > 0 ? category.id : null,
        currentPage: currentPage,
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
        // document.body.style.background = clickedTabBGColor;
      });
    });
  });
  isMounted.current = true;

  const sortedItems = [...items].sort((a: any, b: any) => a.id - b.id);
  const pizzas = sortedItems.map((obj: any) => (
    <PizzaBlock key={obj.id} {...obj} />
  ));
  // const pizzas = items.map((obj: any) => <PizzaBlock key={obj.id} {...obj} />)
  const skeletons = [...new Array(4)].map((_, index) => (
    <Skeleton key={index} />
  ));

  return (
    // <FavoriteContext.Provider value={{likeItems, setLikeItems}}>
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
                Главная
              </h1>
            </div>
            <div className="container">
              <div className="info__wrapper"></div>
              <div className="pt-5 pb-12">
                <div className="px-5">
                  <div
                    className="w-full h-44 bg-white rounded-2xl overflow-hidden relative"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    {/* Слайды */}
                    <div
                      className="flex transition-transform duration-500"
                      style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                      }}
                    >
                      {images.map((src, index) => (
                        <div
                          key={index}
                          className="w-full h-44 flex-shrink-0 flex items-center justify-center"
                        >
                          <img
                            src={src}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Кнопки навигации */}
                    {/* <button
                      onClick={handlePrevSlide}
                      className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-red-500 text-white rounded-full p-2 opacity-75 hover:opacity-100"
                    > */}
                     
                    {/* </button> */}
                    {/* <div className="button-container">
                        <button className="button-3d">
                          <div className="button-top">
                            <span className="material-icons">❮</span>
                          </div>
                          <div className="button-bottom"></div>
                          <div className="button-base"></div>
                        </button>
                        <button className="button-3d">
                          <div className="button-top">
                            <span className="material-icons">❯</span>
                          </div>
                          <div className="button-bottom"></div>
                          <div className="button-base"></div>
                          &#8594;
                        </button>
                      </div> */}
                    {/* <button
                      onClick={handleNextSlide}
                      className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-red-500 text-white rounded-full p-2 opacity-75 hover:opacity-100"
                    >
                    </button> */}

                    {/* Индикаторы */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {images.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            currentIndex === index
                              ? "bg-red-500"
                              : "bg-white"
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="w-full h-60 bg-[#FF6165] mt-5"></div>
                <div className="w-full grid grid-cols-2 grid-rows-2 gap-2 justify-center px-5 mt-5">
                  <div className="bg-transparent w-full h-24 rounded-xl flex justify-center items-center">
                     <h1 className="uppercase font-bold">Мой Бонус</h1>
                  </div>
                  <div className="w-full h-24 rounded-xl">
                  <div className="card red">
                      <div className="card-content">
                        <div className="card-top">
                          <span className="card-title">01.</span>
                          <p>Lightning.</p>
                        </div>
                        <div className="card-bottom">
                          <p>Hover Me?</p>
                          <svg width="32" viewBox="0 -960 960 960" height="32" xmlns="http://www.w3.org/2000/svg"><path d="M226-160q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19ZM226-414q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19ZM226-668q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Z"></path></svg>
                        </div>
                      </div>
                      <div className="card-image">
                        <svg width="48" viewBox="0 -960 960 960" height="48" xmlns="http://www.w3.org/2000/svg"><path d="m393-165 279-335H492l36-286-253 366h154l-36 255Zm-73 85 40-280H160l360-520h80l-40 320h240L400-80h-80Zm153-395Z"></path></svg>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-24 rounded-xl">
                  <div className="card yellow-bg">
                      <div className="card-content">
                        <div className="card-top">
                          <span className="card-title">01.</span>
                          <p>Lightning.</p>
                        </div>
                        <div className="card-bottom">
                          <p>Hover Me?</p>
                          <svg width="32" viewBox="0 -960 960 960" height="32" xmlns="http://www.w3.org/2000/svg"><path d="M226-160q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19ZM226-414q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19ZM226-668q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Z"></path></svg>
                        </div>
                      </div>
                      <div className="card-image">
                        <svg width="48" viewBox="0 -960 960 960" height="48" xmlns="http://www.w3.org/2000/svg"><path d="m393-165 279-335H492l36-286-253 366h154l-36 255Zm-73 85 40-280H160l360-520h80l-40 320h240L400-80h-80Zm153-395Z"></path></svg>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-24 rounded-xl">
                  <div className="card white">
                      <div className="card-content">
                        <div className="card-top">
                          <span className="card-title">01.</span>
                          <p>Lightning.</p>
                        </div>
                        <div className="card-bottom">
                          <p>Hover Me?</p>
                          <svg width="32" viewBox="0 -960 960 960" height="32" xmlns="http://www.w3.org/2000/svg"><path d="M226-160q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19ZM226-414q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19ZM226-668q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Z"></path></svg>
                        </div>
                      </div>
                      <div className="card-image">
                        <svg width="48" viewBox="0 -960 960 960" height="48" xmlns="http://www.w3.org/2000/svg"><path d="m393-165 279-335H492l36-286-253 366h154l-36 255Zm-73 85 40-280H160l360-520h80l-40 320h240L400-80h-80Zm153-395Z"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    // </FavoriteContext.Provider>
  );
};
