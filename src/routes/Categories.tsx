import React from "react";

interface CategoriesProps {
  categories: { id: number; name: string }[];
  selectedCategory: number;
  onSelectCategory: (id: number) => void;
}

const Categories: React.FC<CategoriesProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="overflow-x-scroll bg-red-600 px-4 py-4">
      <ul className="w-auto relative flex h-full gap-4">
        {categories.map((category) => (
          <li
            key={category.id}
            className={selectedCategory === category.id ? "active px-5 py-2 rounded-[30px] font-next tracking-[3px] text-white font-bold uppercase min-w-fit hover:cursor-pointer text-[15px]" : "bg-transparent px-5 py-2 rounded-[30px] tracking-[3px] text-white font-next font-bold uppercase min-w-fit hover:cursor-pointer text-[15px]"}
            onClick={() => onSelectCategory(category.id)}
          >
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
