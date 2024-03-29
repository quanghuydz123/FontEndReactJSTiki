import React, { useEffect, useState } from "react";
import { Badge, Col, Popover } from 'antd';
import {WapperHeader,WapperTextHeader,WapperHeaderAccuont, WapperContentPopup} from './style'
import {
    UserOutlined,
    CaretDownOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as UserService from '../../services/UserService'
import { useDispatch} from 'react-redux'
import { resetUser } from "../../redux/slides/userSlide";
import Loading from "../LoadingComponent/Loading";
import { searchProduct } from "../../redux/slides/productSlide";
const Header = ({isHiddenSearch = false,isHiddenCart = false,isAdmin=false})=>{
    //lấy dữ liệu truyền vào redux
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading,setLoading] = useState(false)
    const [userName,setUserName] = useState('')
    const [userAvatar,setUserAvatar] = useState('')
    const [search,setSearch] = useState('')
    const [typeProducts,setTypeProducts]= useState([])
    const order = useSelector((state) => state.order)

    const handleNavigateLogin = ()=>{
        navigate('/sign-in') // chuyển đến
    }
    
    const handleNavigateHome = (event)=>{
            // Check if Ctrl (or Command on Mac) key is pressed
            if (event.ctrlKey || event.metaKey) {
                // Open link in a new tab
                window.open('/', '_blank');
            } else {
                // Handle navigation normally
                navigate('/')
            }
    }
    const handleNavigateAdminHome = (event)=>{
        // Check if Ctrl (or Command on Mac) key is pressed
        if (event.ctrlKey || event.metaKey) {
            // Open link in a new tab
            window.open('/system/admin', '_blank');
        } else {
            // Handle navigation normally
            navigate('/system/admin')
        }
}
    const handleNavigateProfile = (event)=>{
        if (event.ctrlKey || event.metaKey) {
            // Open link in a new tab
            window.open('/profile-user', '_blank');
        } else {
        navigate('/profile-user')
        }
    }
    const handleLogout = async () => {
        setLoading(true)
        await UserService.loguotUser()
        dispatch(resetUser())
        localStorage.removeItem('access_token')
        navigate('/ ')
        setLoading(false)
    }
    const handleNavigateManager=(event)=>{
        if (event.ctrlKey || event.metaKey) {
            // Open link in a new tab
            window.open('/system/admin', '_blank');
        } else {
        navigate('/system/admin')
        }
    }
    useEffect(()=>{
        setLoading(true)
        setUserName(user?.name)
        setUserAvatar(user?.avatar)
        setLoading(false)
    },[user.name,user?.avatar])
    const handleMyOrder = ()=>{
        navigate(`/my-order`,{state:{id:user?.id,token:user?.access_token}})
    }
    const content = (
        <div>
          <WapperContentPopup onClick={handleNavigateProfile}>Thông tin người dùng</WapperContentPopup>
          {user?.isAdmin && <WapperContentPopup onClick={handleNavigateManager}>Quản lý hệ thống</WapperContentPopup>}
          <WapperContentPopup onClick={handleMyOrder}>Đơn hàng của tôi</WapperContentPopup>
          <WapperContentPopup onClick={handleLogout}>Đăng xuất</WapperContentPopup>
        </div>
      );
    const onSearch = (e)=>{
        setSearch(e.target.value)
        dispatch(searchProduct(e.target.value))
    }
    //const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);
    return (
        <div>
             <WapperHeader style={{display:"flex",alignItems:'center'}}>
            {isAdmin ? <Col span={18}><WapperTextHeader onClick={handleNavigateHome}>Shop của tôi</WapperTextHeader></Col> :
            <Col span={5}><WapperTextHeader onClick={handleNavigateHome}>Shop của tôi</WapperTextHeader></Col>}
             
                {!isHiddenSearch &&
                    (                    <Col span={13}>
                        <ButtonInputSearch
                            size='large'
                            textButton = 'Tìm kiếm'
                            placeholder='Bạn tìm gì hôm nay'
                            onChange={onSearch}
                        />      
                        
                        </Col>)
                }
                
                <Col span={6} style={{
                    display:'flex',
                    gap:'54px',
                    alignItems:'center'
                }}>
                    <Loading isLoading={loading}>
                        <WapperHeaderAccuont>
                            {userAvatar ? (
                                <img src={userAvatar} style={{
                                    height:'40px',
                                    width:'40px',
                                    borderRadius:'50%',
                                    objectFit:'cover'
                                }} alt="avatar"/>
                            ): <UserOutlined style={{fontSize:'35px'}} />}
                            
                            {userName ? (
                                <>
                                    
                                    <Popover content={content} trigger="hover" >
                                        <div style={{cursor:'pointer'}} >{userName}</div>
                                    </Popover>
                                </>
                            ):
                            <div onClick={handleNavigateLogin} style={{cursor:'pointer'}}>
                            <span>Đăng nhập/Đăng ký</span>
                            <div>
                                <span>Tài khoản</span>
                                <CaretDownOutlined />
                            </div>
                        </div>
                        }
                        
                        </WapperHeaderAccuont>
                    </Loading>
                    {!isHiddenCart && (
                        <div onClick={() => navigate('/order')} style={{cursor:'pointer'}}>
                        {/* Badge icon shop */}
                        <Badge count={order?.orderItems.length} size="small"> 
                            <ShoppingCartOutlined style={{fontSize:'35px', color:'#fff'}} />    
                        </Badge>
                        
                        <span style={{fontSize:'12px',color:'#fff'}}>Giỏ hàng</span>
                    </div>
                    )}
                </Col>
            </WapperHeader>
           
            
        </div>
        
    )
}

export default Header