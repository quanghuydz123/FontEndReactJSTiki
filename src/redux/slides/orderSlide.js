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
    selectedItemOrder:[],
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
    isSuccessOrder:true
  },
  reducers: {

    addOrderProduct:(state, action)=>{
        const {orderItem}= action.payload
        const itemOrder = state?.orderItems.find((item)=>item?.product === orderItem.product)
        if(itemOrder){
            if(itemOrder.amount < itemOrder.countInStock)
            {
                itemOrder.amount += orderItem.amount
                state.isSuccessOrder=true
            }else{
                state.isSuccessOrder=false
            }
        }else{
            state.orderItems.push(orderItem)
            state.isSuccessOrder=true
        }

    },
    increaseAnomunt:(state,action)=>{
        const {idProduct}= action.payload
        const itemOrder = state?.orderItems?.find((item)=>item?.product === idProduct)
        const itemOrderSelected = state?.selectedItemOrder?.find((item)=>item?.product === idProduct)
        if(itemOrderSelected){
            // if(itemOrderSelected.amount < itemOrderSelected.countInStock)
            // {
                
            // }
            itemOrderSelected.amount++
            
        }
        // if(itemOrder.amount < itemOrder.countInStock)
        // {
           
        // }
        itemOrder.amount ++
    },
    decreaseAnomunt:(state,action)=>{
        const {idProduct}= action.payload
        const itemOrder = state?.orderItems?.find((item)=>item?.product === idProduct)
        const itemOrderSelected = state?.selectedItemOrder?.find((item)=>item?.product === idProduct)
        if(itemOrder.amount > 1){
            itemOrder.amount --
            if(itemOrderSelected)
            {
                itemOrderSelected.amount --
            }
            
        }
        
    },
    removeOrderProduct:(state, action)=>{
        const {idProduct}= action.payload
        const itemOrder = state?.orderItems?.filter((item)=>item?.product !== idProduct)
        const itemOrderSelected = state?.selectedItemOrder?.filter((item)=>item?.product !== idProduct)

        state.orderItems = itemOrder
        state.selectedItemOrder = itemOrderSelected

        
    }
    ,
    removeAllOrderProduct:(state, action)=>{
        const {listChecked}= action.payload
        const itemOrder = state?.orderItems?.filter((item)=> !listChecked?.includes(item?.product))
        const itemOrderSelected = state?.selectedItemOrder?.filter((item)=> !listChecked?.includes(item?.product))
        state.orderItems = itemOrder
        state.selectedItemOrder = itemOrderSelected
    },
    selectedOrder:(state,action)=>{
        const {listChecked}= action.payload
        const orderSelected = []
        // if(!listChecked?.includes('buynow'))
        // {
        //     state.orderItems?.forEach((order)=>{
        //         if(listChecked?.includes(order.product)){
        //             orderSelected.push(order)
        //         }
        //     })
        //     state.selectedItemOrder = orderSelected
        // }

        state.orderItems?.forEach((order)=>{
            if(listChecked?.includes(order.product)){
                orderSelected.push(order)
            }
        })
        state.selectedItemOrder = orderSelected
    },
    buyNowProduct:(state,action)=>{
        const {orderItem}= action.payload
        const orderSelected = []
        orderSelected.push(orderItem)
        state.selectedItemOrder=orderSelected
    },

    resetOrder:(state, action)=>{
        state.isSuccessOrder=true

    },
    updateOrder:(state, action)=>{
        const {id,countInStock,discount,price,description,image,specifications,name} = action.payload
        const itemOrder = state?.orderItems?.find((item)=>item?.product === id)
        if(itemOrder){
            itemOrder.countInStock = parseFloat(countInStock)
            itemOrder.description = description
            itemOrder.discount = parseFloat(discount)
            itemOrder.price = parseFloat(price)
            itemOrder.image = image
            itemOrder.specifications = specifications
            itemOrder.name = name
        }

    },
  }
})

// Action creators are generated for each case reducer function
export const { addOrderProduct,decreaseAnomunt,removeOrderProduct,increaseAnomunt,removeAllOrderProduct,selectedOrder,buyNowProduct ,resetOrder,updateOrder } = orderSlide.actions

export default orderSlide.reducer