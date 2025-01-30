export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  count: number
  description: string
  isCounter: boolean
}

export interface CartSliceState {
  totalPrice: number
  totalCount: number
  items: CartItem[]
}