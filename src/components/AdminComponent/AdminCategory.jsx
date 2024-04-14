import { Badge, Button, Form, Modal, Space, Upload, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
  PlusCircleOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  UploadOutlined

} from '@ant-design/icons';
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import * as OrderService from '../../services/OrderService'
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { convertPrice, getBase64 } from '../../utils';
import { orderContant } from '../../contant'
import { useNavigate } from "react-router-dom";
import * as CategoryService from '../../services/CategoryService'
import ModalComponent from "../ModalComponent/ModalComponent";
import Loading from "../LoadingComponent/Loading";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import DrawerComponent from "../DrawerComponent/DrawerComponent";

const AdminCategory = () => {
  const [form] = Form.useForm()

  const [formUpdate] = Form.useForm()
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [rowSelected, setRowSelected] = useState('')
  const [dataTable, setDataTable] = useState([])
  const [isOpenDrawer, setIsOpenDrawer] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate()
  const [amountChildCategory, setAmountChildCategory] = useState(0)
  const [amountChildCategoryDetails, setAmountChildCategoryDetails] = useState(0)
  const [previousRowSelected, setPreviousRowSelected] = useState(true);
  const [isPendingUpdate, setIsPendingUpdate] = useState(false)


  const [stateCategory, setStateCateogry] = useState({
    names: {},
    image: '',
    nameArr: []

  })
  const [stateCategoryDetails, setStateCateogryDetails] = useState({
    names: {},
    image: '',
    nameArr: [],
    idArr:[]
  })

  const renderAction = () => {
    return (
      <div>
        <EditOutlined style={{
          color: 'orange',
          fontSize: '30px',
          cursor: 'pointer'
        }}
          title="cập nhập người dùng"
          onClick={handleDetalsCategory}
        />



        <DeleteOutlined style={{
          color: 'red',
          fontSize: '30px',
          cursor: 'pointer',
          marginLeft: '10px'
        }}
          title="xóa người dùng"
        />



      </div>
    )
  }


  const user = useSelector((state) => state?.user)



  const getAllCategoryParent = async () => {
    const res = await CategoryService.getAllCategoryParent()
    return res
  }


  const queryCategory = useQuery({ queryKey: ['categorys-parent'], queryFn: getAllCategoryParent })
  const { isLoading: isLoadingCateogrysParent, data: categorysParent } = queryCategory

  const getAllCategoryChild = async () => {
    const res = await CategoryService.getAllCategoryChild()
    return res
  }


  const queryCategoryChild = useQuery({ queryKey: ['categorys-child'], queryFn: getAllCategoryChild })
  const { isLoading: isLoadingCateogrysChild, data: categorysChild } = queryCategoryChild

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
      title: 'Tên danh mục',
      dataIndex: 'name',


    },
    {
      title: 'Icon',
      render: (_, record) =>
        <div>
          <img src={record?.icon} alt="icon" width={25} height={25} />
        </div>


    },
    {
      title: 'Tên danh mục con',
      //dataIndex: 'userName',
      render: (_, record) =>
        <div>
          {record?.childItem?.map((item, index) => {
            return <div key={index}>+ {item?.name}</div>
          })}
        </div>


    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: '120px',
      render: renderAction
    },

  ];
  useEffect(() => {

    const itemTable = categorysParent?.data?.map((itemParent) => {
      const child = []
      categorysChild?.data?.map((itemChild) => {
        if (itemParent?._id === itemChild?.parentId) {
          child.push({ name: itemChild?.name, id: itemChild?._id })
        }
      })
      return { _id: itemParent?._id, name: itemParent?.name, icon: itemParent?.image, childItem: child }
    })
    if (itemTable) {
      setDataTable(itemTable)
    }
  }, [categorysParent, categorysChild])
  const handleCancel = () => {
    setIsModalOpen(false);
    setStateCateogry({
      names: {},
      image: '',
      nameArr: [],
    })
    setAmountChildCategory(0)
    form.resetFields()//xóa hết value input
  };
  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateCateogry({
      ...stateCategory,
      image: file.preview
    })
  }

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateCateogryDetails({
      ...stateCategoryDetails,
      image: file.preview
    })
  }
  const handleOnchange = (e) => {
    setStateCateogry({
      ...stateCategory,
      //[e.target.name]: e.target.value
      names: { ...stateCategory.names, [e.target.name]: e.target.value }
    })
  }

  const handleOnchangeDetails = (e) => {
    setStateCateogryDetails({
      ...stateCategoryDetails,
      //[e.target.name]: e.target.value
      names: { ...stateCategoryDetails.names, [e.target.name]: e.target.value }
    })
  }
  useEffect(() => {
    if (stateCategory.names) {
      setStateCateogry({
        ...stateCategory,
        nameArr: Object.values(stateCategory?.names)
      })
    }

  }, [stateCategory.names])

  useEffect(() => {
    if (stateCategoryDetails.names) {
      setStateCateogryDetails({
        ...stateCategoryDetails,
        nameArr: Object.values(stateCategoryDetails?.names)
      })
    }

  }, [stateCategoryDetails.names])
  const mutationCreateCategory = useMutationHooks(//call api
    (data) => {
      const res = CategoryService.createCategory(data)
      return res
    }
  )
  const { data, isPending, isSuccess, isError, error } = mutationCreateCategory
  useEffect(() => {
    if (data?.status === "OK") {
      message.success(data?.message)
    } else if (data?.status === "ERR") {
      message.error(data?.message)
    } else if (isSuccess) {
      message.success('Thành công')
    } else if (isError) {
      message.error("Lỗi rồi")
    }
  }, [data, isSuccess, isError])

  const onFinish = () => {
    mutationCreateCategory.mutate({ names: stateCategory.nameArr, image: stateCategory.image }, {
      onSettled: () => {//tự động load lại khi update
        queryCategory.refetch()
        queryCategoryChild.refetch()
      }
    })
  };
  const handleDeleteInputChild = (key) => {
    const updatedObject = { ...stateCategory.names }
    const updatedObjectAfterDelete = {}
    let index = 1
    if (updatedObject.hasOwnProperty(key)) //kiểm tra có tồn tại hay không
    {
      // Delete the key
      delete updatedObject[key];//xóa theo key

      Object.keys(updatedObject).forEach((key) => {
        // Thực hiện thay đổi giá trị ở đây
        const value = updatedObject[key];
        if (key != "name") {
          updatedObjectAfterDelete[`name${index}`] = value
          index++
        } else {
          updatedObjectAfterDelete[`name`] = value
        }
      });

      setStateCateogry({
        ...stateCategory,
        names: { ...updatedObjectAfterDelete }
      })
      setAmountChildCategory(prev => prev - 1)
    } else {
      setAmountChildCategory(prev => prev - 1)
    }
  }
  const handleDetalsCategory = () => {
    if (rowSelected) {
      setIsPendingUpdate(true)
    }
    setIsOpenDrawer(true)
  }

  const fetchCategoryDetails = async (id) => {
    const res = await CategoryService.getDetailsCategory(id)
    if (res?.data) {
      //
      let newStateCategoryDetails = { ...stateCategoryDetails }; //tao ra 1 object mới
      res?.data?.forEach((item,index)=>{
        if(index === 0 ){
          newStateCategoryDetails = {
            ...newStateCategoryDetails,
            image: item?.image,
            names: { ...newStateCategoryDetails.names, ['name']: item?.name },
            idArr:[...newStateCategoryDetails.idArr,item?._id]
          };
        }else{
          newStateCategoryDetails = {
            ...newStateCategoryDetails,
            names: { ...newStateCategoryDetails.names, [`name${index}`]: item?.name },
            idArr:[...newStateCategoryDetails.idArr,item?._id]
          };
        }
      })
      setStateCateogryDetails(newStateCategoryDetails); // truyền object vào useState
    }
    setIsPendingUpdate(false)
    setAmountChildCategoryDetails(res?.data?.length - 1)
  }
  useEffect(() => {
    if (rowSelected) {
      fetchCategoryDetails(rowSelected)
    }
  }, [rowSelected, previousRowSelected])

  useEffect(() => {
    formUpdate.setFieldsValue({name:stateCategoryDetails?.nameArr[0],image:stateCategoryDetails.image})//set value vào input
  }, [formUpdate, stateCategoryDetails])

  const handleCancelDetails = () => {
    setIsOpenDrawer(false)
    setStateCateogryDetails({
      names: {},
      image: '',
      nameArr: [],
      idArr:[]
    })
    setAmountChildCategoryDetails(0)
    formUpdate.resetFields()//xóa hết value input
  }
  console.log("state",stateCategoryDetails)
  const mutationUpdateCategory = useMutationHooks(//call api
  (data) => {
      const {token, idArr, image, nameArr } = data
      console.log("token, stateCategoryDetails",token, idArr, image, nameArr)
      const res = CategoryService.updateCategory(token, {idArr, image, nameArr})
      return res
  })

  const { data: dataUpdate, isPending: isPendingUpdate1, isSuccess: isSuccessUpdate, isError: isErrorUpdate, error: errorUpdate } = mutationUpdateCategory

  useEffect(() => {
    if (dataUpdate?.status === "OK") {
      message.success(dataUpdate?.message)
    } else if (dataUpdate?.status === "ERR") {
      message.error(dataUpdate?.message)
    } else if (isSuccessUpdate) {
      message.success('Cập nhập thành công')
    } else if (isErrorUpdate) {
      message.error("Lỗi rồi")
    }
  }, [dataUpdate, isSuccessUpdate, isErrorUpdate])
  const onUpdateProduct = ()=>{
    const { idArr, image, nameArr, names } = stateCategoryDetails;
    mutationUpdateCategory.mutate({ token: user?.access_token, idArr, image, nameArr}, {
      onSettled: () => {//tự động load lại khi update
          queryCategory.refetch()
          queryCategoryChild.refetch()
      }
  })
  }
  return (
    <div>
      <div>
        <h1 className="WapperHeaderAdmin">Quản lý danh mục</h1>
        <div style={{ marginTop: '10px' }}>
          <Button style={{ height: '150px', width: '150px', borderRadius: '6px' }} onClick={() => setIsModalOpen(true)}><PlusCircleOutlined style={{ fontSize: '60px' }} /></Button>
        </div>
        <div style={{
          marginTop: '20px'
        }}>
          <TableComponent columns={columns} isLoading={isLoadingCateogrysParent} data={dataTable} onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id)
                setPreviousRowSelected(!previousRowSelected)
              }, // click row

            };
          }} />
        </div>
        <ModalComponent forceRender title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} className="modal=product" footer={null} width='50%'>
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
              label="Tên thể loại"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Please input your name!',
                },
              ]}
            >
              <InputComponent value={'' || stateCategory?.nameArr[0]} onChange={handleOnchange} name="name" />
            </Form.Item>

            <Form.Item
              label="Tên thể loại con"
              name="nameChild"
            >
              <ButtonComponent
                size={20}
                onClick={(() => { setAmountChildCategory(prev => prev + 1) })}
                styleButton={{
                  height: '30px',
                  width: '30px',
                  borderRadius: '4px',
                  padding: '2px 6px 6px',
                  backgroundColor: 'white',
                }}
                textButton={"+"}
                styleTextButton={
                  { color: 'black', fontSize: '14px' }
                } />
              {Array.from({ length: amountChildCategory }).map((_, index) => // giống như vòng for
                <div style={{ marginTop: '10px', display: 'flex' }} >
                  <InputComponent value={'' || stateCategory?.nameArr[index + 1]} onChange={handleOnchange} name={`name${index + 1}`} />
                  <ButtonComponent
                    size={20}
                    onClick={(() => { handleDeleteInputChild(`name${index + 1}`) })}
                    styleButton={{
                      height: '30px',
                      width: '30px',
                      borderRadius: '4px',
                      padding: '2px 6px 6px',
                      backgroundColor: 'white',
                      marginLeft: '6px'
                    }}
                    textButton={"-"}
                    styleTextButton={
                      { color: 'black', fontSize: '14px' }
                    } />
                </div>
              )}
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
                {stateCategory.image && (
                  <img src={stateCategory.image} style={{
                    height: '60px',
                    width: '60px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginLeft: '20px'
                  }} alt="avatar" />
                )}
              </Upload>

            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
              style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '0px' }}
            >
              <Button type="primary" htmlType="submit">
                Thêm
              </Button>
            </Form.Item>
          </Form>
        </ModalComponent>
        <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={handleCancelDetails} width="50%">
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
                label="Tên thể loại"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Tên thể loại không thể bỏ trống!',
                  },
                ]}
              >
                <InputComponent value={'' || stateCategoryDetails?.nameArr[0]} onChange={handleOnchangeDetails} name="name" />
              </Form.Item>

              <Form.Item
                label="Tên thể loại con"
                name="nameChild"  
              >
                <ButtonComponent
                size={20}
                styleButton={{
                  height: '30px',
                  width: '30px',
                  borderRadius: '4px',
                  padding: '2px 6px 6px',
                  backgroundColor: 'white',
                }}
                textButton={"+"}
                styleTextButton={
                  { color: 'black', fontSize: '14px' }
                } />
                {Array.from({ length: amountChildCategoryDetails }).map((_, index) => // giống như vòng for
                  <div style={{ marginTop: '10px', display: 'flex' }} >
                    <InputComponent value={'' || stateCategoryDetails?.nameArr[index + 1]} onChange={handleOnchangeDetails} name={`name${index + 1}`} />
                  </div>
                )}
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
                  {stateCategoryDetails.image && (
                    <img src={stateCategoryDetails.image} style={{
                      height: '60px',
                      width: '60px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginLeft: '20px'
                    }} alt="avatar" />
                  )}
                </Upload>

              </Form.Item>
              <Form.Item
                  wrapperCol={{
                      offset: 8,
                      span: 16,
                  }}
                  style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '50px' }}
              >
                  <Button type="primary" htmlType="submit">
                      Cập nhập
                  </Button>
              </Form.Item>

            </Form>
          </Loading>
        </DrawerComponent>
      </div>
    </div>
  )
}


export default AdminCategory