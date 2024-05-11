import React, { useEffect, useState } from "react";
import InputFormComponent from "../../components/InputFormComponent/InputFormComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { colors } from "../../contants/index";
import { useSelector } from "react-redux";
import { useDispatch} from 'react-redux'
import { updateUser } from "../../redux/slides/userSlide";
import * as UserService from '../../services/UserService'
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from "../../components/Message/message"
import { Button, Upload,Form } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import {getBase64} from '../../utils'
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
const ProfilePage = ()=>{
    const user = useSelector((state) => state.user)
    const [email,setEmail] = useState(user.email)
    const [name,setName] = useState(user.name)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [phone,setPhone] = useState(user.phone)
    const [address,setAddress] = useState(user.address)
    const [form] = Form.useForm()
    const [avatar,setAvatar] = useState(user.avatar)
    const [stateChangePassword, setStateChangePassword] = useState({
        email:user?.email,
        password:'',
        passwordNew:'',
        comfirmPasswordNew:''
    })
    const mutation = useMutationHooks(//call api
        (data) => {
            const {id,access_token,...rests} = data
            const res = UserService.updateUser(id,rests,access_token)
            return res
        }
    )
    const dispatch = useDispatch()
    const {data, isPending, isSuccess,isError,error} = mutation
    useEffect(()=>{
        setEmail(user?.email)
        setAddress(user?.address)
        setName(user?.name)
        setPhone(user?.phone)
        setAvatar(user?.avatar)
    },[user])
    useEffect(()=>{
        if(data?.status==="OK"){
            message.success("Cập nhập thành công")
        }else if(data?.status==="ERR")
        { 
            message.error(data?.message)
        }
    },[data,isError,isSuccess])

    const handleOnchangeEmail = (e) =>{
        setEmail(e.target.value)
    }
    const handleOnchangePhone = (e) =>{
        setPhone(e.target.value)
    }
    const handleOnchangeName = (e) =>{
        setName(e.target.value)
    }
    const handleOnchangeAddress = (e) =>{
        setAddress(e.target.value)
    }
    const handleOnchangeAvatar = async({fileList}) =>{
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setAvatar(file.preview)
    }
    const handleUpdate =()=>{
        mutation.mutate({
            id:user?.id,
            email,
            name,
            phone,
            address,
            avatar,
            access_token:user?.access_token
        },{
            onSuccess:()=>{
                dispatch(updateUser({...user,_id:user?.id,email,name,phone,address,avatar}))
            }
        })
    }
    const handleCancel = () => {
        setIsModalOpen(false);
        setStateChangePassword({
            email:user?.email,
            password:'',
            passwordNew:'',
            comfirmPasswordNew:''
        })
        form.resetFields()//xóa hết value input
    };
    const handleOnchange = (e)=>{
        setStateChangePassword({
            ...stateChangePassword,
            [e.target.name]: e.target.value
        })
    }
    const mutationChangePassword = useMutationHooks(//call api
    (data) => UserService.changePassword(data)
)

    const onFinish = ()=>{
        mutationChangePassword.mutate(stateChangePassword)
    }
    const {data:dataChangePassword, isPending:isPendingChangePassword, isSuccess:isSuccessChangePassword,isError:isErrorChangePassword,error:errorChangePassword} = mutationChangePassword
    useEffect(()=>{
        if(dataChangePassword?.status==="OK"){
            message.success("Đổi mật khẩu thành công")
        }else if(dataChangePassword?.status==="ERR")
        { 
            message.error(dataChangePassword?.message)
        }else if(isSuccessChangePassword){
            message.success("Cập nhập thành công")
        }else if(isErrorChangePassword){
            message.error('Lỗi rồi')
        }
    },[dataChangePassword,isSuccessChangePassword,isErrorChangePassword])
    return (
        <div style={{width:'1270px', margin:'0 auto',marginBottom:'20px'}}>
            <h1 className="WapperHeaderProfile">Thông tin người dùng</h1>
            <div className="WapperContentProfile">
                <div className="WapperInputProfile">
                    <label className="WapperLabel" htmlFor="name">Họ tên</label>
                    <InputFormComponent style={{width:'400px'}} value={name} handleOnChange ={handleOnchangeName} id="name" />
                  
                </div>
                <div className="WapperInputProfile">
                    <label className="WapperLabel" htmlFor="email">Email</label>
                    <InputFormComponent disabled style={{width:'400px'}} value={email} handleOnChange ={handleOnchangeEmail} id="email" />
                   
                </div>
                <div className="WapperInputProfile">
                    <label className="WapperLabel" htmlFor="email">Mật khẩu</label>
                    <InputFormComponent disabled style={{width:'400px'}} value={'*************'}/>
                   <p className="labelChangePassword" onClick={(()=>setIsModalOpen(true))}>Đổi mật khẩu</p>
                </div>
                <div className="WapperInputProfile">
                    <label className="WapperLabel" htmlFor="phone">Số điện thoại</label>
                    <InputFormComponent style={{width:'400px'}} value={phone} handleOnChange ={handleOnchangePhone} id="phone" />
                </div>
                
                <div className="WapperInputProfile">
                    <label className="WapperLabel" htmlFor="address">Địa chỉ</label>
                    <InputFormComponent style={{width:'400px'}} value={address} handleOnChange ={handleOnchangeAddress} id="address" />
                            
                </div>

                <div className="WapperInputProfile">
                    <label className="WapperLabel" htmlFor="avatar">Avatar</label>
                    {avatar && (
                        <img src={avatar} style={{
                            height:'100px',
                            width:'100px',
                            borderRadius:'50%',
                            objectFit:'cover'
                        }} alt="avatar"/>
                    )}
                     <Upload onChange={handleOnchangeAvatar} className="WapperUploadFile" maxCount={1}>
                        <Button icon={<UploadOutlined />}>Select File</Button>
                    </Upload>
                    {/* <InputFormComponent style={{width:'400px'}} value={avatar} handleOnChange ={handleOnchangeAvatar} id="avatar" /> */}
                    
                </div>
                <div style={{display:'flex',justifyContent:'end'}}>
                
                    <ButtonComponent
                                onClick={handleUpdate}
                                size={20}
                                styleButton={{
                                    height: '30px',
                                    width: '150px',
                                    borderRadius: '4px',
                                    padding:'2px 6px 6px',
                                    backgroundColor: colors.primary,
                                }}
                                textButton={"Cập nhập"}
                                styleTextButton={{ color: 'white',fontSize:'15px',fontWeight:'700'}}
                        />
                </div>
            </div>
            
            <ModalComponent forceRender title="Đổi mật khẩu" isOpen={isModalOpen} onCancel={handleCancel}  className="modal=product" footer={null} width='50%'>
                    <Form
                        name="basic"
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        style={{
                            maxWidth: 600,
                        }}
                        form={form}
                        onFinish={onFinish}
                        autoComplete="off"//
                    >
                        <Form.Item
                            label="Mật khẩu hiện tại"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mật khẩu hiện tại!',
                                },
                            ]}
                        >
                            <InputComponent value={stateChangePassword.password} name="password" type={'password'} onChange={handleOnchange}/>
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu mới"
                            name="passwordNew"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mật khẩu!',
                                },
                            ]}
                        >
                            <InputComponent value={stateChangePassword.passwordNew} name="passwordNew" type={'password'} onChange={handleOnchange}/>
                        </Form.Item>
                        <Form.Item
                            label="Nhập lại mật khẩu mới"
                            name="confirmPasswordNew"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui long nhập lại mật khẩu mới!',
                                },
                            ]}
                        >
                            <InputComponent value={stateChangePassword.comfirmPasswordNew} name="comfirmPasswordNew" type={'password'} onChange={handleOnchange} />
                        </Form.Item>
                       <div style={{display:'flex',justifyContent:'end'}}>
                        <Button type="primary" htmlType="submit">
                                    Đổi mật khẩu
                            </Button>
                       </div>
            </Form>
            </ModalComponent>
        </div>
        
    )
}

export default ProfilePage