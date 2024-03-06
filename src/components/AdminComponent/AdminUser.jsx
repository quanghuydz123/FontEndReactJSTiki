import { Button, Form, Modal,Space,Upload, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
    PlusCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    SearchOutlined
    
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
    const user = useSelector((state) => state.user)
    const [isPendingUpdate,setIsPendingUpdate] = useState(false)
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [key, setKey] = useState(0);//dùng để render lại compoent
    const [stateUser,setStateUser] = useState({
        name:'',
        email:'',
        phone:'',
        isAdmin:false,
    })
    const [stateUserDetals,setStateUserDetails] = useState({
        name:'',
        email:'',
        phone:'',
        isAdmin:false,
    })
    const fetchUserDetails = async (id)=>{
        const res = await UserService.getDetailsUser(id)
        if(res?.data){
            setStateUserDetails({
                name:res?.data.name,
                email:res?.data.email,
                phone:res?.data.phone,
                isAdmin:res?.data.isAdmin,
               
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
    },[rowSelected])
    const handleDetalsProduct = ()=>{
        if(rowSelected){
            setIsPendingUpdate(true)
            fetchUserDetails(rowSelected)    
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
                    cursor:'pointer',
                }}
                onClick={handleDetalsProduct}
                />

                <DeleteOutlined style={{
                    color:'red',
                    fontSize:'30px',
                    cursor:'pointer',
                    marginLeft:'10px'
                }}
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
        const res = await UserService.getAllUser()
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
            image:file.preview
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
          title: 'Action',
          dataIndex: 'action',
          render: renderAction
        },
      ];
      const dataTable = users?.data.length && users?.data.filter(item => item.isAdmin === false).map((item)=>{
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
                    }, // click row
                        
                        };
                }}/>
            </div>
            
            <ModalComponent forceRender title="Tạo sản phẩm" open={isModalOpen}  onCancel={handleCancel} className="modal=product" footer={null}>
                <Loading isLoading={isPending}>
                <Form
                    name="basic"
                    labelCol={{
                        span: 6,
                    }}
                    wrapperCol={{
                        span: 18,
                    }}
                    style={{
                        maxWidth: 600,
                    }}
                    form={form}
                    onFinish={onFinish}
                    autoComplete="off"//
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
                        <InputComponent value={stateUser.name} onChange={handleOnchange} name="name"/>
                    </Form.Item>

                    <Form.Item
                        label="Email    "
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                        ]}
                    >
                        <InputComponent value={stateUser.email} onChange={handleOnchange} name="email"/>
                    </Form.Item>

                    <Form.Item  
                        label="Phone"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Phone!',
                            },
                        ]}
                    >
                        <InputComponent value={stateUser.phone} onChange={handleOnchange} name="phone"/>
                    </Form.Item>

                  

                 

                   

                    {/* <Form.Item
                        label="Image"
                        name="image"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your image!',
                            },
                        ]}
                    >
                        <Upload onChange={handleOnchangeAvatar} className="WapperUploadFile" maxCount={1}>
                            <Button icon={<UploadOutlined />}>Select File</Button>
                            {stateProduct.image && (
                        <img src={stateProduct.image} style={{
                            height:'60px',
                            width:'60px',
                            borderRadius:'50%',
                            objectFit:'cover',
                            marginLeft:'20px'
                        }} alt="avatar"/>
                        )}
                        </Upload>
                       
                    </Form.Item> */}

                    
                   

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                        style={{display:'flex',justifyContent:'flex-end', marginRight:'50px'}}
                    >
                        <Button type="primary" htmlType="submit">
                            Thêm
                        </Button>
                    </Form.Item>
                </Form>
                </Loading>
            </ModalComponent>
            <DrawerComponent title='Chi tiết người dùng' isOpen={isOpenDrawer} onClose={()=>setIsOpenDrawer(false)} width="50%">
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
                        maxWidth: 600,
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

                    
                    {/* <Form.Item
                        label="Image"
                        name="image"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your image!',
                            },
                        ]}
                    >
                        <Upload onChange={handleOnchangeAvatarDetails} className="WapperUploadFile" maxCount={1}>
                            <Button icon={<UploadOutlined />}>Select File</Button>
                            {stateProductDetals.image && (
                        <img src={stateProductDetals.image} style={{
                            height:'60px',
                            width:'60px',
                            borderRadius:'50%',
                            objectFit:'cover',
                            marginLeft:'20px'
                        }} alt="avatar"/>
                        )}
                        </Upload>
                       
                    </Form.Item> */}

                    
                   

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
        </div>
            </div>
    )
}

export default AdminUser