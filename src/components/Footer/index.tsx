import React from 'react'
import styles from './Footer.module.scss'
import wabisabi from '../../assets/images/wabisabi.svg'
import { FaHome, FaHeart, FaSearch, FaUser } from "react-icons/fa";
import menuSvg from '../../assets/images/menu.svg';
import { GiMilkCarton } from "react-icons/gi";
import { Link } from 'react-router-dom';
export const Footer: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-[100vw] px-5 h-[20px] fixed bottom-[82px] left-0 z-50">
    <div className="tab-nav-container">
      <div className="tab active purple">
        <Link to="/home">
          <FaHome size={20} />
        </Link>
        <a href="/home">
          <p>Главная</p>
        </a>
      </div>
      <div className="tab yellow">
        {/* <FaSearch size={20} className="i" /> */}
        <Link to="/">
          <img src={menuSvg} alt="" className="i" />
        </Link>
        {/* <svg width="800px" height="800px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M128 352.576V352a288 288 0 0 1 491.072-204.224 192 192 0 0 1 274.24 204.48 64 64 0 0 1 57.216 74.24C921.6 600.512 850.048 710.656 736 756.992V800a96 96 0 0 1-96 96H384a96 96 0 0 1-96-96v-43.008c-114.048-46.336-185.6-156.48-214.528-330.496A64 64 0 0 1 128 352.64zm64-.576h64a160 160 0 0 1 320 0h64a224 224 0 0 0-448 0zm128 0h192a96 96 0 0 0-192 0zm439.424 0h68.544A128.256 128.256 0 0 0 704 192c-15.36 0-29.952 2.688-43.52 7.616 11.328 18.176 20.672 37.76 27.84 58.304A64.128 64.128 0 0 1 759.424 352zM672 768H352v32a32 32 0 0 0 32 32h256a32 32 0 0 0 32-32v-32zm-342.528-64h365.056c101.504-32.64 165.76-124.928 192.896-288H136.576c27.136 163.072 91.392 255.36 192.896 288z"/></svg> */}
        <p>Меню</p>
      </div>
      <div className="tab pink">
        <Link to="/favorites">
          <FaHeart size={20} className="i" />
        </Link>
          <p>Избранное</p>
      </div>
      <div className="tab teal">
        {/* <FaUser size={20} className="i" /> */}
        <Link to={"/cart"}>
          <GiMilkCarton className="i w-[20px] h-[20px]" />
          {/* <FaHeart size={20} className="i" /> */}
        </Link>
        <p>Корзина</p>
      </div>
    </div>
  </div>
  )
}