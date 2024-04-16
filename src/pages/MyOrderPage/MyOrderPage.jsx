import React, { useEffect, useMemo, useState } from 'react'

import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { WrapperItemOrder, WrapperListOrder, WrapperHeaderItem, WrapperFooterItem, WrapperContainer, WrapperStatus } from './style';
import Loading from '../../components/LoadingComponent/Loading';
import { useQuery } from '@tanstack/react-query';
import * as OrderService from '../../services/OrderService'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { convertPrice } from '../../utils';
import { useMutationHooks } from "../../hooks/useMutationHook";
import { Button, Result, message } from 'antd';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import LinkComponent from '../../components/LinkComponent/LinkComponent';

const MyOrderPage = () => {
  const user = useSelector((state) => state.user)
  const [isOpenModalDetele, setIsOpenModalDelete] = useState('')
  const [OrderSelected, setOrderSelected] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const { id, token } = location.state
  const fetchMyOrder = async (context) => {
    const res = OrderService.getOrderByUserId(id, token)
    return res
  }
  const queryOrder = useQuery({
    queryKey: ['myOrder'],
    queryFn: fetchMyOrder,
    enabled: user?.id && user?.access_token ? true : false // chỉ gọi khi bằng true
  });
  const { isLoading, data } = queryOrder
  const handleDetailsOrder = (id) => {
    window.open(`/details-order/${id}`, '_blank');
  }
  const handleNavigateProductOrder = (id) => {
    //window.open('/system/admin', '_blank');
    window.open(`/product-detail/${id}`, '_blank');
  }
  const mutation = useMutationHooks(
    (data) => {
      const { id, token, orderItems } = data
      const res = OrderService.cancelOrder(id, token, orderItems)
      return res
    }
  )

  const handleCanceOrder = (order) => {
    mutation.mutate({
      id: order?._id, token: user?.access_token, orderItems: order?.orderItems
    }, {
      onSuccess: () => {
        queryOrder.refetch()
      },
      onError: () => {
        message.error("Lỗi rồi")
      }
    })
    setIsOpenModalDelete(false)
  }
  const { isPending: isLoadingCancel, isSuccess: isSuccessCancel, isError: isErrorCancle, data: dataCancel } = mutation
  const hanldeCancelDelete = () => {
    setIsOpenModalDelete(false)
  }
  useEffect(() => {
    if (dataCancel?.status === 'OK') {
      message.success('Hủy thành công')
    } else if (dataCancel?.status === 'ERR') {
      message.error(dataCancel?.message)
    } else if (isErrorCancle) {
      message.error()
    } else if (isSuccessCancel) {
      message.success('thành công')
    }
  }, [isErrorCancle, isSuccessCancel, dataCancel])
  const renderProduct = (data) => {
    return data?.map((order) => {
      return (
        <>
          <WrapperHeaderItem key={order?._id}>
          <LinkComponent to={`/product-detail/${order?.product}`} style={{color:'black'}} colorOnMouseEnter='rgb(26,148,255)' colorOnMouseLeave='black' >
            <div style={{ display: 'flex', cursor: 'pointer' }}>
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
                width: 260,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                height: '100%',
                marginLeft: '10px'
              }}>{order?.name}</div>
            </div>
            </LinkComponent>
            <span style={{ fontSize: '13px', color: '#242424', marginLeft: 'auto' }}>{convertPrice(order?.price)}</span>
          </WrapperHeaderItem>
        </>
      )
    })
  }
  return (
    <Loading isLoading={isLoading || isLoadingCancel}>
      <WrapperContainer>
        <div style={{ height: '100%', width: '1270px', margin: '0 auto', marginBottom: '20px' }}>
          <h4 style={{margin:0,padding:'10px 0'}}>Đơn hàng của tôi</h4>
          <WrapperListOrder>
            {data?.data?.length !== 0 ? data?.data?.map((order) => {
              return (
                <WrapperItemOrder key={order?._id}>
                  <WrapperStatus>
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Trạng thái</span>
                    <div>
                      <span style={{ color: 'rgb(255, 66, 78)' }}>Giao hàng: </span>
                      <span style={{ color: 'rgb(90, 32, 193)', fontWeight: 'bold' }}>{order?.isDelivered ? 'Đã giao hàng' : 'Đang giao hàng'}</span>
                    </div>
                    <div>
                      <span style={{ color: 'rgb(255, 66, 78)' }}>Thanh toán: </span>
                      <span style={{ color: 'rgb(90, 32, 193)', fontWeight: 'bold' }}>{order?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
                    </div>
                  </WrapperStatus>
                  {renderProduct(order?.orderItems)}
                  <WrapperFooterItem>
                    <div>
                      <span style={{ color: 'rgb(255, 66, 78)' }}>Tổng tiền: </span>
                      <span
                        style={{ fontSize: '13px', color: 'rgb(56, 56, 61)', fontWeight: 700 }}
                      >{convertPrice(order?.totalPrice)}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <ButtonComponent
                        onClick={() => { setIsOpenModalDelete(true); setOrderSelected(order); }}
                        size={40}
                        styleButton={{
                          height: '36px',
                          border: '1px solid #9255FD',
                          borderRadius: '4px',
                        }}
                        textButton={'Hủy đơn hàng'}
                        styleTextButton={{ color: '#9255FD', fontSize: '14px' }}
                      >
                      </ButtonComponent>
                      <LinkComponent to={`/details-order/${order?._id}`} style={{color:'black'}} colorOnMouseEnter='rgb(26,148,255)' colorOnMouseLeave='black' >
                      <ButtonComponent
                        size={40}
                        styleButton={{
                          height: '36px',
                          border: '1px solid #9255FD',
                          borderRadius: '4px'
                        }}
                        textButton={'Xem chi tiết'}
                        styleTextButton={{ color: '#9255FD', fontSize: '14px' }}
                      >
                      </ButtonComponent>
                      </LinkComponent>
                    </div>
                  </WrapperFooterItem>
                </WrapperItemOrder>
              )
            }) : <Result
              status="404"
              title="Chưa có đơn hàng nào"
              subTitle="Hãy quay về trang chủ và mua sản phẩm đi nào"
              extra={<Button onClick={() => { navigate('/') }} type="primary">Trang chủ</Button>}
            />}
          </WrapperListOrder>
        </div>
      </WrapperContainer>
      <ModalComponent title="Hủy đơn hàng" isOpen={isOpenModalDetele} onCancel={hanldeCancelDelete} onOk={() => handleCanceOrder(OrderSelected)}>
        <div>
          Bạn có muốn hủy đơn hàng này không ?
        </div>
      </ModalComponent>
    </Loading>
  )
}

export default MyOrderPage