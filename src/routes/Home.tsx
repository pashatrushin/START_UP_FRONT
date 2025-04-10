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
import userSlice from '../redux/user/slice'
// import { FavoriteContext } from "./Favorites";
import axios from "axios";
import "../scss/components/menu.css";
import { FaHome, FaHeart, FaSearch, FaUser } from "react-icons/fa";
import Preloader from "./Preloader";
import food1 from "../assets/images/food1.png";
import food2 from "../assets/images/food2.png";
import food3 from "../assets/images/food3.png";
import "../scss/components/slider.css";
import "../scss/components/buttons_slider.css";
import "../scss/components/card.css";
import "../scss/components/adds.css";
export const Home: React.FC = () => {
  const images = [food1, food2, food3];
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
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {images.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            currentIndex === index ? "bg-red-500" : "bg-white"
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="w-full h-60 bg-[#FFFFFF] mt-5">
                  <div className="w-full flex items-center justify-center h-full gap-5">
                  <div className="card_adds">
                    <div className="img">
                      <div className="save">
                        <svg
                          className="svg"
                          width="683"
                          height="683"
                          viewBox="0 0 683 683"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_993_25)">
                            <mask
                              id="mask0_993_25"
                              maskUnits="userSpaceOnUse"
                              x="0"
                              y="0"
                              width="683"
                              height="683"
                            >
                              <path
                                d="M0 -0.00012207H682.667V682.667H0V-0.00012207Z"
                                fill="white"
                              ></path>
                            </mask>
                            <g mask="url(#mask0_993_25)">
                              <path
                                d="M148.535 19.9999C137.179 19.9999 126.256 24.5092 118.223 32.5532C110.188 40.5866 105.689 51.4799 105.689 62.8439V633.382C105.689 649.556 118.757 662.667 134.931 662.667H135.039C143.715 662.667 151.961 659.218 158.067 653.09C186.451 624.728 270.212 540.966 304.809 506.434C314.449 496.741 327.623 491.289 341.335 491.289C355.045 491.289 368.22 496.741 377.859 506.434C412.563 541.074 496.752 625.242 524.816 653.348C530.813 659.314 538.845 662.667 547.308 662.667C563.697 662.667 576.979 649.395 576.979 633.019V62.8439C576.979 51.4799 572.48 40.5866 564.447 32.5532C556.412 24.5092 545.489 19.9999 534.133 19.9999H148.535Z"
                                stroke="#CED8DE"
                                strokeWidth="40"
                                strokeMiterlimit="10"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></path>
                            </g>
                          </g>
                          <defs>
                            <clipPath id="clip0_993_25">
                              <rect
                                width="682.667"
                                height="682.667"
                                fill="white"
                              ></rect>
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                    </div>

                    <div className="text">
                      <p className="h3"> Meeting your Colleagues </p>
                      <p className="p"> 6 Video - 40 min </p>

                      <div className="icon-box">
                        <svg
                          version="1.1"
                          className="svg"
                          id="Capa_1"
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          x="0px"
                          y="0px"
                          viewBox="0 0 512.001 512.001"
                          xmlBase="http://www.w3.org/2000/svg"
                          enableBackground="new 0 0 512.001 512.001"
                          xmlSpace="preserve"
                        >
                          <g>
                            <path
                              style={{ fill: "#3D6687" }}
                              d="M165,68.715l-26.327-26.327l37.363-37.363c3.739-3.739,9.801-3.739,13.54,0l12.786,12.786
		c3.739,3.739,3.739,9.801,0,13.54L165,68.715z"
                            ></path>
                            <path
                              style={{ fill: "#3D6687" }}
                              d="M234.998,101.725l-26.327-26.327l37.363-37.363c3.739-3.739,9.801-3.739,13.54,0l12.786,12.786
		c3.739,3.739,3.739,9.801,0,13.54L234.998,101.725z"
                            ></path>
                            <path
                              style={{ fill: "#3D6687" }}
                              d="M445.507,349.222l26.327,26.327l37.363-37.363c3.739-3.739,3.739-9.801,0-13.54l-12.787-12.787
		c-3.739-3.739-9.801-3.739-13.54,0L445.507,349.222z"
                            ></path>
                            <path
                              style={{ fill: "#3D6687" }}
                              d="M408.054,279.224l26.327,26.327l37.363-37.363c3.739-3.739,3.739-9.801,0-13.54l-12.786-12.786
		c-3.739-3.739-9.801-3.739-13.54,0L408.054,279.224z"
                            ></path>
                          </g>
                          <g>
                            <path
                              style={{ fill: "#CCDFED" }}
                              d="M443.378,458.836L276.261,234.948L52.372,67.83c-7.845-5.856-8.673-17.309-1.75-24.232
		l22.953-22.954c10.277-10.277,25.733-13.35,39.158-7.785l272.626,112.989l112.989,272.626c5.564,13.427,2.491,28.882-7.785,39.158
		l-22.953,22.953C460.688,467.51,449.234,466.683,443.378,458.836z"
                            ></path>
                            <path
                              style={{ fill: "#CCDFED" }}
                              d="M181.785,507.029L104.93,404.848L2.75,327.993c-3.349-2.518-3.694-7.418-0.73-10.381l11.782-11.782
		c7.939-7.939,19.965-10.129,30.193-5.499l113.895,51.558l51.558,113.895c4.63,10.228,2.439,22.254-5.499,30.193l-11.783,11.782
		C189.203,510.722,184.303,510.378,181.785,507.029z"
                            ></path>
                          </g>
                          <g>
                            <path
                              style={{ fill: "#BAD5E5" }}
                              d="M209.448,465.784l-17.656-39.003l0,0L180.8,437.772c-9.575,9.575-25.407,8.461-33.546-2.361
		l-31.288-41.599l-0.098,0.097L7.359,312.273l0,0l-5.34,5.34c-2.963,2.963-2.618,7.862,0.73,10.381l102.181,76.855l76.855,102.181
		c2.518,3.349,7.418,3.694,10.381,0.73l11.783-11.783C211.887,488.038,214.078,476.012,209.448,465.784z"
                            ></path>
                            <path
                              style={{ fill: "#BAD5E5" }}
                              d="M497.749,427.311c0.462-0.999,0.894-2.01,1.261-3.045c0.754-2.12,1.283-4.309,1.628-6.528
		c0.991-6.38,0.291-13.038-2.289-19.265l-16.424-39.63l-1.043-2.517c-0.973,7.762-4.471,15.169-10.243,20.941l-22.953,22.953
		c-6.923,6.923-18.375,6.096-24.232-1.75L290.651,220.557L52.357,41.862l-1.735,1.735c-4.549,4.549-5.73,11.047-3.795,16.634
		c1.01,2.917,2.855,5.589,5.545,7.597l145.464,108.579l78.425,58.539l58.539,78.425l108.579,145.464
		c2.008,2.691,4.681,4.535,7.597,5.545c5.587,1.935,12.086,0.754,16.635-3.795l22.953-22.953
		C493.61,434.588,496.005,431.079,497.749,427.311z"
                            ></path>
                          </g>
                          <path
                            style={{ fill: "#399AEA" }}
                            d="M104.914,432.283L104.914,432.283c-17.494,8.348-35.767-9.925-27.419-27.419l0,0
	c18.554-38.883,42.253-75.095,70.46-107.661L341.791,73.417c28.676-33.108,69.054-53.832,112.672-57.831l11.885-1.089
	c16.568-1.519,30.453,12.365,28.935,28.934l-1.089,11.885c-3.999,43.617-24.724,83.995-57.831,112.672L212.576,361.824
	C180.009,390.03,143.799,413.73,104.914,432.283z"
                          ></path>
                          <path
                            style={{ fill: "#399AEA" }}
                            d="M494.193,55.316l1.089-11.885c1.519-16.568-12.366-30.453-28.935-28.934l-11.885,1.089
	c-0.155,0.014-0.309,0.034-0.464,0.048c-4.103,43.439-24.793,83.633-57.783,112.208L81.614,428.357
	c5.715,5.643,14.603,8.077,23.3,3.926l0,0c38.883-18.553,75.095-42.253,107.661-70.459l223.786-193.836
	C469.469,139.311,490.194,98.934,494.193,55.316z"
                          ></path>
                          <path
                            style={{ fill: "#399AEA" }}
                            d="M400.892,56.26c-4.215-0.36-7.923,2.765-8.285,6.978c-0.36,4.214,2.765,7.924,6.978,8.285
	c22.969,1.966,36.702,15.7,38.667,38.667c0.161,1.871,0.981,3.528,2.213,4.76c1.542,1.542,3.729,2.418,6.071,2.218
	c4.215-0.361,7.339-4.07,6.978-8.285C450.92,78.531,431.246,58.856,400.892,56.26z"
                          ></path>
                          <path
                            style={{ fill: "#399AEA" }}
                            d="M446.539,117.17c4.215-0.361,7.339-4.07,6.978-8.285c-1.271-14.849-6.637-27.132-15.331-36.121
	c-2.36,4.942-4.957,9.768-7.785,14.46c4.392,6.071,7.067,13.778,7.853,22.967c0.161,1.871,0.981,3.528,2.213,4.76
	C442.01,116.493,444.197,117.371,446.539,117.17z"
                          ></path>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                        </svg>
                        <p className="span">Business Trip</p>
                      </div>
                    </div>
                  </div>


                  <div className="card_adds">
                    <div className="img">
                      <div className="save">
                        <svg
                          className="svg"
                          width="683"
                          height="683"
                          viewBox="0 0 683 683"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_993_25)">
                            <mask
                              id="mask0_993_25"
                              maskUnits="userSpaceOnUse"
                              x="0"
                              y="0"
                              width="683"
                              height="683"
                            >
                              <path
                                d="M0 -0.00012207H682.667V682.667H0V-0.00012207Z"
                                fill="white"
                              ></path>
                            </mask>
                            <g mask="url(#mask0_993_25)">
                              <path
                                d="M148.535 19.9999C137.179 19.9999 126.256 24.5092 118.223 32.5532C110.188 40.5866 105.689 51.4799 105.689 62.8439V633.382C105.689 649.556 118.757 662.667 134.931 662.667H135.039C143.715 662.667 151.961 659.218 158.067 653.09C186.451 624.728 270.212 540.966 304.809 506.434C314.449 496.741 327.623 491.289 341.335 491.289C355.045 491.289 368.22 496.741 377.859 506.434C412.563 541.074 496.752 625.242 524.816 653.348C530.813 659.314 538.845 662.667 547.308 662.667C563.697 662.667 576.979 649.395 576.979 633.019V62.8439C576.979 51.4799 572.48 40.5866 564.447 32.5532C556.412 24.5092 545.489 19.9999 534.133 19.9999H148.535Z"
                                stroke="#CED8DE"
                                strokeWidth="40"
                                strokeMiterlimit="10"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></path>
                            </g>
                          </g>
                          <defs>
                            <clipPath id="clip0_993_25">
                              <rect
                                width="682.667"
                                height="682.667"
                                fill="white"
                              ></rect>
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                    </div>

                    <div className="text">
                      <p className="h3"> Meeting your Colleagues </p>
                      <p className="p"> 6 Video - 40 min </p>

                      <div className="icon-box">
                        <svg
                          version="1.1"
                          className="svg"
                          id="Capa_1"
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          x="0px"
                          y="0px"
                          viewBox="0 0 512.001 512.001"
                          xmlBase="http://www.w3.org/2000/svg"
                          enableBackground="new 0 0 512.001 512.001"
                          xmlSpace="preserve"
                        >
                          <g>
                            <path
                              style={{ fill: "#3D6687" }}
                              d="M165,68.715l-26.327-26.327l37.363-37.363c3.739-3.739,9.801-3.739,13.54,0l12.786,12.786
		c3.739,3.739,3.739,9.801,0,13.54L165,68.715z"
                            ></path>
                            <path
                              style={{ fill: "#3D6687" }}
                              d="M234.998,101.725l-26.327-26.327l37.363-37.363c3.739-3.739,9.801-3.739,13.54,0l12.786,12.786
		c3.739,3.739,3.739,9.801,0,13.54L234.998,101.725z"
                            ></path>
                            <path
                              style={{ fill: "#3D6687" }}
                              d="M445.507,349.222l26.327,26.327l37.363-37.363c3.739-3.739,3.739-9.801,0-13.54l-12.787-12.787
		c-3.739-3.739-9.801-3.739-13.54,0L445.507,349.222z"
                            ></path>
                            <path
                              style={{ fill: "#3D6687" }}
                              d="M408.054,279.224l26.327,26.327l37.363-37.363c3.739-3.739,3.739-9.801,0-13.54l-12.786-12.786
		c-3.739-3.739-9.801-3.739-13.54,0L408.054,279.224z"
                            ></path>
                          </g>
                          <g>
                            <path
                              style={{ fill: "#CCDFED" }}
                              d="M443.378,458.836L276.261,234.948L52.372,67.83c-7.845-5.856-8.673-17.309-1.75-24.232
		l22.953-22.954c10.277-10.277,25.733-13.35,39.158-7.785l272.626,112.989l112.989,272.626c5.564,13.427,2.491,28.882-7.785,39.158
		l-22.953,22.953C460.688,467.51,449.234,466.683,443.378,458.836z"
                            ></path>
                            <path
                              style={{ fill: "#CCDFED" }}
                              d="M181.785,507.029L104.93,404.848L2.75,327.993c-3.349-2.518-3.694-7.418-0.73-10.381l11.782-11.782
		c7.939-7.939,19.965-10.129,30.193-5.499l113.895,51.558l51.558,113.895c4.63,10.228,2.439,22.254-5.499,30.193l-11.783,11.782
		C189.203,510.722,184.303,510.378,181.785,507.029z"
                            ></path>
                          </g>
                          <g>
                            <path
                              style={{ fill: "#BAD5E5" }}
                              d="M209.448,465.784l-17.656-39.003l0,0L180.8,437.772c-9.575,9.575-25.407,8.461-33.546-2.361
		l-31.288-41.599l-0.098,0.097L7.359,312.273l0,0l-5.34,5.34c-2.963,2.963-2.618,7.862,0.73,10.381l102.181,76.855l76.855,102.181
		c2.518,3.349,7.418,3.694,10.381,0.73l11.783-11.783C211.887,488.038,214.078,476.012,209.448,465.784z"
                            ></path>
                            <path
                              style={{ fill: "#BAD5E5" }}
                              d="M497.749,427.311c0.462-0.999,0.894-2.01,1.261-3.045c0.754-2.12,1.283-4.309,1.628-6.528
		c0.991-6.38,0.291-13.038-2.289-19.265l-16.424-39.63l-1.043-2.517c-0.973,7.762-4.471,15.169-10.243,20.941l-22.953,22.953
		c-6.923,6.923-18.375,6.096-24.232-1.75L290.651,220.557L52.357,41.862l-1.735,1.735c-4.549,4.549-5.73,11.047-3.795,16.634
		c1.01,2.917,2.855,5.589,5.545,7.597l145.464,108.579l78.425,58.539l58.539,78.425l108.579,145.464
		c2.008,2.691,4.681,4.535,7.597,5.545c5.587,1.935,12.086,0.754,16.635-3.795l22.953-22.953
		C493.61,434.588,496.005,431.079,497.749,427.311z"
                            ></path>
                          </g>
                          <path
                            style={{ fill: "#399AEA" }}
                            d="M104.914,432.283L104.914,432.283c-17.494,8.348-35.767-9.925-27.419-27.419l0,0
	c18.554-38.883,42.253-75.095,70.46-107.661L341.791,73.417c28.676-33.108,69.054-53.832,112.672-57.831l11.885-1.089
	c16.568-1.519,30.453,12.365,28.935,28.934l-1.089,11.885c-3.999,43.617-24.724,83.995-57.831,112.672L212.576,361.824
	C180.009,390.03,143.799,413.73,104.914,432.283z"
                          ></path>
                          <path
                            style={{ fill: "#399AEA" }}
                            d="M494.193,55.316l1.089-11.885c1.519-16.568-12.366-30.453-28.935-28.934l-11.885,1.089
	c-0.155,0.014-0.309,0.034-0.464,0.048c-4.103,43.439-24.793,83.633-57.783,112.208L81.614,428.357
	c5.715,5.643,14.603,8.077,23.3,3.926l0,0c38.883-18.553,75.095-42.253,107.661-70.459l223.786-193.836
	C469.469,139.311,490.194,98.934,494.193,55.316z"
                          ></path>
                          <path
                            style={{ fill: "#399AEA" }}
                            d="M400.892,56.26c-4.215-0.36-7.923,2.765-8.285,6.978c-0.36,4.214,2.765,7.924,6.978,8.285
	c22.969,1.966,36.702,15.7,38.667,38.667c0.161,1.871,0.981,3.528,2.213,4.76c1.542,1.542,3.729,2.418,6.071,2.218
	c4.215-0.361,7.339-4.07,6.978-8.285C450.92,78.531,431.246,58.856,400.892,56.26z"
                          ></path>
                          <path
                            style={{ fill: "#399AEA" }}
                            d="M446.539,117.17c4.215-0.361,7.339-4.07,6.978-8.285c-1.271-14.849-6.637-27.132-15.331-36.121
	c-2.36,4.942-4.957,9.768-7.785,14.46c4.392,6.071,7.067,13.778,7.853,22.967c0.161,1.871,0.981,3.528,2.213,4.76
	C442.01,116.493,444.197,117.371,446.539,117.17z"
                          ></path>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                        </svg>
                        <p className="span">Business Trip</p>
                      </div>
                    </div>
                  </div>

                  </div>
                </div>
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
                          <svg
                            width="32"
                            viewBox="0 -960 960 960"
                            height="32"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M226-160q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19ZM226-414q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19ZM226-668q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Z"></path>
                          </svg>
                        </div>
                      </div>
                      <div className="card-image">
                        <svg
                          width="48"
                          viewBox="0 -960 960 960"
                          height="48"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="m393-165 279-335H492l36-286-253 366h154l-36 255Zm-73 85 40-280H160l360-520h80l-40 320h240L400-80h-80Zm153-395Z"></path>
                        </svg>
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
                          <svg
                            width="32"
                            viewBox="0 -960 960 960"
                            height="32"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M226-160q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19ZM226-414q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19ZM226-668q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Z"></path>
                          </svg>
                        </div>
                      </div>
                      <div className="card-image">
                        <svg
                          width="48"
                          viewBox="0 -960 960 960"
                          height="48"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="m393-165 279-335H492l36-286-253 366h154l-36 255Zm-73 85 40-280H160l360-520h80l-40 320h240L400-80h-80Zm153-395Z"></path>
                        </svg>
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
                          <svg
                            width="32"
                            viewBox="0 -960 960 960"
                            height="32"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M226-160q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19ZM226-414q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19ZM226-668q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Z"></path>
                          </svg>
                        </div>
                      </div>
                      <div className="card-image">
                        <svg
                          width="48"
                          viewBox="0 -960 960 960"
                          height="48"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="m393-165 279-335H492l36-286-253 366h154l-36 255Zm-73 85 40-280H160l360-520h80l-40 320h240L400-80h-80Zm153-395Z"></path>
                        </svg>
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
  //  </FavoriteContext.Provider>
  );
};
