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
const AdminProduct = ()=>{
    const [isModalOpen, setIsModalOpen] = useState(false);
    const renderAction = ()=>{
        return (
            <div>
                <DeleteOutlined style={{
                    color:'red',
                    fontSize:'30px',
                    cursor:'pointer'
                }}/>
                <EditOutlined style={{
                    color:'orange',
                    fontSize:'30px',
                    cursor:'pointer',
                    marginLeft:'10px'
                }}/>
            </div>
        )
    }
    const [stateProduct,setStateProduct] = useState({
        name:'',
        price:'',
        description:'',
        rating:'',
        image:'', 
        type:'',
        countInStock:'',
    })
    const [form] = Form.useForm()
    const mutation = useMutationHooks(//call api
         (data) => ProductService.createProduct(data)
    )

    const fetchProductAll = async ()=>{
        const res = await ProductService.getAllProduct()
        return res
    }
    const { isLoading:isLoadingProduct, data:products } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProductAll,
        retry: 3,
        retryDelay: 1000
    });

    const {data, isPending, isSuccess,isError,error} = mutation
    const showModal = () => {   
        setIsModalOpen(true);   
    };
    useEffect(()=>{
        console.log(data?.status)
        if(data?.status==="OK"){
            message.success("Thêm thành công")
        }else if(data?.status==="ERR"){
            message.error(data?.message)
        }
    },[data])
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
    const onFinish = (values) => {
        mutation.mutate(stateProduct)

    };
    const handleOnchange = (e)=>{
        setStateProduct({
            ...stateProduct,
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
                <TableComponent columns={columns} data={dataTable} isLoading={isLoadingProduct}/>
            </div>
            <Modal title="Tạo sản phẩm" open={isModalOpen}  onCancel={handleCancel} className="modal=product" footer={null}>
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
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
                </Loading>
            </Modal>
        </div>
    )
}

export default AdminProduct