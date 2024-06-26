import { Badge, Button, Form, Modal,Space,Upload, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
    PlusCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    SearchOutlined,
    RollbackOutlined
    
} from '@ant-design/icons';
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import { UploadOutlined } from '@ant-design/icons';
import {getBase64} from '../../utils'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../LoadingComponent/Loading";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";
const AdminUser = ()=>{
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected,setRowSelected] = useState('')
    const [isOpenDrawer,setIsOpenDrawer] = useState('')
    const [form] = Form.useForm()
    const [formUpdate] = Form.useForm()
    const [isOpenModalDetele,setIsOpenModalDelete] = useState('')
    const [isOpenModalRestoreUser,setIsOpenModalRestoreUser] = useState('')

    const user = useSelector((state) => state.user)
    const [isPendingUpdate,setIsPendingUpdate] = useState(false)
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [key, setKey] = useState(0);//dùng để render lại compoent
    const [previousRowSelected, setPreviousRowSelected] = useState(true);

    const [stateUser,setStateUser] = useState({
        name:'',
        email:'',
        phone:'',
        address:'',
        isAdmin:false,
    })
    const [stateUserDetals,setStateUserDetails] = useState({
        name:'',
        email:'',
        phone:'',
        avatar:'',
        address:'',
        isAdmin:false,
    })
    const fetchUserDetails = async (id)=>{
        const res = await UserService.getDetailsUser(id,user?.access_token)
        if(res?.data){
            setStateUserDetails({
                name:res?.data.name,
                email:res?.data.email,
                phone:res?.data.phone,
                isAdmin:res?.data.isAdmin,
                address:res?.data.address,
                avatar:res?.data.avatar
               
            })
        }
        setIsPendingUpdate(false)
    }
    useEffect(()=>{
        formUpdate.setFieldsValue(stateUserDetals)//set value vào input
    },[formUpdate,stateUserDetals])

    useEffect(()=>{
        if(rowSelected){
            fetchUserDetails(rowSelected)
        }
    },[rowSelected,previousRowSelected])

    const handleDetalsProduct = ()=>{
        if(rowSelected){
            setIsPendingUpdate(true)
        }
        setIsOpenDrawer(true)
        
    }

    const handleDeleteManyUser = (_id)=>{
        mutationDeleteUserMany.mutate({ids:  _id,token:user?.access_token},{
            onSettled:()=>{
                queryUser.refetch()
            }
        })
        setKey(prev => prev + 1)
    }

    const renderAction = ()=>{
        return (
            <div>
                <EditOutlined style={{
                    color:'orange',
                    fontSize:'30px',
                    cursor:'pointer'
                }}
                title="cập nhập người dùng"
                onClick={handleDetalsProduct}
                />

                <RollbackOutlined 
                onClick={()=>setIsOpenModalRestoreUser(true)}
                title="khôi phục người dùng"
                style={{
                    color:'green',
                    fontSize:'30px',
                    cursor:'pointer',
                    marginLeft:'10px'
                }}
                />

                <DeleteOutlined style={{
                    color:'red',
                    fontSize:'30px',
                    cursor:'pointer',
                    marginLeft:'10px'
                }}
                title="xóa người dùng"
                onClick={()=>{setIsOpenModalDelete(true)}}
                />

                
                
            </div>
        )
    }

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

    const mutation = useMutationHooks(//call api
         (data) => UserService.signupUser(data)
    )

    const mutationUpdateUser = useMutationHooks(//call api
    (data) => {
        const {id,token,...rest} = data
        const res = UserService.updateUser(id,{...rest},token)
        return res
    })

    const mutationRestoreUser = useMutationHooks(//call api
    (data) => {
        const {id,token} = data
        const res = UserService.restoreUser(id,token)
        return res
    })
    
    const mutationDeleteUser = useMutationHooks(//call api
    (data) => {
        const {id,token} = data
        const res = UserService.deleteUser(id,token)
        return res
    })


    const mutationDeleteUserMany = useMutationHooks(//call api
    (data) => {
        const {token,ids} = data 
        const res = UserService.deleteManyUser(ids,token)
        return res
    })

    


    const fetchUserAll = async ()=>{
        const res = await UserService.getAllUser(user?.access_token)
        return res
    }
    const queryUser = useQuery({
        queryKey: ['user'],
        queryFn: fetchUserAll,
        retry: 3,
        retryDelay: 1000
    });
    const { isLoading:isLoadingUser, data:users } = queryUser
    const {data, isPending, isSuccess,isError,error} = mutation
    const {data:dataUpdate, isPending:isPendingUpdate1, isSuccess:isSuccessUpdate,isError:isErrorUpdate,error:errorUpdate} = mutationUpdateUser
    const {data:dataDelete, isPending:isPendingDelete1, isSuccess:isSuccessDelete,isError:isErrorDelete,error:errorDelete} = mutationDeleteUser
    const {data:dataDeleteMany, isPending:isPendingDeleteMany1, isSuccess:isSuccessDeleteMany,isError:isErrorDeleteMany,error:errorDeleteMany} = mutationDeleteUserMany
    const {data:dataRestoreUser, isPending:isPendingRestoreUser1, isSuccess:isSuccessRestoreUser,isError:isErrorRestoreUser,error:errorRestoreUser} = mutationRestoreUser

    const showModal = () => {   
        setIsModalOpen(true);   
    };
    useEffect(()=>{
        if(isSuccessUpdate){
            message.success("Cập nhập thành công")
        }else if(isErrorUpdate){
            message.error(dataUpdate?.message || "Lỗi rồi")
        }
    },[isSuccessUpdate,isErrorUpdate])

    useEffect(()=>{
        if(data?.status==="OK"){
            message.success(data?.message)
        }else if(data?.status==="ERR"){
            message.error(data?.message)
        }
    },[data])

    useEffect(()=>{
        if(dataDeleteMany?.status==="OK" || isSuccessDeleteMany){
            message.success(dataDeleteMany?.message)
        }else if(dataDeleteMany?.status==="ERR" || isErrorDeleteMany){
            message.error(dataDeleteMany?.message)
        }
    },[dataDeleteMany,isErrorDeleteMany,isSuccessDeleteMany])

    useEffect(()=>{
        if(dataDelete?.status==="OK" || isSuccessDelete){
            message.success(dataDelete?.message)
        }else if(data?.status==="ERR" || isErrorDelete){
            message.error(dataDelete?.message)
        }
    },[dataDelete,isErrorDelete,isSuccessDelete])

    useEffect(()=>{
        if(dataRestoreUser?.status==="OK" || isSuccessRestoreUser){
            message.success(dataRestoreUser?.message)
        }else if(data?.status==="ERR" || isErrorRestoreUser){
            message.error(dataRestoreUser?.message)
        }
    },[dataRestoreUser,isErrorRestoreUser,isSuccessRestoreUser])

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateUser({
             name:'',
             phone:'',
             isAdmin:false,
             email:''
             
         })
        form.resetFields()//xóa hết value input
    };
    const hanldeCancelDelete = ()=>{
        setIsOpenModalDelete(false)
    }
    const handleDeleteUser =()=>{
        mutationDeleteUser.mutate({id:rowSelected,token:user?.access_token},{
            onSettled: ()=>{//tự động load lại khi update
                queryUser.refetch()
            }
        })
        setIsOpenModalDelete(false)
    }
    const handleRestoreUser =()=>{
        mutationRestoreUser.mutate({id:rowSelected,token:user?.access_token},{
            onSettled: ()=>{//tự động load lại khi update
                queryUser.refetch()
            }
        })
        setIsOpenModalRestoreUser(false)
    }
    const onFinish = () => {
        mutation.mutate(stateUser,{
            onSettled: ()=>{//tự động load lại khi update
                queryUser.refetch()
            }
        })

    };

    const onUpdateUser=()=>{
        mutationUpdateUser.mutate({id:rowSelected,token:user?.access_token,...stateUserDetals},{
            onSettled: ()=>{//tự động load lại khi update
                queryUser.refetch()
            }
        })
    }
    const handleOnchange = (e)=>{
        setStateUser({
            ...stateUser,
            [e.target.name] : e.target.value
        })
    }

    const handleOnchangeDetals = (e)=>{
        setStateUserDetails({
            ...stateUserDetals,
            [e.target.name] : e.target.value
        })
    }
    const handleOnchangeAvatar = async({fileList}) =>{
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateUser({
            ...stateUser,
            image:file.preview
        })
    }

    const handleOnchangeAvatarDetails = async({fileList}) =>{
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateUserDetails({
            ...stateUserDetals,
            avatar:file.preview
        })
    }


    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          render: (text) => <a>{text}</a>,
          sorter: (a,b) => a.name.length - b.name.length,
          ...getColumnSearchProps('name')
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: (a,b) => a.email.length - b.email.length,
            ...getColumnSearchProps('email')
        },
        // {
        //     title: 'Admin',
            
        //     dataIndex: 'isAdmin',
        //     filters: [
        //         {
        //           text: 'True',
        //           value: true,
        //         },
        //         {
        //             text: 'False',
        //             value: false,
        //         },
                
        //       ],
        //       filterMode: 'tree',
        //       onFilter: (value, record) => {
        //         if(value === true){
        //             return Boolean(record.isAdmin) === true
        //         }else if(value === false){
        //             return Boolean(record.isAdmin) === false
        //         }
        //     }
        // },
        {
          title: 'Phone',
          dataIndex: 'phone',
          ...getColumnSearchProps('phone')
        },
        {
            title: 'Address',
            dataIndex: 'address',
            ...getColumnSearchProps('address')
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (_, record) => 
                <div>{record?.status ? <Badge status="success" text="Đang hoạt động" /> : <Badge status="error" text="Ngưng hoạt động" />}</div>
            
            
        },
        {
          title: 'Action',
          dataIndex: 'action',
          render: renderAction
        },
      ];
      const dataTable = users?.data.length && users?.data.filter(item => item?.isAdmin === false).sort((b,a) =>{ return Number(a?.status) - Number(b?.status)}).map((item)=>{
        return {...item,key: item._id} //boolean k được
      })
    return (
        <div>
            <div>
                <h1 className="WapperHeaderAdmin">Quản lý người dùng</h1>

                <div style={{
                marginTop:'20px'
            }}>
                <TableComponent key={key} handleDeleteMany={handleDeleteManyUser} columns={columns} data={dataTable} isLoading={isLoadingUser} onRow={(record, rowIndex) => {
                    return {
                    onClick: (event) => {
                        setRowSelected(record._id)
                        setPreviousRowSelected(!previousRowSelected)
                    }, // click row
                        
                        };
                }}/>
            </div>
            
            
            <DrawerComponent title='Chi tiết người dùng' isOpen={isOpenDrawer} onClose={()=> {return setIsOpenDrawer(false)}} width="50%">
            <Loading isLoading={isPendingUpdate}>
                <Form
                    name="basic"
                    labelCol={{
                        span: 6,
                    }}
                    wrapperCol={{
                        span: 18,
                    }}
                    style={{
                        minWidth: 0,
                    }}
                    form={formUpdate}
                    onFinish={onUpdateUser}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your name!',
                            },
                        ]}
                    >
                        <InputComponent value={stateUserDetals.name} onChange={handleOnchangeDetals} name="name"/>
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Email!',
                            },
                        ]}
                    >
                        <InputComponent value={stateUserDetals.email} onChange={handleOnchangeDetals} name="email"/>
                    </Form.Item>

                    {/* <Form.Item  
                        label="isAdmin"
                        name="isAdmin"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your CountInStock!',
                            },
                        ]}
                    >
                        <InputComponent value={stateUserDetals.isAdmin} onChange={handleOnchangeDetals} name="isAdmin"/>
                    </Form.Item> */}

                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your phone!',
                            },
                        ]}
                    >
                        <InputComponent value={stateUserDetals.phone} onChange={handleOnchangeDetals} name="phone"/>
                    </Form.Item>

                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your address!',
                            },
                        ]}
                    >
                        <InputComponent value={stateUserDetals.address} onChange={handleOnchangeDetals} name="address"/>
                    </Form.Item>

                    
                    <Form.Item
                        label="Avatar"
                        name="avatar"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your avatar!',
                            },
                        ]}
                    >
                        <Upload onChange={handleOnchangeAvatarDetails} className="WapperUploadFile" maxCount={1}>
                            <Button icon={<UploadOutlined />}>Select File</Button>
                            {stateUserDetals.avatar && (
                        <img src={stateUserDetals.avatar} style={{
                            height:'60px',
                            width:'60px',
                            borderRadius:'50%',
                            objectFit:'cover',
                            marginLeft:'20px'
                        }} alt="avatar"/>
                        )}
                        </Upload>
                       
                    </Form.Item>

                    
                   

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                        style={{display:'flex',justifyContent:'flex-end', marginRight:'50px'}}
                    >
                        <Button type="primary" htmlType="submit">
                            Cập nhập
                        </Button>
                    </Form.Item>
                </Form>
                </Loading>
            </DrawerComponent>
            <ModalComponent title="Xóa người dùng" isOpen={isOpenModalDetele} onCancel={hanldeCancelDelete} onOk={handleDeleteUser}>
            <Loading isLoading={isPendingDelete1}>
                <div>
                    Bạn có muốn xóa người dùng này không ? 
                </div>
            </Loading>
            </ModalComponent>

            <ModalComponent title="Khôi phục người dùng" isOpen={isOpenModalRestoreUser} onCancel={()=>setIsOpenModalRestoreUser(false)} onOk={handleRestoreUser}>
                <div>
                    Bạn có muốn khôi phục người dùng này không ? 
                </div>
            </ModalComponent>
        </div>
            </div>
    )
}

export default AdminUser