import { Checkbox, Form, InputNumber, Radio, message } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { CustomCheckbox, Lable, WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperRadio, WrapperRight, WrapperStyleHeader, WrapperStyleHeaderDilivery, WrapperTotal } from './style';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'

import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import { colors } from '../../contants';
import { increaseAnomunt, decreaseAnomunt, removeOrderProduct, removeAllOrderProduct, selectedOrder } from "../../redux/slides/orderSlide";
import * as UserService from '../../services/UserService'
import * as OrderService from '../../services/OrderService'
import * as PaymentService from '../../services/PaymentService'

import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import { updateUser } from '../../redux/slides/userSlide';
import { useLocation, useNavigate } from 'react-router-dom';
import { PayPalButton } from 'react-paypal-button-v2';

const PaymentPage = () => {
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)
  const [sdkReadty, setSdkReady] = useState(false)
  const location = useLocation()
  const [stateUserDetals, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
  })
  const [payment, setPayment] = useState('later_money')
  const [delivery, setDelivery] = useState('fast')
  const [formUpdate] = Form.useForm()
  const navigate = useNavigate()
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const priceMeno = useMemo(() => { //dùng useMemo để không tinh toán không cần thiết khi render
    const result = order?.selectedItemOrder?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount))
    }, 0)
    return result
  }, [order])

  const priceDiscountMeno = useMemo(() => { //dùng useMemo để không tinh toán không cần thiết khi render
    const result = order?.selectedItemOrder?.reduce((total, cur) => {
      return total + ((cur.discount * cur.amount) / 100 * cur.price)
    }, 0)
    if (Number(result)) {
      return result
    }
    return 0
  }, [order])

  const diliveryPriceMeno = useMemo(() => { //dùng useMemo để không tinh toán không cần thiết khi render
    if (priceMeno >= 20000 && priceMeno < 500000) {
      return 10000
    } else if (priceMeno >= 500000 || order?.selectedItemOrder?.length === 0) {
      return 0
    } else {
      return 20000
    }
  }, [priceMeno])
  const totalPriceMeno = useMemo(() => {
    return Number(priceMeno) + Number(diliveryPriceMeno)
  }, [priceMeno, priceDiscountMeno, diliveryPriceMeno])

  const dispatch = useDispatch()
  const [listChecked, setListChecked] = useState([])

  useEffect(() => {
    setListChecked(location.state)
  }, [])

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }))
  }, [listChecked])

  const mutationAddOrder = useMutationHooks(//call api
    (data) => {
      const { token, ...rest } = data
      const res = OrderService.createOrder(token, { ...rest })
      return res
    })
  const { data: dataAddOrder, isPending: isLoadingAddOrder, isSuccess: isSuccessAddOrder, isError: isErrorAddOrder, error: errorAddOrder } = mutationAddOrder
  const handleOnchangeDetals = (e) => {
    setStateUserDetails({
      ...stateUserDetals,
      [e.target.name]: e.target.value
    })
  }
  const fetchUserDetails = async (id) => {
    const res = await UserService.getDetailsUser(id, user?.access_token)
    if (res?.data) {
      setStateUserDetails({
        name: res?.data.name,
        phone: res?.data.phone,
        address: res?.data.address,

      })
    }
  }
  useEffect(() => {
    formUpdate.setFieldsValue(stateUserDetals)//set value vào input
  }, [formUpdate, stateUserDetals])


  const hanldeCancelUpdate = () => {
    setIsOpenModalUpdateInfo(false)
    setStateUserDetails({
      name: '',
      phone: '',
      address: ''

    })
    formUpdate.resetFields()//xóa hết value input
  }

  const mutationUpdateUser = useMutationHooks(//call api
    (data) => {
      const { id, token, ...rest } = data
      const res = UserService.updateUser(id, { ...rest }, token)
      return res
    })
  const { data: dataUpdate, isPending: isPendingUpdate1, isSuccess: isSuccessUpdate, isError: isErrorUpdate, error: errorUpdate } = mutationUpdateUser

  const handleUpdateInfoUser = () => {
    const { name, address, phone } = stateUserDetals
    if (name || address || phone) {
      mutationUpdateUser.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetals }, {
        isSuccess: () => {
          dispatch(updateUser({ ...user,_id:user?.id,name, address, phone }))
          setIsOpenModalUpdateInfo(false)
        }
      })
    }
  }
  useEffect(() => {
    if (isSuccessUpdate || dataUpdate?.status === "OK") {
      message.success("Cập nhập thành công")
    } else if (isErrorUpdate || dataUpdate?.status === "ERR") {
      message.error(dataUpdate?.message || "Lỗi rồi")
    }
  }, [isSuccessUpdate, isErrorUpdate])

  const handleChangeAddress = () => {
    fetchUserDetails(user?.id)
    setIsOpenModalUpdateInfo(true)
  }
  const handleDilivery = (e) => {
    setDelivery(e.target.value)
  }
  const handlePayment = (e) => {
    setPayment(e.target.value)
  }
  const handleAddOrder = () => {
    if (user?.access_token && order?.selectedItemOrder && user?.name && user?.address && user?.phone  && priceMeno && user?.id) {
      mutationAddOrder.mutate({
        token: user?.access_token,
        orderItems: order?.selectedItemOrder,
        fullName: user?.name,
        address: user?.address,
        phone: user?.phone,
        paymentMethod: payment,
        itemsPrice: priceMeno,
        shippingPrice: diliveryPriceMeno,
        totalPrice: totalPriceMeno - priceDiscountMeno,
        user: user?.id,
        email:user?.email
      }, {
        onSuccess: (data) => {
          const arrOrder = []
          order?.selectedItemOrder?.forEach((order) => {
            arrOrder.push(order?.product)
          })
          dispatch(removeAllOrderProduct({ listChecked: arrOrder }))
          message.success("Đặt hàng thành công")
          navigate('/orderSuccess', {
            state: {
              delivery,
              payment,
              orders: order?.selectedItemOrder,
              totalPriceMemo: totalPriceMeno,

            }
          })
        },
        onError: (data) => {
          
          message.error("Lỗi rồi")
        }
      })
    } else {
      message.error("Lỗi rồi")
    }
  }
  const onSuccessPaypal = (details, data) => {
    mutationAddOrder.mutate({
      token: user?.access_token,
      orderItems: order?.selectedItemOrder,
      fullName: user?.name,
      address: user?.address,
      phone: user?.phone,
      paymentMethod: payment,
      itemsPrice: priceMeno,
      shippingPrice: diliveryPriceMeno,
      totalPrice: totalPriceMeno - priceDiscountMeno,
      user: user?.id,
      isPaid:true,
      paidAt:details.update_time ,
      email:user?.email 
    }, {
      onSuccess: (data) => {
        const arrOrder = []
        order?.selectedItemOrder?.forEach((order) => {
          arrOrder.push(order?.product)
        })
        dispatch(removeAllOrderProduct({ listChecked: arrOrder }))
        message.success("Thanh toán thành công")
        navigate('/orderSuccess', {
          state: {
            delivery,
            payment,
            orders: order?.selectedItemOrder,
            totalPriceMemo: totalPriceMeno,

          }
        })
      },
      onError: (data) => {

        message.error("Lỗi rồi")
      }
    })
  }
  const addPaypalScript = async () => {
    const { data } = await PaymentService.getConfig()
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://www.paypal.com/sdk/js?client-id=${data}`
    script.async = true;
    script.onload = () => {
      setSdkReady(true)
    }
    document.body.appendChild(script)
  }

  useEffect(() => {
    if(!window.paypal) {
      addPaypalScript()
    }else {
      setSdkReady(true)
    }
  }, [])
  
  return (
    <div style={{ background: '#f5f5fa', with: '100%', height: '100vh' }}>
      <Loading isLoading={isLoadingAddOrder}>
        <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
          <h3 style={{ fontWeight: 'bold' }}>Giỏ hàng</h3>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <WrapperLeft>
              <WrapperInfo>
                <div>
                  <Lable>Chọn phương thức giao hàng</Lable>
                  <WrapperRadio onChange={handleDilivery} value={delivery}>
                    <Radio value="fast"><span style={{ color: '#ea8500', fontWeight: 'bold' }}>FAST</span> Giao hàng tiết kiệm</Radio>
                    <Radio value="gojek"><span style={{ color: '#ea8500', fontWeight: 'bold' }}>GO_JEK</span> Giao hàng tiết kiệm</Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <Lable>Chọn phương thức thanh toán</Lable>
                  <WrapperRadio onChange={handlePayment} value={payment}>
                    <Radio value="later_money"> Thanh toán tiền mặt khi nhận hàng</Radio>
                    <Radio value="paypal"> Thanh toán bằng paypal</Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo>

            </WrapperLeft>
            <WrapperRight>
              <div style={{ width: '100%' }}>
                <WrapperInfo>
                  <div>
                    <span>Địa chỉ giao hàng: </span>
                    <span style={{ textDecoration: 'underline', fontWeight: 'bold' }}>{user?.address}</span>
                    <span style={{ color: 'blue', cursor: 'pointer' }} onClick={handleChangeAddress}> Thay đổi</span>
                  </div>
                </WrapperInfo>

                <WrapperInfo>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Tạm tính</span>
                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(priceMeno)}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Giảm giá</span>
                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{`${priceDiscountMeno} VNĐ`}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Phí giao hàng</span>
                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(diliveryPriceMeno)}</span>
                  </div>
                </WrapperInfo>
                <WrapperTotal>
                  <span>Tổng tiền</span>
                  <span style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold' }}>{convertPrice(totalPriceMeno - priceDiscountMeno)}</span>
                    <span style={{ color: '#000', fontSize: '11px' }}>(Đã bao gồm VAT nếu có)</span>
                  </span>
                </WrapperTotal>
              </div>
              {payment === 'paypal' && sdkReadty ? <div style={{ width: '320px' }}>
                <PayPalButton
                  amount={(Math.round((totalPriceMeno - priceDiscountMeno)/24755 * 10) / 10)}
                  // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                  onSuccess={onSuccessPaypal}
                  onError={() => {
                    alert("Mua thất bại")
                  }}
                />
              </div> :
                <ButtonComponent
                  onClick={() => handleAddOrder()}
                  size={20}
                  styleButton={{
                    backgroundColor: colors.primary,
                    height: '48px',
                    width: '320px',
                    border: '1px solid rgb(13,92,182)',
                    borderRadius: '4px',
                  }}
                  textButton={"Đặt hàng"}
                  styleTextButton={{ color: 'white', fontSize: '15px', fontWeight: 500 }}
                />}

            </WrapperRight>
          </div>
        </div>
      </Loading>
      <ModalComponent title="Cập nhật thông tin giao hàng" isOpen={isOpenModalUpdateInfo} onCancel={hanldeCancelUpdate} onOk={handleUpdateInfoUser}>
        <Loading isLoading={isPendingUpdate1}>
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            // onFinish={onUpdateUser}
            form={formUpdate}
            autoComplete="on"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <InputComponent value={stateUserDetals.name} name="name" onChange={handleOnchangeDetals} />
            </Form.Item>
            
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: 'Please input your  phone!' }]}
            >
              <InputComponent value={stateUserDetals.phone} name="phone" onChange={handleOnchangeDetals} />
            </Form.Item>

            <Form.Item
              label="Adress"
              name="address"
              rules={[{ required: true, message: 'Please input your  address!' }]}
            >
              <InputComponent value={stateUserDetals.address} name="address" onChange={handleOnchangeDetals} />
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
    </div>
  )
}

export default PaymentPage