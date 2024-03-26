import { Button, Form, Modal,Space,Upload, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
    EyeOutlined,
    SearchOutlined
    
} from '@ant-design/icons';
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import * as OrderService from '../../services/OrderService'
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { convertPrice } from '../../utils';
import { orderContant } from '../../contant'
import { useNavigate } from "react-router-dom";

const AdminOrder = ()=>{
    const [form] = Form.useForm()
    const [formUpdate] = Form.useForm()
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [rowSelected,setRowSelected] = useState(null)
    const navigate = useNavigate()
   const idSelected = useRef('')
 
   const handleDetailsOrder = (id) => {
    if(id)
    {
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
    const getColumnSearchProps = (dataIndex)  => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
          <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
            <InputComponent
              ref={searchInput}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys , confirm, dataIndex)}
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
        {
          title: 'Payment method',
          dataIndex: 'paymentMethod',
          sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length,
          ...getColumnSearchProps('paymentMethod')
        },
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
            <EyeOutlined style={{
                color:'orange',
                fontSize:'30px',
                cursor:'pointer',
            }}
            title="Xem chi tiết"
            onClick={() => handleDetailsOrder(record._id)}
            />
          },
        
      ];
      const dataTable = orders?.data?.length && orders?.data?.map((order) => {
        return { ...order, key: order._id, userName: order?.shippingAddress?.fullName, phone: order?.shippingAddress?.phone, address: order?.shippingAddress?.address, paymentMethod: orderContant.payment[order?.paymentMethod],isPaid: order?.isPaid ? 'TRUE' :'FALSE',isDelivered: order?.isDelivered ? 'TRUE' : 'FALSE', totalPrice: convertPrice(order?.totalPrice)}
      })
    return (
        <div>
            <div>
                <h1 className="WapperHeaderAdmin">Quản lý đơn hàng</h1>

                <div style={{
                marginTop:'20px'
            }}>
                <TableComponent  columns={columns} isLoading={isLoadingOrders} data={dataTable} onRow={(record, rowIndex) => {
                    return {
                    onClick: (event) => {
                        setRowSelected(record._id)
                    }, // click row
                        
                        };}}/>
            </div>
        </div>
            </div>
    )
}

export default AdminOrder