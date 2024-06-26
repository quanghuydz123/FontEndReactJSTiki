import { createSlice } from '@reduxjs/toolkit'

export const userSlide = createSlice({
  name: 'user',
  initialState: {
    name: '',
    email: '',
    phone: '',
    address:'',
    avatar:'',
    access_token: '',
    refreshToken:'',
    id:'',
    isAdmin:false,
    city:'',
    stateUser:''

  },
  reducers: {
    updateUser:(state, action)=>{
        const {name='',email ='',address ='',phone ='',avatar = '',access_token ='',_id = '',isAdmin,city='',refreshToken='',stateUser=''} = action.payload

        //lưu trữ vào state
        state.name = name || email
        state.email = email
        state.address = address
        state.phone = phone
        state.avatar = avatar
        state.id = _id
        state.access_token = access_token
        state.isAdmin = isAdmin
        state.city=city
        state.refreshToken = refreshToken
        state.stateUser = stateUser

    },
    resetUser:(state,action)=>{
      state.name = ''
      state.email = ''
      state.address = ''
      state.avatar = ''
      state.phone  = ''
      state.id = ''
      state.access_token = ''
      state.isAdmin = false
      state.city=''
      state.refreshToken=''
      state.stateUser = ''

  },
  }
})

// Action creators are generated for each case reducer function
export const { updateUser,resetUser } = userSlide.actions

export default userSlide.reducer