import React from 'react'
import '../../scss/components/_categories.scss'

type CategoryItem = {
  id: number
  name: string
}

export const categoriesList: CategoryItem[] = [
  // { id: 0, name: 'Популярное' },
  { id: 2511, name: 'Говядина' },
  { id: 2567, name: 'Морепродукты' },
  { id: 2425, name: 'Без мяса' },
  { id: 2426, name: 'Свинина острая' },
  { id: 2427, name: 'Свинина неострая' },
  { id: 6, name: 'Супы' },
  { id: 7, name: 'Сосиски' },
  { id: 8, name: 'Фри' },
  { id: 9, name: 'Курица' },
  { id: 10, name: 'Добавки' },
  { id: 11, name: 'Соусы' },
  { id: 12, name: 'Бар' },
  { id: 13, name: 'Холодильник' },
  { id: 14, name: 'Десерты' },
]

type СategoriesProps = {
  value: CategoryItem
  onChangeCategory: (idx: CategoryItem) => void
}

export const Сategories: React.FC<СategoriesProps> = React.memo(({
  value,
  onChangeCategory
}) => {

  return (
    <div className='overflow-x-scroll bg-red-600 px-4 py-4'>
      <ul className='w-[500px] relative flex h-full'>
        {categoriesList.map((obj) => (
          <li
            key={obj.id}
            onClick={() => onChangeCategory(obj)}
            className={
              value.id === obj.id ?
                'active px-5 py-2 rounded-[30px] w-fill font-next tracking-[3px] text-white font-bold uppercase min-w-fit hover:cursor-pointer text-[15px]':
                'bg-transparent px-5 py-2 w-fill rounded-[30px] tracking-[3px] text-white font-next font-bold uppercase min-w-fit hover:cursor-pointer text-[15px]'
            }>
            {obj.name}
          </li>
        ))}
      </ul>
    </div>
  )
})

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import '../../scss/components/_categories.scss';

// type CategoryItem = {
//   hierarchicalId: number;
//   name: string;
// };

// type CategoriesProps = {
//   value: CategoryItem; // Текущая выбранная категория
//   onChangeCategory: (hierarchicalParent: CategoryItem) => void; // Функция для изменения категории
// };

// export const Categories: React.FC<CategoriesProps> = React.memo(({ value, onChangeCategory }) => {
//   const [categories, setCategories] = useState<CategoryItem[]>([]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get('http://127.0.0.1:8000/food/categories'); // Замените на ваш API URL
//         setCategories(response.data);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   return (
//     <div className='overflow-x-scroll bg-red-600 px-4 py-4'>
//       <ul className='w-auto relative flex h-full gap-4'>
//         {categories.map((obj) => (
//           <li
//             key={obj.hierarchicalId} // Уникальный идентификатор
//             onClick={() => onChangeCategory(obj)} // Передаем объект категории
//             className={
//               value.hierarchicalId === obj.hierarchicalId
//                 ? 'active px-5 py-2 rounded-[30px] font-next tracking-[3px] text-white font-bold uppercase min-w-fit hover:cursor-pointer text-[15px]'
//                 : 'bg-transparent px-5 py-2 rounded-[30px] tracking-[3px] text-white font-next font-bold uppercase min-w-fit hover:cursor-pointer text-[15px]'
//             }>
//             {obj.name}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// });


// http://127.0.0.1:8000/food/categories