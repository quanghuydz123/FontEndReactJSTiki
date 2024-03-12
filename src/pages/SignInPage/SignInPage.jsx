import React, { useEffect } from "react";
import { useState } from "react";
import InputFormComponent from "../../components/InputFormComponent/InputFormComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { colors } from "../../contants/index";
import logoLogin from '../../assets/images/logodangnhap.png'
import { Image } from "antd";
import {
    EyeFilled,
    EyeInvisibleFilled,
} from '@ant-design/icons';
import { useLocation, useNavigate } from "react-router-dom";
import * as UserService from '../../services/UserService'
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/message"
import { jwtDecode } from "jwt-decode";
import { useDispatch} from 'react-redux'
import { updateUser } from "../../redux/slides/userSlide";
const SignInPage = ()=>{
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const location = useLocation()
    //redux 
    const dispatch = useDispatch()

    const mutation = useMutationHooks(//call api
         (data) => UserService.loginUser(data)
    )
    const {data, isPending, isSuccess,isError,error} = mutation

    useEffect(()=>{
        if(data?.status === "ERR"){
            message.error()   
        }
        else if(isSuccess){
            if(location?.state){
                navigate(location.state)
            }
            else{
                navigate('/')
            }
            localStorage.setItem('access_token', JSON.stringify(data?.access_token)) //lưu trữ tokens
            if(data?.access_token){ //giải mã token
                const decoded = jwtDecode(data?.access_token);
                if(decoded?.id){
                    handleGetDetailsUser(decoded?.id,data?.access_token)
                }
            }
        }
    },[isSuccess,data])
    const handleGetDetailsUser = async (id,token)=>{
        const res = await UserService.getDetailsUser(id,token)
        dispatch(updateUser({...res?.data,access_token:token}))
    }
    
    const handleOnchangeEmail = (e)=>{  
        setEmail(e.target.value)
    }

    const hanleOnChangePassword = (e)=>{
        setPassword(e.target.value)
    }

    const handleSignIn = ()=>{//call api
        mutation.mutate({
            email,
            password
        })
    }
    const navigate = useNavigate()
    const handleNavigateSignUp = ()=>{
        navigate('/sign-up')
    }
    //call api bằng useMutation của react query
    
    return (
        <Loading isLoading={isPending} >
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'rgb(0,0,0,0.1)',height:'100vh'}}>
            <div style={{ width: '800px', height: '445px', borderRadius: '10px', backgroundColor: 'white' ,display:'flex'}}>
                <div className="WrapperContainerLeft">
                    <h2>Xin chào,</h2>
                    <p>Đăng nhập và tạo tài khoản</p>
                    <InputFormComponent placeholder="Nhập tài khoản" style={{marginBottom:'10px'}} value={email} handleOnChange={handleOnchangeEmail}/>
                    <div style={{ position: 'relative' }}>
                        <span
                        onClick={() => setIsShowPassword(!isShowPassword)}
                        style={{
                            zIndex: 10,
                            position: 'absolute',
                            top: '4px',
                            right: '8px'
                        }}
                        >{
                            isShowPassword ? (
                            <EyeFilled />
                            ) : (
                            <EyeInvisibleFilled />
                            )
                        }
                        </span>
                        <InputFormComponent placeholder="Nhập mật khẩu" type={isShowPassword ? "" : "password"}
                        value={password}
                        handleOnChange={hanleOnChangePassword}
                        />
                    </div>
                    {isError || (data?.status === "ERR") ? (error === null ? <span style={{color:'red'}}>{data?.message}</span> : <span style={{color:'red'}}>{error.response.data.message }</span>) : <span style={{color:'green'}}>{data?.message}</span>}
                    
                        <ButtonComponent
                            disabled={!email || !password}
                            onClick={handleSignIn}
                            size={20}
                            styleButton={{
                                backgroundColor: colors.primary,
                                height: '48px',
                                width: '100%',
                                border: 'none',
                                borderRadius: '4px',
                                margin:'26px 0 10px'
                            }}
                            textButton={"Đăng nhập"}
                            styleTextButton={{ color: 'white' }}
                        />
                    
                    <p className="WrapperTextLight">Quên mật khẩu ?</p>
                    <p style={{margin:0}}>Chưa có tài khoản ? <span className="WrapperTextLight" onClick={handleNavigateSignUp}>Tạo tài khoản</span></p>
                </div>
                <div className="WrapperContainerRight">
                    <div style={{
                        backgroundColor:''
                    }}>
                        <Image src={logoLogin} preview={false} alt="image-logo" width={203} height={203}/>
                        <h4 style={{textAlign:'center'}}>Mua sắm tại shop tôi</h4>
                    </div>  
                </div>
            </div>
        </div>
        </Loading>
    )
}

export default SignInPage