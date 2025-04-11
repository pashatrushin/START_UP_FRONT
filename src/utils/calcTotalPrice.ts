import { CartItem } from "../redux/cart/types"

export const calcTotalPrice = (items: CartItem[]) => {
  return items.reduce((sum, obj) => obj.price * obj.quantity + sum, 0)
}