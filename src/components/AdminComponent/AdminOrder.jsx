import { Badge, Button, Form, Modal, Space, Upload, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
  EyeOutlined,
  SearchOutlined,
  DollarOutlined,
  CheckCircleOutlined

} from '@ant-design/icons';
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import * as OrderService from '../../services/OrderService'
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { convertPrice } from '../../utils';
import { orderContant } from '../../contant'
import { useNavigate } from "react-router-dom";
import ModalComponent from "../ModalComponent/ModalComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";

const AdminOrder = () => {
  const [form] = Form.useForm()
  const [formUpdate] = Form.useForm()
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [rowSelected, setRowSelected] = useState(null)
  const [isOpenModalPaidOrder,setIsOpenModalPaidOrder] = useState(false)
  const [isOpenModalConfirmDeliveryOrder,setIsOpenModalConfirmDeliveryOrder] = useState(false)

  const navigate = useNavigate()
  const idSelected = useRef('')

  const handleDetailsOrder = (id) => {
    if (id) {
      window.open(`/details-order/${id}`, '_blank');
    }
  }
  // const renderAction = ()=>{

  //     return (
  //         <div style={{display:'flex'}} >
  //             <EyeOutlined style={{
  //                 color:'orange',
  //                 fontSize:'30px',
  //                 cursor:'pointer',
  //             }}
  //             title="Xem chi tiết"
  //             onClick={() => handleDetailsOrder(rowSelected)}
  //             />

  //             <DeleteOutlined style={{
  //                 color:'red',
  //                 fontSize:'30px',
  //                 cursor:'pointer',
  //                 marginLeft:'10px',
  //             }}
  //             />

  //         </div>
  //     )
  // }


  const user = useSelector((state) => state?.user)


  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token)
    return res
  }


  const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrder })
  const { isLoading: isLoadingOrders, data: orders } = queryOrder
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>

          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ''}
    //     />
    //   ) : (
    //     text
    //   ),
  });
  const handleSearch = (
    selectedKeys,
    confirm,
    dataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const columns = [
    {
      title: 'User name',
      dataIndex: 'userName',
      sorter: (a, b) => a.userName.length - b.userName.length,
      ...getColumnSearchProps('userName')
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      sorter: (a, b) => a.phone.length - b.phone.length,
      ...getColumnSearchProps('phone')
    },
    {
      title: 'Address',
      dataIndex: 'address',
      sorter: (a, b) => a.address.length - b.address.length,
      ...getColumnSearchProps('address')
    },
    {
      title: 'Paided',
      dataIndex: 'isPaid',
      sorter: (a, b) => a.isPaid.length - b.isPaid.length,
      ...getColumnSearchProps('isPaid')
    },
    {
      title: 'Shipped',
      dataIndex: 'isDelivered',
      sorter: (a, b) => a.isDelivered.length - b.isDelivered.length,
      ...getColumnSearchProps('isDelivered')
    },
    // {
    //   title: 'Payment method',
    //   dataIndex: 'paymentMethod',
    //   sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length,
    //   ...getColumnSearchProps('paymentMethod')
    // },
    {
      title: 'Total price',
      dataIndex: 'totalPrice',
      sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
      ...getColumnSearchProps('totalPrice')
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) =>
        <div>
          <DollarOutlined style={{
            color: 'green',
            fontSize: '28px',
            cursor: 'pointer',
          }}
          onClick={()=>setIsOpenModalPaidOrder(true)}
            title="Thanh toán"
          />
          <CheckCircleOutlined style={{
            color: 'orange',
            fontSize: '28px',
            cursor: 'pointer',
            marginLeft: '10px'
          }}
          onClick={()=>setIsOpenModalConfirmDeliveryOrder(true)}
            title="Xác nhận giao hàng"
          />
          <EyeOutlined style={{
            color: 'black',
            fontSize: '30px',
            cursor: 'pointer',
            marginLeft: '10px'

          }}
            onClick={() => handleDetailsOrder(record._id)}
            title="Xem chi tiết"
          />
        </div>
    },
  ];
  const dataTable = orders?.data?.length && orders?.data?.map((order) => {
    return {
      ...order, key: order._id, userName: order?.shippingAddress?.fullName, phone: order?.shippingAddress?.phone, address: order?.shippingAddress?.address, paymentMethod: orderContant.payment[order?.paymentMethod], isPaid: order?.isPaid ? <Badge status="success" text="Đã thanh toán" /> : <Badge status="warning" text="Chưa thanh toán"></Badge>,
      isDelivered: order?.isDelivered ? <Badge status="success" text="Đã giao hàng" /> : <Badge status="warning" text="Đang giao hàng" />, totalPrice: convertPrice(order?.totalPrice)
    }
  })
  console.log("row",rowSelected)
  const mutationPaidOrder = useMutationHooks(//call api
    (data) => {
        const {id,token} = data
        const res = OrderService.paidOrder(id,token)
        return res
    })
    const {data:dataPaidOrder, isPending:isPendingPaidOrder, isSuccess:isSuccessPaidOrder,isError:isErrorPaidOrder,error:errorPaidOrder} = mutationPaidOrder
    useEffect(()=>{
      if(dataPaidOrder?.status==="OK"){
          message.success(dataPaidOrder?.message)
      }else if(dataPaidOrder?.status==="ERR"){
          message.error(dataPaidOrder?.message)
      }else if(isSuccessPaidOrder){
        message.success("Thanh toán thành công")
      }else if(isErrorPaidOrder){
        message.error("Lỗi rồi")
      }
  },[dataPaidOrder,isSuccessPaidOrder,isErrorPaidOrder])
  const handlePaidOrder =()=>{
    mutationPaidOrder.mutate({id:rowSelected,token:user?.access_token},{
      onSettled: ()=>{//tự động load lại khi update
          queryOrder.refetch()
      }
  })
    setIsOpenModalPaidOrder(false)
}

