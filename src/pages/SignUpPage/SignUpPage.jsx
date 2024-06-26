import React, { useEffect } from "react";
import InputFormComponent from "../../components/InputFormComponent/InputFormComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { colors } from "../../contants/index";
import logoLogin from '../../assets/images/logodangnhap.png'
import { Image } from "antd";
import {
    EyeFilled,
    EyeInvisibleFilled,
} from '@ant-design/icons';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as UserService from '../../services/UserService'
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/message"
const SignUpPage = ()=>{
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [confirmPassword,setComfirmPassword] = useState('')
    const [checkOtp,setCheckOpt] = useState(false)
    const [emailSendOpt,setEmailSendOpt] = useState('')
    const mutation = useMutationHooks(//call api
         (data) => UserService.signupUser(data)
    )
    const [valueOpt,setValueOpt] = useState(Math.floor(Math.random() * (999999-100000))+100000)
    const {data, isPending , isSuccess ,isError,error} = mutation
    useEffect(()=>{
        if(data?.status === "ERR"){
            message.error()   
        }
        else if(isSuccess){
            message.success()
        }else if(isError){
            message.error()
        }
    },[isSuccess ,isError,data])
    
    const handleOnchangeEmail = (e)=>{
        setEmail(e.target.value)
    }

    const hanleOnChangePassword = (e)=>{
        setPassword(e.target.value)
    }

    const hanleOnChangeComfirmPassword = (e)=>{
        setComfirmPassword(e.target.value)
    }

    const handleSignUp = ()=>{
        mutation.mutate({
            name:"Người dùng",
            phone:"",
            email,// truyền data req.body
            password,
            confirmPassword
        })
        console.log(email , password , confirmPassword)
    }
    const navigate = useNavigate()
    const handleNavigateSignIn = ()=>{
        navigate('/sign-in')
    }
    const handleOnchangeInputOpt = (e) => {
        if (e.target.value === valueOpt.toString()) {
            setCheckOpt(true)
        }
        else { setCheckOpt(false) }
    }
    const handleSendOpt=()=>{
        setCheckOpt(false)
        setValueOpt(Math.floor(Math.random() * (999999-100000))+100000)
        
    }
    const mutationSendOpt = useMutationHooks(//call api
         (data) => UserService.sendOptCreateAccount(data)
    )
    const {data:dataSendOpt, isPending:isPendingSendOpt , isSuccess:isSuccessSendOpt ,isError:isErrorSendOpt} = mutationSendOpt
    console.log("dataSendOpt",mutationSendOpt)
    useEffect(()=>{
        if(dataSendOpt?.status === "ERR"){
            message.error(dataSendOpt?.message)   
        }
        else if(dataSendOpt?.status === "OK"){
            message.success(dataSendOpt?.message)   
            setEmailSendOpt(email)
        }
        else if(isSuccessSendOpt){
            message.success()
            setEmailSendOpt(email)
        }else if(isErrorSendOpt){
            message.error()
        }
    },[isSuccessSendOpt ,isErrorSendOpt,dataSendOpt])
    useEffect(()=>{
        if(email)
        {
           try {
                mutationSendOpt.mutate({
                    email,
                    opt:valueOpt,
                })
           } catch (error) {
                message.error(error)
           }
        }

    },[valueOpt])
    return (
        <Loading isLoading={isPending} >
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'rgb(0,0,0,0.1)',height:'100vh'}}>
            <div style={{ width: '800px', height: '445px', borderRadius: '10px', backgroundColor: 'white' ,display:'flex'}}>
                <div className="WrapperContainerLeft">
                    <h2>Xin chào,</h2>
                    <p>Đăng ký</p>
                    <InputFormComponent placeholder="Nhập email đăng ký" style={{marginBottom:'10px'}} value={email} handleOnChange={handleOnchangeEmail} />
                    <div style={{display:'flex',alignItems:'center'}}>
                        <InputFormComponent  handleOnChange={handleOnchangeInputOpt} placeholder="Nhập OTP" style={{marginRight:'20px'}} />
                        <ButtonComponent
                        size={20}
                        disabled={(checkOtp && emailSendOpt===email) || !email}
                        onClick={handleSendOpt}
                        styleButton={{
                            backgroundColor: colors.primary,
                            height: '30px',
                            width: '180px',
                            border: 'none',
                            borderRadius: '4px',
                        }}
                        textButton={"Gửi"}
                        styleTextButton={{ color: 'white' }}
                    />
                    </div>
                    <div style={(checkOtp && emailSendOpt===email) ? { position: 'relative',marginTop:'10px' } : { position: 'relative',display:'none',marginTop:'10px' }}>
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
                        style={{marginBottom:'10px'}} 
                        value={password}
                        handleOnChange={hanleOnChangePassword}
                        />
                    </div>
                    <div style={(checkOtp && emailSendOpt===email) ? { position: 'relative' } : { position: 'relative',display:'none' }}>
                        <span
                        onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                        style={{
                            zIndex: 10,
                            position: 'absolute',
                            top: '4px',
                            right: '8px'
                        }}
                        >{
                            isShowConfirmPassword ? (
                            <EyeFilled />
                            ) : (
                            <EyeInvisibleFilled />
                            )
                        }
                        </span>
                        <InputFormComponent placeholder="Nhập lại mật khẩu" type={isShowConfirmPassword ? "" : "password"}
                        value={confirmPassword}
                        handleOnChange={hanleOnChangeComfirmPassword}
                        />
                    </div>
                    {isError || (data?.status === "ERR") ? (error === null ? <span style={{color:'red'}}>{data?.message}</span> : <span style={{color:'red'}}>{error.response.data.message }</span>) : <span style={{color:'green'}}>{data?.message}</span>}
                    <ButtonComponent
                        disabled={!email || !password || !confirmPassword}
                        onClick={handleSignUp}
                        size={20}
                        styleButton={{
                            backgroundColor: colors.primary,
                            height: '48px',
                            width: '100%',
                            border: 'none',
                            borderRadius: '4px',
                            margin:'26px 0 10px'
                        }}
                        textButton={"Đăng ký"}
                        styleTextButton={{ color: 'white' }}
                    />
                    <p style={{margin:0}}>Bạn đã có tài khoản ? <span className="WrapperTextLight" onClick={handleNavigateSignIn}>Đăng nhập</span></p>
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

export default SignUpPage