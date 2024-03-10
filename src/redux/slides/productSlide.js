import { createSlice } from '@reduxjs/toolkit'

export const productSlide = createSlice({
  name: 'product',
  initialState: {
    search: '',
  },
  reducers: {

    searchProduct: (state, action) => {
      state.search = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { searchProduct } = productSlide.actions

export default productSlide.reducer