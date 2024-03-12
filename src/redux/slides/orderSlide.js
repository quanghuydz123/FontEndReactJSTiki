import { createSlice } from '@reduxjs/toolkit'

export const orderSlide = createSlice({
  name: 'order',
  initialState: {
    orderItems: [
        // {
        //     name: '',
        //     amount: '',
        //     image: { type: String, required: true },
        //     price: { type: Number, required: true },
        //     discount: { type: Number },
        //     product: {
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: 'Product',
        //         required: true,
        //     },
        // },
    ],
    shippingAddress: {
        // fullName: { type: String, required: true },
        // address: { type: String, required: true },
        // city: { type: String, required: true },
        // phone: { type: Number, required: true },
    },
    paymentMethod: '',
    itemsPrice:0,
    shippingPrice: 0,
    taxPrice:0,
    totalPrice: 0,
    user: '',
    isPaid: false,
    paidAt: '',
    isDelivered: false,
    deliveredAt: '',
  },
  reducers: {

    addOrderProduct:(state, action)=>{
        const {orderItem}= action.payload
        const itemOrder = state?.orderItems.find((item)=>item?.product === orderItem.product)
        if(itemOrder){
            itemOrder.amount += orderItem.amount
        }else{
            state.orderItems.push(orderItem)
        }

    },
    increaseAnomunt:(state,action)=>{
        const {idProduct}= action.payload
        const itemOrder = state?.orderItems?.find((item)=>item?.product === idProduct)
        itemOrder.amount ++
    },
    decreaseAnomunt:(state,action)=>{
        const {idProduct}= action.payload
        const itemOrder = state?.orderItems?.find((item)=>item?.product === idProduct)
        itemOrder.amount --
    },
    removeOrderProduct:(state, action)=>{
        const {idProduct}= action.payload
        const itemOrder = state?.orderItems?.filter((item)=>item?.product !== idProduct)
        state.orderItems = itemOrder
        
    }
    ,
    removeAllOrderProduct:(state, action)=>{
        const {listChecked}= action.payload
        const itemOrder = state?.orderItems?.filter((item)=> !listChecked.includes(item?.product))
        state.orderItems = itemOrder
        
    }
  }
})

// Action creators are generated for each case reducer function
export const { addOrderProduct,decreaseAnomunt,removeOrderProduct,increaseAnomunt,removeAllOrderProduct } = orderSlide.actions

export default orderSlide.reducer