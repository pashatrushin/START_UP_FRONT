export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  count: number; // Если count больше не используется, можно удалить
  quantity: number; // Добавляем свойство quantity
  description: string;
  isCounter: boolean;
  
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

