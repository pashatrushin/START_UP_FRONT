import { Link } from 'react-router-dom'
import arrow_back from '../assets/images/Arrow 5.svg'
export default function EmptyCart(){

  return (
    <>
            <div className="w-full  bg-headerNav bg-cover flex justify-center items-center">
              <h1 className="text-white font-term text-2xl w-full text-center tracking-[5px] leading-5 px-5 py-5">
                Корзниа
              </h1>
            </div>
      <div className='h-[76vh] bg-white flex flex-col justify-center items-center gap-9 text-center'>
        {/* <div> */}
        <h1 className="text-[40px] font-term text-center leading-10 tracking-widest relative">КОРЗИНА
          ПУСТАЯ</h1>
        <p className="font-next text-center leading-5 tracking-widest font-[100] text-[13px] relative">Добавьте что-то из меню чтобы сделать заказ</p>
        <Link to='/' className="bg-red-600 text-white px-7 py-2 rounded-md uppercase font-next font-bold">На Главную</Link>
        {/* </div> */}
      </div>
    </>
  )
}