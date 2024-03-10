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

const OrderPage = () => {
    const user = useSelector((state) => state.user)
  return (
    <div style={{background: '#f5f5fa', with: '100%', height: '100vh'}}>
      <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
        <h3 style={{fontWeight: 'bold'}}>Giỏ hàng</h3>
        <div style={{ display: 'flex', justifyContent: 'center'}}>
          <WrapperLeft>
             
            <WrapperStyleHeader>
                <span style={{display: 'inline-block', width: '390px'}}>
                  <CustomCheckbox></CustomCheckbox>
                  <span> Tất cả 123 sản phẩm</span>
                </span>
                <div style={{flex:1,display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>Đơn giá</span>
                  <span>Số lượng</span>
                  <span>Thành tiền</span>
                  <DeleteOutlined style={{cursor: 'pointer'}} />
                </div>
            </WrapperStyleHeader>
            <WrapperListOrder>
              
                  <WrapperItemOrder key={'order?.product'}>
                <div style={{width: '390px', display: 'flex', alignItems: 'center', gap: 4}}> 
                  <CustomCheckbox  ></CustomCheckbox>
                  <img src={'https://salt.tikicdn.com/cache/280x280/ts/product/38/06/c3/01d16bdaf31be91903e7911595b6ee31.jpg.webp'} style={{width: '77px', height: '79px', objectFit: 'cover'}}/>
                  <div style={{
                    width: 260,
                    overflow: 'hidden',
                    textOverflow:'ellipsis',
                    whiteSpace:'nowrap'
                  }}>123</div>
                </div>
                <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>
                    <span style={{ fontSize: '13px', color: '#242424' }}>123</span>
                  </span>
                  <WrapperCountOrder>
                    <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} >
                        <MinusOutlined style={{ color: '#000', fontSize: '10px' }} />
                    </button>
                    <InputNumber defaultValue={123} value={123} size="small" min={1} max={123} />
                    <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} >
                        <PlusOutlined style={{ color: '#000', fontSize: '10px' }}/>
                    </button>
                  </WrapperCountOrder>
                  <span style={{color: 'rgb(255, 66, 78)', fontSize: '13px', fontWeight: 500}}>123</span>
                  <DeleteOutlined style={{cursor: 'pointer'}} />
                </div>
              </WrapperItemOrder>
                
             
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
                            textButton={"Mua trả sau"}
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