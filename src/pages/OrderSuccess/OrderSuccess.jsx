import React from 'react'
import { able, WrapperItemOrderInfo, WrapperInfo, WrapperValue, WrapperContainer,WrapperItemOrder, WrapperListOrder, WrapperRadio, WrapperRight, WrapperStyleHeader, WrapperStyleHeaderDilivery, WrapperTotal, Lable } from './style';

import {useSelector } from 'react-redux';

import { useLocation } from 'react-router-dom'; 
import { convertPrice } from '../../utils';
import { orderContant } from '../../contant';
import ContainerComponent from '../../components/ContainerComponent/ContainerComponent';

const OrderSuccess = () => {
    const order = useSelector((state) => state.order)
    const user = useSelector((state) => state.user)

  const location =useLocation()
  const {state} = location
    


  const handleNavigateProductOrder = (id)=>{
    //window.open('/system/admin', '_blank');
    window.open(`/product-detail/${id}`, '_blank');
  }

  return (
    <ContainerComponent style={{ background: '#f5f5fa', with: '100%', height: '100vh' }}>
      <div style={{ height: '100%', width: '100%', margin: '0 auto' }}>
        <h3 style={{ fontWeight: 'bold' }}>Đơn hàng đặt thành công</h3>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <WrapperContainer>
            <WrapperInfo>
              <div>
                <Lable>Phương thức giao hàng </Lable>
                  <WrapperValue>
                    <span style={{ color: '#ea8500', fontWeight: 'bold' }}>{orderContant.delivery[state?.delivery]}</span> Giao hàng tiết kiệm  
                  </WrapperValue>
              </div>
            </WrapperInfo>
            <WrapperInfo>
              <div>
                <Lable>Phương thức thanh toán</Lable>
                <WrapperValue>
                  {orderContant.payment[state?.payment]}
                </WrapperValue>
              </div>
              </WrapperInfo>
              <WrapperItemOrderInfo>
                {state.orders?.map((order) => {
                  return (
                    <WrapperItemOrder key={order?.name}>
                      <div style={{width: '500px', display: 'flex',alignItems: 'center', gap: 4}}> 
                        <img src={order.image} style={{width: '77px', height: '79px', objectFit: 'cover'}}/>
                        <div style={{
                          width: 260,
                          overflow: 'hidden',
                          textOverflow:'ellipsis',
                          whiteSpace:'nowrap',
                          cursor:'pointer'
                        }}
                        onClick={()=>handleNavigateProductOrder(order?.product)}>{order?.name}</div>
                      </div>
                      <div style={{flex: 1, display: 'flex', alignItems: 'center',gap: '10px'}}>
                        <span style={{width:'200px'}}>
                          <span style={{ fontSize: '13px', color: '#242424' }}>Giá tiền: {convertPrice(order?.price)}</span>
                        </span>
                        <span>
                          <span style={{ fontSize: '13px', color: '#242424' }}>Số lượng: {order?.amount}</span>
                        </span>
                        
                      </div>
                    </WrapperItemOrder>
                  )
                })}
              </WrapperItemOrderInfo>
         
            
          </WrapperContainer>
          
        </div>
        <div>
          <span style={{ fontSize: '16px', color: 'red' }}>Tổng tiền: {convertPrice(state?.totalPriceMemo)}</span>
        </div>
      </div>
     
    </ContainerComponent>
  )
} 

export default OrderSuccess