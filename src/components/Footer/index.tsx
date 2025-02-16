import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaHeart } from "react-icons/fa";
import { GiMilkCarton } from "react-icons/gi";
import menuSvg from '../../assets/images/menu.svg';

export const Footer: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex justify-center items-center w-[100vw] px-5 h-[20px] fixed bottom-[82px] left-0 z-50">
      <div className="tab-nav-container">
        <div className={`tab purple ${location.pathname === "/home" ? "active" : ""}`}>
          <Link to="/home">
            <FaHome size={20} />
          </Link>
          <p>Главная</p>
        </div>

        <div className={`tab yellow ${location.pathname === "/" ? "active" : ""}`}>
          <Link to="/">
            <img src={menuSvg} alt="Меню" className="i" />
          </Link>
          <p>Меню</p>
        </div>

        <div className={`tab pink ${location.pathname === "/favorites" ? "active" : ""}`}>
          <Link to="/favorites">
            <FaHeart size={20} className="i" />
          </Link>
          <p>Избранное</p>
        </div>

        <div className={`tab teal ${location.pathname === "/cart" ? "active" : ""}`}>
          <Link to="/cart">
            <GiMilkCarton className="i w-[20px] h-[20px]" />
          </Link>
          <p>Корзина</p>
        </div>
      </div>
    </div>
  );
};
