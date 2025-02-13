export interface User {
    orders: string
    id: number
    tel: string
    chatID: string
    role: string
    address: string
    name: string
    nickname: string
    favourites: any[]
  }
export interface UserState {
    user: User | null
}