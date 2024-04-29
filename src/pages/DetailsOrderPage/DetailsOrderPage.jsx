
import React, { useEffect, useMemo, useState } from 'react'
import { WrapperAllPrice, WrapperContentInfo, WrapperHeaderUser, WrapperInfoUser, WrapperItem, WrapperItemLabel, WrapperLabel, WrapperNameProduct, WrapperProduct, WrapperStyleContent } from './style'
import { useLocation, useParams } from 'react-router-dom'
import * as OrderService from '../../services/OrderService'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { orderContant } from '../../contant';
import { convertPrice } from '../../utils';
import Loading from '../../components/LoadingComponent/Loading';

const DetailsOrderPage = () => {
  const user = useSelector((state) => state.user)
  const params = useParams()
  const { id } = params
  const [dateOrder,setDayOrder]= useState({
    day:'',
    month:'',
    year:''
  })
  const [datePaid,setDayPaid]= useState({
    day:'',
    month:'',
    year:''
  })
  const [dateDelivery,setDayDelivery]= useState({
    day:'',
    month:'',
    year:''
  })
  const [dateCancel,setDayCancel]= useState({
    day:'',
    month:'',
    year:''
  })
  const fetchDetailsOrder = async (context) => {
    const id = context.queryKey[1]
    const token = context.queryKey[2]
    const res = OrderService.getDetailsOrder(id, token)
    return res
  }
  const queryOrder = useQuery({
    queryKey: ['order-details', id, user?.access_token],
    queryFn: fetchDetailsOrder,
    enabled: id && user?.access_token ? true : false, // chỉ gọi khi bằng true
  });

  const { isLoading, data: orderDetails } = queryOrder
  useEffect(()=>{
    if(orderDetails){
      const date = new Date(orderDetails?.data?.createdAt);
      setDayOrder({
        day:date.getDate(),
        month:date.getMonth() + 1,
        year:date.getFullYear()
      })
      if(orderDetails?.data?.paidAt){
        const datePaidAt = new Date(orderDetails?.data?.paidAt);
        setDayPaid({
          day:datePaidAt.getDate(),
          month:datePaidAt.getMonth() + 1,
          year:datePaidAt.getFullYear()
        })
      }
      if(orderDetails?.data?.deliveredAt){
        const dateDelivery = new Date(orderDetails?.data?.deliveredAt);
        setDayDelivery({
          day:dateDelivery.getDate(),
          month:dateDelivery.getMonth() + 1,
          year:dateDelivery.getFullYear()
        })
      }
    }
  },[orderDetails])
  return (
    <Loading isLoading={isLoading}>
    <div style={{ width: '100%', minHeight: 'calc(100vh)', background: '#f5f5fa' }}>
      <div style={{ width: '1270px', margin: '0 auto', minHeight: '100%' }}>
        <h4 style={{margin:0,padding:'10px 0'}}>Chi tiết đơn hàng</h4>
        <WrapperHeaderUser>
          <WrapperInfoUser>
            <WrapperLabel>Địa chỉ người nhận</WrapperLabel>
            <WrapperContentInfo>
              <div className='name-info'>Họ tên: {orderDetails?.data?.shippingAddress?.fullName}</div>
              <div className='address-info'><span>Ngày đặt hàng: </span><span style={{color:'rgb(234, 133, 0)'}}>{`${dateOrder?.day} - ${dateOrder.month} - ${dateOrder.year}`}</span></div>
              <div className='address-info'><span>Địa chỉ: </span> {orderDetails?.data?.shippingAddress?.address}</div>
              <div className='phone-info' style={{margin:0}}><span>Điện thoại: </span>{orderDetails?.data?.shippingAddress?.phone}</div>
              <div className='address-info'><span>Ngày đặt hàng: </span><span style={{color:'rgb(234, 133, 0)'}}>{`${dateOrder?.day} - ${dateOrder.month} - ${dateOrder.year}`}</span></div>
              <div className='address-info'><span>Ngày đặt hàng: </span><span style={{color:'rgb(234, 133, 0)'}}>{`${dateOrder?.day} - ${dateOrder.month} - ${dateOrder.year}`}</span></div>

            </WrapperContentInfo>
          </WrapperInfoUser>
          <WrapperInfoUser>
            <WrapperLabel>Hình thức giao hàng</WrapperLabel>
            <WrapperContentInfo>
              <div className='delivery-info'><span className='name-delivery'>{orderContant.delivery[orderDetails?.data?.deliveryMethod]} </span>{orderContant.payment[orderDetails?.data?.paymentMethod]}</div>
              <div className='delivery-fee'><span>Phí giao hàng: </span>{convertPrice(orderDetails?.data?.shippingPrice)}</div>
              <div className='status-payment'><span style={{color:'black'}}>Tình trang:</span> <span>{orderDetails?.data?.isDelivered ? 'Đã giao hàng' : 'Đang giao hàng'}</span></div>
              <div className='status-payment'><span style={{color:'black'}}>Ngày xác nhận giao hàng tới:</span> <span>{orderDetails?.data?.isDelivered ? `${dateDelivery?.day} - ${dateDelivery.month} - ${dateDelivery.year}`: ''}</span></div>
            </WrapperContentInfo>
          </WrapperInfoUser>
          <WrapperInfoUser>
            <WrapperLabel>Hình thức thanh toán</WrapperLabel>
            <WrapperContentInfo>
              <div className='payment-info'>{orderContant.payment[orderDetails?.data?.paymentMethod]}</div>
              <div className='status-payment'><span style={{color:'black'}}>Tình trang:</span> <span>{orderDetails?.data?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</span></div>
              <div className='status-payment'><span style={{color:'black'}}>Ngày thanh toán:</span> <span>{orderDetails?.data?.isPaid ? `${dateOrder?.day} - ${dateOrder.month} - ${dateOrder.year}`: ''}</span></div>
            </WrapperContentInfo>
          </WrapperInfoUser>
        </WrapperHeaderUser>
        <WrapperStyleContent style={{ background: 'white', padding: '20px',borderRadius:'6px' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ width: '670px' }}>Sản phẩm</div>
            <WrapperItemLabel>Giá</WrapperItemLabel>
            <WrapperItemLabel>Số lượng</WrapperItemLabel>
            <WrapperItemLabel>Giảm giá</WrapperItemLabel>

          </div>
          {orderDetails?.data?.orderItems.map((order, index) => {
            return (
              <WrapperProduct key={index}>
                <WrapperNameProduct>
                  <img src={order?.image}
                    style={{
                      width: '70px',
                      height: '70px',
                      objectFit: 'cover',
                      border: '1px solid rgb(238, 238, 238)',
                      padding: '2px'
                    }}
                  />
                  <div style={{
                    width: 460,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginLeft: '10px',
                    height: '70px',
                  }}>{order?.name}</div>
                </WrapperNameProduct>
                <WrapperItem>{convertPrice(order?.price)}</WrapperItem>
                <WrapperItem>{order?.amount}</WrapperItem>
                <WrapperItem>{order?.discount ? convertPrice(order?.price*(order?.discount/100))  : '0 VNĐ'} {order?.discount &&  <span style={{color:'rgb(190, 30, 45)',fontSize:'10px'}}>-{order?.discount}%</span>}</WrapperItem>


              </WrapperProduct>
            )
          })}


          {/* <WrapperAllPrice>
            <WrapperItemLabel>Tạm tính</WrapperItemLabel>
            <WrapperItem>0</WrapperItem>
          </WrapperAllPrice> */}
          <WrapperAllPrice>
            <WrapperItemLabel>Phí vận chuyển :</WrapperItemLabel>
            <WrapperItem>{convertPrice(orderDetails?.data?.shippingPrice)}</WrapperItem>
          </WrapperAllPrice>
          <WrapperAllPrice style={{}}>
            <WrapperItemLabel>Tổng cộng : </WrapperItemLabel>
            <WrapperItem>{convertPrice(orderDetails?.data?.totalPrice)}</WrapperItem>
          </WrapperAllPrice>
        </WrapperStyleContent>
      </div>
    </div>
    </Loading>
  )
}

export default DetailsOrderPage