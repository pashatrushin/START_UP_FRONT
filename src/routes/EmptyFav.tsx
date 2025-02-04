import { Link } from 'react-router-dom'
import arrow_back from '../assets/images/Arrow 5.svg'
import '../scss/components/empty_fav.css'
export default function EmptyFav(){

  return (
    <>
      <div className="w-full  bg-headerNav bg-cover flex justify-center items-center">
        <h1 className="text-white font-term text-2xl w-full text-center tracking-[5px] leading-5 px-5 py-5">
          Избранное
        </h1>
      </div>
      <div className='h-[76vh] bg-white flex flex-col justify-center items-center gap-9'>
<div
  className="mx-auto w-full max-w-xs relative flex flex-col items-center justify-center text-center overflow-visible mb-10"
>
  <h3 className="text-2xl font-normal font-term">В избранном пусто</h3>
  <div className="w-full relative flex flex-col items-center justify-center">
    <div
      className="absolute inset-x-auto top-0 bg-gradient-to-r from-transparent bg-red-600 to-transparent h-[2px] w-full blur-sm"
    ></div>
    <div
      className="absolute inset-x-auto top-0 bg-gradient-to-r from-transparent bg-red-600 to-transparent h-px w-full"
    ></div>
    <div
      className="absolute inset-x-auto top-0 bg-gradient-to-r from-transparent bg-red-600 to-transparent h-[5px] w-1/2 blur-sm"
    ></div>
    <div
      className="absolute inset-x-auto top-0 bg-gradient-to-r from-transparent bg-red-600 to-transparent h-px w-1/2"
    ></div>
    <div
      className="absolute inset-0 w-full h-full bg-background [mask-image:radial-gradient(50%_200px_at_top,transparent_20%,white)]"
    ></div>
  </div>
  <p className="mt-6 text-sm">
    Добавьте что-нибудь в избранное чтобы удобно заказывать любимые блюда
  </p>

  <span
    className="absolute -z-[1] backdrop-blur-sm inset-0 w-full h-full flex before:content-[''] before:h-3/4 before:w-full before:bg-gradient-to-r before:from-black before:to-purple-600 before:blur-[90px] after:content-[''] after:h-1/2 after:w-full after:bg-gradient-to-br after:from-cyan-400 after:to-sky-300 after:blur-[90px]"
  ></span>
</div>

      </div>
    </>
  );
}