import { Button, Form, Modal,Upload, message } from "antd";
import React, { useEffect, useState } from "react";
import {
    PlusCircleOutlined,
    DeleteOutlined,
    EditOutlined
} from '@ant-design/icons';
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import { UploadOutlined } from '@ant-design/icons';
import {getBase64} from '../../utils'
import * as ProductService from '../../services/ProductService'
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../LoadingComponent/Loading";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";

const AdminProduct = ()=>{
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected,setRowSelected] = useState('')
    const [isOpenDrawer,setIsOpenDrawer] = useState('')
    const [form] = Form.useForm()
    const [formUpdate] = Form.useForm()
    const [isOpenModalDetele,setIsOpenModalDelete] = useState('')
    const user = useSelector((state) => state.user)
    const [isPendingUpdate,setIsPendingUpdate] = useState(false)
    const [stateProduct,setStateProduct] = useState({
        name:'',
        price:'',
        description:'',
        rating:'',
        image:'', 
        type:'',
        countInStock:'',
    })
    const [stateProductDetals,setStateProductDetails] = useState({
        name:'',
        price:'',
        description:'',
        rating:'',
        image:'', 
        type:'',
        countInStock:'',
    })
    const fetchProductDetails = async (id)=>{
        const res = await ProductService.getDetailsProduct(id)
        if(res?.data){
            setStateProductDetails({
                name:res?.data.name,
                price:res?.data.price,
                description:res?.data.description,
                rating:res?.data.rating,
                image:res?.data.image, 
                type:res?.data.type,
                countInStock:res?.data.countInStock,
            })
        }
        setIsPendingUpdate(false)
    }
    useEffect(()=>{
        formUpdate.setFieldsValue(stateProductDetals)//set value vào input
    },[formUpdate,stateProductDetals])
    useEffect(()=>{
        if(rowSelected){
            fetchProductDetails(rowSelected)
        }
    },[rowSelected])
    const handleDetalsProduct = ()=>{
        if(rowSelected){
            setIsPendingUpdate(true)
            fetchProductDetails(rowSelected)    
        }
        setIsOpenDrawer(true)
        
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
    
    const mutation = useMutationHooks(//call api
         (data) => ProductService.createProduct(data)
    )

    const mutationUpdateProduct = useMutationHooks(//call api
    (data) => {
        const {id,token,...rest} = data
        const res = ProductService.updateProduct(id,token,rest)
        return res
    })
    const mutationDeleteProduct = useMutationHooks(//call api
    (data) => {
        const {id,token} = data
        const res = ProductService.deleteProduct(id,token)
        return res
    })

    


    const fetchProductAll = async ()=>{
        const res = await ProductService.getAllProduct()
        return res
    }
    const queryProduct = useQuery({
        queryKey: ['products'],
        queryFn: fetchProductAll,
        retry: 3,
        retryDelay: 1000
    });
    const { isLoading:isLoadingProduct, data:products } = queryProduct

    const {data, isPending, isSuccess,isError,error} = mutation
    const {data:dataUpdate, isPending:isPendingUpdate1, isSuccess:isSuccessUpdate,isError:isErrorUpdate,error:errorUpdate} = mutationUpdateProduct
    const {data:dataDelete, isPending:isPendingDelete1, isSuccess:isSuccessDelete,isError:isErrorDelete,error:errorDelete} = mutationDeleteProduct

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
        if(dataDelete?.status==="OK" || isSuccessDelete){
            message.success(dataDelete?.message)
        }else if(data?.status==="ERR" || isErrorDelete){
            message.error(dataDelete?.message)
        }
    },[dataDelete,isErrorDelete,isSuccessDelete])

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateProduct({
             name:'',
             price:'',
             description:'',
             rating:'',
             image:'', 
             type:'',
             countInStock:'',
         })
        form.resetFields()//xóa hết value input
    };
    const hanldeCancelDelete = ()=>{
        setIsOpenModalDelete(false)
    }
    const handleDeleteProduct =()=>{
        mutationDeleteProduct.mutate({id:rowSelected,token:user?.access_token},{
            onSettled: ()=>{//tự động load lại khi update
                queryProduct.refetch()
            }
        })
        setIsOpenModalDelete(false)
    }
    const onFinish = () => {
        mutation.mutate(stateProduct,{
            onSettled: ()=>{//tự động load lại khi update
                queryProduct.refetch()
            }
        })

    };

    const onUpdateProduct=()=>{
        mutationUpdateProduct.mutate({id:rowSelected,token:user?.access_token,stateProductDetals},{
            onSettled: ()=>{//tự động load lại khi update
                queryProduct.refetch()
            }
        })
    }
    const handleOnchange = (e)=>{
        setStateProduct({
            ...stateProduct,
            [e.target.name] : e.target.value
        })
    }

    const handleOnchangeDetals = (e)=>{
        setStateProductDetails({
            ...stateProductDetals,
            [e.target.name] : e.target.value
        })
    }
    const handleOnchangeAvatar = async({fileList}) =>{
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProduct({
            ...stateProduct,
            image:file.preview
        })
    }

    const handleOnchangeAvatarDetails = async({fileList}) =>{
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProductDetails({
            ...stateProductDetals,
            image:file.preview
        })
    }


    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          render: (text) => <a>{text}</a>,
        },
        {
          title: 'Price',
          dataIndex: 'price',
        },
        {
          title: 'Rating',
          dataIndex: 'rating',
        },
        {
          title: 'Type',
          dataIndex: 'type',
        },
        {
          title: 'Action',
          dataIndex: 'action',
          render: renderAction
        },
      ];
      const dataTable = products?.data.length && products?.data.map((item)=>{
        return {...item,key: item._id}
      })
    return (
        <div>
            <h1 className="WapperHeaderAdmin">Quản lý sản phẩm</h1>
            <div style={{ marginTop: '10px' }}>
                <Button style={{ height: '150px', width: '150px', borderRadius: '6px' }} onClick={showModal}><PlusCircleOutlined style={{ fontSize: '60px' }} /></Button>
            </div>
            <div style={{
                marginTop:'20px'
            }}>
                <TableComponent columns={columns} data={dataTable} isLoading={isLoadingProduct} onRow={(record, rowIndex) => {
                    return {
                    onClick: (event) => {
                        setRowSelected(record._id)
                    }, // click row
                        
                        };
                }}/>
            </div>
            
            <ModalComponent title="Tạo sản phẩm" open={isModalOpen}  onCancel={handleCancel} className="modal=product" footer={null}>
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
                        <InputComponent value={stateProduct.name} onChange={handleOnchange} name="name"/>
                    </Form.Item>

                    <Form.Item
                        label="Type"
                        name="type"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Type!',
                            },
                        ]}
                    >
                        <InputComponent value={stateProduct.type} onChange={handleOnchange} name="type"/>
                    </Form.Item>

                    <Form.Item  
                        label="Count InStock"
                        name="countInStock"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your CountInStock!',
                            },
                        ]}
                    >
                        <InputComponent value={stateProduct.countInStock} onChange={handleOnchange} name="countInStock"/>
                    </Form.Item>

                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your price!',
                            },
                        ]}
                    >
                        <InputComponent value={stateProduct.price} onChange={handleOnchange} name="price"/>
                    </Form.Item>

                    <Form.Item
                        label="Rating"
                        name="rating"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your rating!',
                            },
                        ]}
                    >
                        <InputComponent  value={stateProduct.rating} onChange={handleOnchange} name="rating" />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your description!',
                            },
                        ]}
                    >
                        <InputComponent  value={stateProduct.description} onChange={handleOnchange} name="description" />
                    </Form.Item>

                    <Form.Item
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
                       
                    </Form.Item>

                    
                   

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
            <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={()=>setIsOpenDrawer(false)} width="50%">
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
                    onFinish={onUpdateProduct}
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
                        <InputComponent value={stateProductDetals.name} onChange={handleOnchangeDetals} name="name"/>
                    </Form.Item>

                    <Form.Item
                        label="Type"
                        name="type"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Type!',
                            },
                        ]}
                    >
                        <InputComponent value={stateProductDetals.type} onChange={handleOnchangeDetals} name="type"/>
                    </Form.Item>

                    <Form.Item  
                        label="Count InStock"
                        name="countInStock"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your CountInStock!',
                            },
                        ]}
                    >
                        <InputComponent value={stateProductDetals.countInStock} onChange={handleOnchangeDetals} name="countInStock"/>
                    </Form.Item>

                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your price!',
                            },
                        ]}
                    >
                        <InputComponent value={stateProductDetals.price} onChange={handleOnchangeDetals} name="price"/>
                    </Form.Item>

                    <Form.Item
                        label="Rating"
                        name="rating"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your rating!',
                            },
                        ]}
                    >
                        <InputComponent  value={stateProductDetals.rating} onChange={handleOnchangeDetals} name="rating" />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your description!',
                            },
                        ]}
                    >
                        <InputComponent  value={stateProductDetals.description} onChange={handleOnchangeDetals} name="description" />
                    </Form.Item>

                    <Form.Item
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
            <ModalComponent title="Xóa sản phẩm" isOpen={isOpenModalDetele} onCancel={hanldeCancelDelete} onOk={handleDeleteProduct}>
            <Loading isLoading={isPendingDelete1}>
                <div>
                    Bạn có muốn xóa sản phẩm này không ? 
                </div>
            </Loading>
            </ModalComponent>
        </div>
    )
}

export default AdminProduct