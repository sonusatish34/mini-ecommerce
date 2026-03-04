
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('wishlist')) || []
    : []
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const exist = state.items.find(i => i.id === action.payload.id)
      if (exist) state.items = state.items.filter(i => i.id !== action.payload.id)
      else state.items.push(action.payload)
      localStorage.setItem('wishlist', JSON.stringify(state.items))
    }
  }
})

export const { toggleWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
