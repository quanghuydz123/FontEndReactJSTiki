import { Button, Form, Modal,Select,Space,Upload, message } from "antd";
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
import {getBase64, renderOption} from '../../utils'
import * as ProductService from '../../services/ProductService'
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../LoadingComponent/Loading";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import {useSelector } from "react-redux";
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
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [key, setKey] = useState(0);//dùng để render lại compoent
    const [typeSelect,setTypeSelect] = useState('')
    const [stateProduct,setStateProduct] = useState({
        name:'',
        price:'',
        description:'',
        rating:'',
        image:'', 
        type:'',
        countInStock:'',
        discount:''
    })
    const [stateProductDetals,setStateProductDetails] = useState({
        name:'',
        price:'',
        description:'',
        rating:'',
        image:'', 
        type:'',
        countInStock:'',
        discount:'',
    })
    const fetchAllTypeProduct = async(  )=>{
        const res = await ProductService.getAllTypeProduct()
        return res
    }
    
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
                discount:res?.data.discount
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

    const mutationDeleteProductMany = useMutationHooks(//call api
    (data) => {
        const {token,ids} = data 
        const res = ProductService.deleteManyProduct(ids,token)
        return res
    })

    


    const fetchProductAll = async ()=>{
        const res = await ProductService.getAllProduct()
        return res
    }
    const queryTypeProduct = useQuery({
        queryKey: ['type-products'],
        queryFn: fetchAllTypeProduct,
        retry: 3,
        retryDelay: 1000
    });
    const queryProduct = useQuery({
        queryKey: ['products'],
        queryFn: fetchProductAll,
        retry: 3,
        retryDelay: 1000
    });
    const { isLoading:isLoadingTyperoduct, data:typeProduct } = queryTypeProduct
    const { isLoading:isLoadingProduct, data:products } = queryProduct
    const {data, isPending, isSuccess,isError,error} = mutation
    const {data:dataUpdate, isPending:isPendingUpdate1, isSuccess:isSuccessUpdate,isError:isErrorUpdate,error:errorUpdate} = mutationUpdateProduct
    const {data:dataDelete, isPending:isPendingDelete1, isSuccess:isSuccessDelete,isError:isErrorDelete,error:errorDelete} = mutationDeleteProduct
    const {data:dataDeleteMany, isPending:isPendingDeleteMany1, isSuccess:isSuccessDeleteMany,isError:isErrorDeleteMany,error:errorDeleteMany} = mutationDeleteProductMany
    const showModal = () => {   
        setIsModalOpen(true);   
    };
    console.log('typeProduct',typeProduct?.data)
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
        if(dataDelete?.status==="OK"){
            message.success(dataDelete?.message)
        }else if(dataDelete ?.status==="ERR"){
            message.error(dataDelete?.message)
        }else if(isSuccessDelete){
            message.success('Thành công')
        }else if(isErrorDelete){
            message.error("Lỗi rồi")
        }
    },[dataDelete,isErrorDelete,isSuccessDelete])

    useEffect(()=>{
        if(dataDeleteMany?.status==="OK" || isSuccessDeleteMany){
            message.success(dataDeleteMany?.message)
        }else if(dataDeleteMany?.status==="ERR" || isErrorDeleteMany){
            message.error(dataDeleteMany?.message)
        }
    },[dataDeleteMany,isErrorDeleteMany,isSuccessDeleteMany])

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
            discount:''
         })
        form.resetFields()//xóa hết value input
    };
    const hanldeCancelDelete = ()=>{
        setIsOpenModalDelete(false)
    }
    const handleDeleteManyProduct = (_id)=>{
        mutationDeleteProductMany.mutate({ids:  _id,token:user?.access_token},{
            onSettled:()=>{
                queryProduct.refetch()
            }
        })
        setKey(prevKey => prevKey + 1);
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
          sorter: (a,b) => a.name.length - b.name.length,
          ...getColumnSearchProps('name')
        },
        {
          title: 'Price',
          dataIndex: 'price',
          sorter: (a,b) => a.price - b.name.price,
          filters: [
            {
              text: '>=50',
              value: '>=',
            },
            {
                text: '<=50',
                value: '<=',
              },
            
          ],
          filterMode: 'tree',
          onFilter: (value, record) => {
            if(value === ">="){
                return record.price >=50
            }else if(value === "<="){
                return record.price <=50
            }
            
          }

        },
        {
          title: 'Rating',
          dataIndex: 'rating',
          sorter: (a,b) => a.rating - b.rating,
          filters: [
            {
              text: '>=3',
              value: '>=',
            },
            {
                text: '<=3',
                value: '<=',
              },
            
          ],
          filterMode: 'tree',
          onFilter: (value, record) => {
            if(value === ">="){
                return Number(record.rating) >=3
            }else if(value === "<="){
                return Number(record.rating) <=3
            }
            
          }
        },
        {
          title: 'Type',
          dataIndex: 'type',
        },
        {
            title: 'countInStock',
            dataIndex: 'countInStock',
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
    const handleChange = (value) => {


        setStateProduct({
            ...stateProduct,
            type: value

        })

    }
    const handleChangeUpdate = (value)=>{
        setStateProductDetails({
            ...stateProductDetals,
            type: value
        })
    }
    return (
        <div>
            <h1 className="WapperHeaderAdmin">Quản lý sản phẩm</h1>
            <div style={{ marginTop: '10px' }}>
                <Button style={{ height: '150px', width: '150px', borderRadius: '6px' }} onClick={showModal}><PlusCircleOutlined style={{ fontSize: '60px' }} /></Button>
            </div>
            <div style={{
                marginTop:'20px'
            }}>
                <TableComponent key={key} handleDeleteMany={handleDeleteManyProduct} columns={columns} data={dataTable} isLoading={isLoadingProduct} onRow={(record, rowIndex) => {
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
                        {/* <InputComponent value={stateProduct.type} onChange={handleOnchange} name="type"/> */}
                        <Select
                            name='type'
                            //onChange={handleChange}
                            onChange={handleChange}
                            options={
                                renderOption(typeProduct?.data)
                            }
                        />
                        
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
                        label="Discount"
                        name="discount"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your discount!',
                            },
                        ]}
                    >
                        <InputComponent  value={stateProduct.discount} onChange={handleOnchange} name="discount" />
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
                        <Select
                            name='type'
                            //onChange={handleChange}
                            onChange={handleChangeUpdate}
                            options={
                                renderOption(typeProduct?.data)
                            }
                        />
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
                        label="Discount"
                        name="discount"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your discount!',
                            },
                        ]}
                    >
                        <InputComponent  value={stateProductDetals.discount} onChange={handleOnchangeDetals} name="discount" />
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