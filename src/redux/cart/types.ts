export type CartItem = {
  id: string;
  foodName: string;
  price: number;
  image: string;// Если count больше не используется, можно удалить
  quantity: number; // Добавляем свойство quantity
  description: string;
  
};

export interface CartSliceState {
  totalPrice: number;
  totalCount: number;
  items: CartItem[];
}
export interface CartItemResponse {
  product_id: number;
  quantity: number;
}

export interface CartResponse {
  items: CartItemResponse[];
}

