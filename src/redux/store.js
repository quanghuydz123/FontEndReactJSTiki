import { configureStore } from '@reduxjs/toolkit'
import  counterReducer   from './slides/counterSlide'
import userReducer from './slides/userSlide'
import productReducer from './slides/productSlide'

export default configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    product:productReducer
  }
})