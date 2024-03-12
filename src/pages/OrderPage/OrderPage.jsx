import {Checkbox, Form, InputNumber } from 'antd'
import React, { useEffect, useState } from 'react'
import { CustomCheckbox, WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperRight, WrapperStyleHeader, WrapperStyleHeaderDilivery, WrapperTotal } from './style';
import { DeleteOutlined, MinusOutlined, PlusOutlined} from '@ant-design/icons'

import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import { colors } from '../../contants';
import { increaseAnomunt,decreaseAnomunt,removeOrderProduct,removeAllOrderProduct } from "../../redux/slides/orderSlide";

const OrderPage = () => {
    const order = useSelector((state) => state.order)
    const dispatch = useDispatch()
    const [listChecked,setListChecked] = useState([])
    const handleChangeCount = (type,idProduct)=>{
      if(type==="increase"){
        dispatch(increaseAnomunt({idProduct}))
      }
      else{
        dispatch(decreaseAnomunt({idProduct}))
      }
      
    }
  const handleDeleteOrder = (idProduct)=>{
      dispatch(removeOrderProduct({idProduct}))
  }
  const onChange = (e)=>{
      if(listChecked.includes(e.target.value))
      {
        const newListChecked = listChecked.filter((item) => item !== e.target.value)
        setListChecked(newListChecked)
      }
      else{
        setListChecked([
          ...listChecked,
          e.target.value
        ])
      }
  }
  const handleCheckAll = (e)=>{  
    if(e.target.checked){
      const newListChecked = []
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product)
      })
      setListChecked(newListChecked)
    }else{
      setListChecked([])
    }
  }
  const handleRemoveAllOrder = ()=>{
    if(listChecked?.length > 0){
      dispatch(removeAllOrderProduct({listChecked}))
    }
   
  }
  console.log("list",listChecked)
  return (
    <div style={{background: '#f5f5fa', with: '100%', height: '100vh'}}>
      <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
        <h3 style={{fontWeight: 'bold'}}>Giỏ hàng</h3>
        <div style={{ display: 'flex', justifyContent: 'center'}}>
          <WrapperLeft>
             
            <WrapperStyleHeader>
                <span style={{display: 'inline-block', width: '390px'}}>
                  <CustomCheckbox onClick={handleCheckAll} checked={listChecked?.length===order?.orderItems?.length   }></CustomCheckbox>
                  <span style={{marginLeft:'20px'}}> Tất cả ({order.orderItems.length} sản phẩm)</span>
                </span>
                <div style={{flex:1,display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>Đơn giá</span>
                  <span>Số lượng</span>
                  <span>Thành tiền</span>
                  <DeleteOutlined style={{cursor: 'pointer'}} onClick={handleRemoveAllOrder} />
                </div>
            </WrapperStyleHeader>
            <WrapperListOrder>
              {order?.orderItems?.map((order) => {


                return (
                  <WrapperItemOrder key={order?.product}>
                    <div style={{ width: '390px', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CustomCheckbox onChange={onChange} value={order?.product} checked={listChecked.includes(order?.product)}></CustomCheckbox>
                      <img src={order?.image} style={{ width: '77px', height: '79px', objectFit: 'cover' }} />
                      <div style={{
                        width: 260,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'  
                      }}>{order?.name}</div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>
                        <span style={{ fontSize: '13px', color: '#242424' }}>{order?.price}</span>
                      </span>
                      <WrapperCountOrder>
                        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={()=>handleChangeCount('decrease',order?.product)} >
                          <MinusOutlined style={{ color: '#000', fontSize: '10px' }} />
                        </button>
                        <InputNumber defaultValue={order?.amount}  value={order?.amount} size="small" min={1} max={999} />
                        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={()=>handleChangeCount('increase',order?.product)}>
                          <PlusOutlined style={{ color: '#000', fontSize: '10px' }} />
                        </button>
                      </WrapperCountOrder>
                      <span style={{ color: 'rgb(255, 66, 78)', fontSize: '13px', fontWeight: 500 }}>{order?.price}</span>
                      <DeleteOutlined style={{ cursor: 'pointer' }} onClick={()=> handleDeleteOrder(order?.product)} />
                    </div>
                  </WrapperItemOrder>
                )
              })}

            </WrapperListOrder>
          </WrapperLeft>
          <WrapperRight>
            <div style={{width: '100%'}}>
             
              <WrapperInfo>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>Tạm tính</span>
                  <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>123</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>Thuế</span>
                  <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>123</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>Giảm giá</span>
                  <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>123</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>Phí giao hàng</span>
                  <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>123</span>
                </div>
              </WrapperInfo>
              <WrapperTotal>
                <span>Tổng tiền</span>
                <span style={{display:'flex', flexDirection: 'column'}}>
                  <span style={{color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold'}}>123</span>
                  <span style={{color: '#000', fontSize: '11px'}}>(Đã bao gồm VAT nếu có)</span>
                </span>
              </WrapperTotal>
            </div>
            <ButtonComponent 
                            size={20}
                            styleButton={{
                                backgroundColor:colors.primary,
                                height:'48px',
                                width:'220px',
                                border:'1px solid rgb(13,92,182)',
                                borderRadius:'4px'
                            }}
                            textButton={"Mua Ngay"}
                            styleTextButton={{color:'white',fontSize:'15px',fontWeight:500}}
                        />
          </WrapperRight>
        </div>
      </div>
      {/* <ModalComponent title="Cập nhật thông tin giao hàng" >
        <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            // onFinish={onUpdateUser}
            autoComplete="on"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <InputComponent  name="name" />
            </Form.Item>
            <Form.Item
              label="City"
              name="city"
              rules={[{ required: true, message: 'Please input your city!' }]}
            >
              <InputComponent  name="city" />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: 'Please input your  phone!' }]}
            >
              <InputComponent  name="phone" />
            </Form.Item>

            <Form.Item
              label="Adress"
              name="address"
              rules={[{ required: true, message: 'Please input your  address!' }]}
            >
              <InputComponent  name="address" />
            </Form.Item>
          </Form>
      </ModalComponent> */}
    </div>
  )
}

export default OrderPage