import React, { useEffect, useState } from "react";
import InputFormComponent from "../../components/InputFormComponent/InputFormComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { colors } from "../../contants/index";
import { useSelector } from "react-redux";
import { useDispatch} from 'react-redux'
import { updateUser } from "../../redux/slides/userSlide";
import * as UserService from '../../services/UserService'
import { isJsonString } from "../../utils";
import { jwtDecode } from "jwt-decode";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from "../../components/Message/message"
import { Button, Upload } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import {getBase64} from '../../utils'
const ProfilePage = ()=>{
    const user = useSelector((state) => state.user)
    const [email,setEmail] = useState(user.email)
    const [name,setName] = useState(user.name)
    const [phone,setPhone] = useState(user.phone)
    const [address,setAddress] = useState(user.address)
    const [avatar,setAvatar] = useState(user.avatar)
    const mutation = useMutationHooks(//call api
        (data) => {
            const {id,access_token,...rests} = data
            const res = UserService.updateUser(id,rests,access_token)
            return res
        }
    )
    const dispatch = useDispatch()
    const {data, isPending, isSuccess,isError,error} = mutation
    console.log('user',user)
    useEffect(()=>{
        setEmail(user?.email)
        setAddress(user?.address)
        setName(user?.name)
        setPhone(user?.phone)
        setAvatar(user?.avatar)
    },[user])
    useEffect(()=>{
        if(data?.status==="OK"){
            console.log("data?.user",data?.user)
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
        })
    }
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
        </div>
    )
}

export default ProfilePage