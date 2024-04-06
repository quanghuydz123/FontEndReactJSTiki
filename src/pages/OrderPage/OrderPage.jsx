import { Button, Checkbox, Form, InputNumber, Result, Steps, message } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { CustomCheckbox, WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperRight, WrapperStyleHeader, WrapperStyleHeaderDilivery, WrapperTotal } from './style';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'

import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import { colors } from '../../contants';
import { increaseAnomunt, decreaseAnomunt, removeOrderProduct, removeAllOrderProduct, selectedOrder } from "../../redux/slides/orderSlide";
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import { updateUser } from '../../redux/slides/userSlide';
import { useNavigate } from 'react-router-dom';
import StepComponent from '../../components/Step/Step';
import LinkComponent from '../../components/LinkComponent/LinkComponent';

const OrderPage = () => {
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)
  const [isOpenModalDetele,setIsOpenModalDelete] = useState('')

  const [stateUserDetals, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
  })
  const navigate = useNavigate()
  const [formUpdate] = Form.useForm()
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [idProductSelected,setIdProductSelected] = useState('')
  const priceMeno = useMemo(() => { //dùng useMemo để không tinh toán không cần thiết khi render
    const result = order?.selectedItemOrder?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount))
    }, 0)
    return result
  }, [order])

  const priceDiscountMeno = useMemo(() => { //dùng useMemo để không tinh toán không cần thiết khi render
    const result = order?.selectedItemOrder?.reduce((total, cur) => {
      return total + ((cur.discount * cur.amount)/100*cur.price)
    }, 0)
    if (Number(result)) {
      return result
    }
    return 0
  }, [order])

  const diliveryPriceMeno = useMemo(() => { //dùng useMemo để không tinh toán không cần thiết khi render
    if(priceMeno >= 20000 && priceMeno < 500000){
      return 10000
    }else if(priceMeno >= 500000 || order?.selectedItemOrder?.length === 0) {
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
    dispatch(selectedOrder({ listChecked }))
  }, [listChecked])

  const handleChangeCount = (type, idProduct) => {
    if (type === "increase") {
      dispatch(increaseAnomunt({ idProduct }))
    }
    else {
      dispatch(decreaseAnomunt({ idProduct }))
    }

  }
  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter((item) => item !== e.target.value)
      setListChecked(newListChecked)
    }
    else {
      setListChecked([
        ...listChecked,
        e.target.value
      ])
    }
  }
  const hanldeCancelDelete = ()=>{
    setIsOpenModalDelete(false)
}
  const handleCheckAll = (e) => {
    if (e.target.checked) {
      const newListChecked = []
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product)
      })
      setListChecked(newListChecked)
    } else {
      setListChecked([])
    }
  }
  const handleRemoveAllOrder = () => {
    if (listChecked?.length > 0) {
      dispatch(removeAllOrderProduct({ listChecked }))
      message.success('Hủy thành công')
    }else{
      message.warning('Hãy tick chọn sản phẩm cần hủy')
    }

  }
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
  const handleDeleteProduct =(idProduct)=>{
    dispatch(removeOrderProduct({ idProduct }))
    setIsOpenModalDelete(false)
    message.success("Hủy thành công")
}
  useEffect(() => {
    formUpdate.setFieldsValue(stateUserDetals)//set value vào input
  }, [formUpdate, stateUserDetals])
  const handleAddCard = () => {
    if (order?.selectedItemOrder?.length < 1) {
      message.warning("Hãy chọn đơn hàng cần thanh toán")
    } else if (!user?.phone || !user?.address  || !user?.address) {
      fetchUserDetails(user?.id)
      setIsOpenModalUpdateInfo(true)
      message.warning("Hãy cập nhập thông tin đầy đủ")
    } else {
      navigate('/payment', { state: listChecked })
    }

  }
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
    if (name || address  || phone) {
      mutationUpdateUser.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetals }, {
        onSuccess: () => {
          const _id = user?.id
          dispatch(updateUser({...user,_id, address, phone }))
          setIsOpenModalUpdateInfo(false)
        },
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
  const handleNavigateProductOrder = (id) => {
    //window.open('/system/admin', '_blank');
    window.open(`/product-detail/${id}`, '_blank');
  }
  const handleChangeAddress = () => {
    fetchUserDetails(user?.id)
    setIsOpenModalUpdateInfo(true)
  }
  const itemsDelivery = [
    {
      title: '20.000 VNĐ',
      description: 'Dưới 200.000 VNĐ',
    },
    {
      title: '10.000 VNĐ',
      description: 'Từ 200.000 VNĐ đến dưới 500.000 VNĐ',
    },
    {
      title: 'Free ship',
      description : 'Trên 500.000 VNĐ',
    },
  ]
  return (
    <div style={{ background: '#f5f5fa', with: '100%', height: '100vh' }}>
      <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
        <h3 style={{ fontWeight: 'bold' }}>Giỏ hàng</h3>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <WrapperLeft>
            <WrapperStyleHeaderDilivery>
              <StepComponent items={itemsDelivery} current={diliveryPriceMeno === 10000 
                ? 2 : diliveryPriceMeno === 20000 ? 1 
                : order.selectedItemOrder.length === 0 ? 0:  3}/>

            </WrapperStyleHeaderDilivery>
            <WrapperStyleHeader>
              <span style={{ display: 'inline-block', width: '390px' }}>
                <CustomCheckbox onClick={handleCheckAll} checked={listChecked?.length === order?.orderItems?.length && listChecked?.length !== 0}></CustomCheckbox>
                <span style={{ marginLeft: '20px' }}> Tất cả ({order.orderItems.length} sản phẩm)</span>
              </span>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Đơn giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
                <DeleteOutlined style={{ cursor: 'pointer' }} onClick={handleRemoveAllOrder} />
              </div>
            </WrapperStyleHeader>
            <WrapperListOrder>
              {order?.orderItems.length !==0 ? order?.orderItems?.map((order) => {


                return (
                  <WrapperItemOrder key={order?.product}>
                    <div style={{ width: '390px', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                      <CustomCheckbox onChange={onChange} value={order?.product} checked={listChecked.includes(order?.product)}></CustomCheckbox>
                      <LinkComponent to={`/product-detail/${order?.product}`} style={{color:'black'}} colorOnMouseEnter='rgb(26,148,255)' colorOnMouseLeave='black' >
                        <div style={{display:'flex',alignItems:'center'}} >
                          <img src={order?.image} style={{ width: '77px', height: '79px', objectFit: 'cover' }} />
                          <div style={{
                            width: 260,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            marginLeft:'20px',
                          }} >{order?.name}</div>
                        </div>
                      </LinkComponent>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>
                        <span style={{ fontSize: '13px', color: '#242424' }}>{convertPrice(order?.price)}</span>
                      </span>
                      <WrapperCountOrder>
                        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease', order?.product)} >
                          <MinusOutlined style={{ color: '#000', fontSize: '10px' }} />
                        </button>
                        <InputNumber defaultValue={order?.amount} value={order?.amount} size="small" min={1} max={order?.countInStock} />
                        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase', order?.product)}>
                          <PlusOutlined style={{ color: '#000', fontSize: '10px' }} />
                        </button>
                      </WrapperCountOrder>
                      <span style={{ color: 'rgb(255, 66, 78)', fontSize: '13px', fontWeight: 500 }}>{convertPrice(order?.price)}</span>
                      <DeleteOutlined style={{ cursor: 'pointer' }} onClick={()=>{setIsOpenModalDelete(true); setIdProductSelected(order?.product);}} />
                    </div>
                  </WrapperItemOrder>
                )
              }) : <Result
              status="404"
              title="Giỏ hàng chưa có sản phẩm nào"
              subTitle="Hãy quay về trang chủ và mua sản phẩm đi nào"
              extra={<Button onClick={() => { navigate('/') }} type="primary">Trang chủ</Button>}
            />}

            </WrapperListOrder>
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
                  <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{`${convertPrice(priceDiscountMeno)}`}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Phí giao hàng</span>
                  <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(diliveryPriceMeno)}</span>
                </div>
              </WrapperInfo>
              <WrapperTotal>
                <span>Tổng tiền</span>
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold' }}>{convertPrice(totalPriceMeno-priceDiscountMeno)}</span>
                  <span style={{ color: '#000', fontSize: '11px' }}>(Đã bao gồm VAT nếu có)</span>
                </span>
              </WrapperTotal>
            </div>
            <ButtonComponent
              onClick={() => handleAddCard()}
              size={20}
              styleButton={{
                backgroundColor: colors.primary,
                height: '48px',
                width: '320px',
                border: '1px solid rgb(13,92,182)',
                borderRadius: '4px',
                marginLeft: '50px'
              }}
              textButton={"Mua Ngay"}
              styleTextButton={{ color: 'white', fontSize: '15px', fontWeight: 500 }}
            />
          </WrapperRight>
        </div>
      </div>
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
      <ModalComponent title="Hủy đơn hàng" isOpen={isOpenModalDetele} onCancel={hanldeCancelDelete} onOk={()=>handleDeleteProduct(idProductSelected)}>
            <div>
                Bạn có muốn hủy sản phẩm này không ?
            </div>
      </ModalComponent>
    </div>
  )
}

export default OrderPage