import { CartItem } from "../redux/cart/types"

export const calcTotalCount = (items: CartItem[]) => {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