const mutationConfirmOrder = useMutationHooks(//call api
    (data) => {
        const {id,token} = data
        const res = OrderService.confirmDeliveryOrder(id,token)
        return res
    })
    const {data:dataConfirmOrder, isPending:isPendingConfirmOrder, isSuccess:isSuccessConfirmOrder,isError:isErrorConfirmOrder,error:errorConfirmOrder} = mutationConfirmOrder
    useEffect(()=>{
      if(dataConfirmOrder?.status==="OK"){
          message.success(dataConfirmOrder?.message)
      }else if(dataConfirmOrder?.status==="ERR"){
          message.error(dataConfirmOrder?.message)
      }else if(isSuccessConfirmOrder){
        message.success("Xác nhận giao hàng thành công")
      }else if(isErrorConfirmOrder){
        message.error("Lỗi rồi")
      }
  },[dataConfirmOrder,isSuccessConfirmOrder,isErrorConfirmOrder])

const handleConfirmOrder =()=>{
  mutationConfirmOrder.mutate({id:rowSelected,token:user?.access_token},{
    onSettled: ()=>{//tự động load lại khi update
        queryOrder.refetch()
    }
})
  setIsOpenModalConfirmDeliveryOrder(false)
}

  return (
    <div>
      <div>
        <h1 className="WapperHeaderAdmin">Quản lý đơn hàng</h1>

        <div style={{
          marginTop: '20px'
        }}>
          <TableComponent columns={columns} isLoading={isLoadingOrders} data={dataTable} onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id)
              }, // click row

            };
          }} />
        </div>
      </div>
      <ModalComponent title="Thanh toán đơn hàng" isOpen={isOpenModalPaidOrder} onCancel={()=>setIsOpenModalPaidOrder(false)} onOk={handlePaidOrder}>
          <div>
              Bạn có muốn thanh toán đơn hàng này không ? 
          </div>
      </ModalComponent>

      <ModalComponent title="Xác nhận giao hàng" isOpen={isOpenModalConfirmDeliveryOrder} onCancel={()=>setIsOpenModalConfirmDeliveryOrder(false)} onOk={handleConfirmOrder}>
          <div>
              Bạn có muốn xác nhận giao hàng thành công cho đơn hàng này không ? 
          </div>
      </ModalComponent>
    </div>
  )
}

export default AdminOrder