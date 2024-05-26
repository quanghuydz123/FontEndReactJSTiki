import React from "react";
import { PhoneFilled } from '@ant-design/icons'
import ContainerComponent from "../ContainerComponent/ContainerComponent";


const FooterComponent = () => {
    const navigateMyInfo = (type)=>{
        if(type==='facebook'){
            window.open('https://www.facebook.com/profile.php?id=100020192589799', '_blank');
        }else if(type==='youtube'){
            window.open('https://www.youtube.com/channel/UC9gUhRfRLos74SvQthPhNMQ', '_blank');
        }else if(type==='zalo'){
            window.open('https://zalo.me/0367386108', '_blank');
        }
    }
    return (
        <>
        <ContainerComponent style={{ backgroundColor: '#183544' }}>
        <div style={{width:'100%'}}>
            <div style={{  display: 'flex', justifyContent: 'space-around' }}>
                <div style={{ flex:'1' }}>
                    <h1 style={{ fontSize: '22px', color: 'white' }}><span style={{ textDecoration: 'underline' }}>SHOP</span> CỦA TÔI</h1>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src="https://khothietbicamtay.com/view/dia-chi.png" alt="phone" style={{ width: '30px', height: '30px', marginRight: '10px' }} />
                            <span style={{ padding: '10px 0px', fontSize: '15px', color: 'white' }}>19/25 ĐS 8, P.Linh Trung, Thủ Đức, TPHCM</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src="https://khothietbicamtay.com/view/dien-thoai.png" alt="phone" style={{ width: '30px', height: '30px', marginRight: '10px' }} />
                            <span style={{ padding: '10px 0px', fontSize: '15px', color: 'white' }}>0367.386.108</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src="https://khothietbicamtay.com/view/mail.png" alt="phone" style={{ width: '30px', height: '30px', marginRight: '10px' }} />
                            <span style={{ padding: '10px 0px', fontSize: '15px', color: 'white' }}>dinhphongtamquoc453@gmail.com</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src="https://khothietbicamtay.com/view/web.png" alt="phone" style={{ width: '30px', height: '30px', marginRight: '10px' }} />
                            <span style={{ padding: '10px 0px', fontSize: '15px', color: 'white' }}>https://shopcuatoi.com</span>
                        </div>
                    </div>

                </div>
                <div style={{ flex:'1' }}>
                    <h1 style={{ fontSize: '22px', color: 'white' }}><span style={{ textDecoration: 'underline' }}>VỀ</span> CHÚNG TÔI</h1>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ padding: '10px 0px', fontSize: '15px', color: 'white' }}>Hướng dẫn mua hàng</span>
                        <span style={{ padding: '10px 0px', fontSize: '15px', color: 'white' }}>Liên hệ</span>
                        <span style={{ padding: '10px 0px', fontSize: '17px', fontWeight: '700', color: 'white' }}>Chấp nhập thanh toán</span>
                        <img src="https://khothietbicamtay.com/view/thanh-toan.png" alt="Thanh toán" style={{ width: '100%', height: '65px' }}></img>
                    </div>
                </div>
                <div style={{ flex:'1' }}>
                    <h1 style={{ fontSize: '22px', color: 'white' }}><span style={{ textDecoration: 'underline' }}>KẾT</span> NỐI VỚI CHÚNG TÔI</h1>
                    <div style={{ display: 'flex' }}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Facebook-icon-1.png/768px-Facebook-icon-1.png" onClick={()=>navigateMyInfo('facebook')} alt="facebook" style={{ width: '32px', height: '32px',borderRadius:'50%',margin:'0 5px',cursor:'pointer' }}></img>
                        <img src="https://static-00.iconduck.com/assets.00/youtube-icon-512x512-80maysdk.png" onClick={()=>navigateMyInfo('youtube')} alt="youtube" style={{ width: '32px', height: '32px',borderRadius:'50%',margin:'0 5px',cursor:'pointer' }}></img>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/1024px-Icon_of_Zalo.svg.png" onClick={()=>navigateMyInfo('zalo')} alt="zalo" style={{ width: '32px', height: '32px',borderRadius:'50%' ,margin:'0 5px',cursor:'pointer'}}></img>
                    </div>
                </div>
            </div>
        </div>
        </ContainerComponent>
        <div style={{ backgroundColor: '#0e2530', height: '37px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <span style={{ color: 'white', fontSize: '13px' }}>Copyright © SHOP CỦA TÔI 2024. All rights reserved. </span>
    </div>  
    </>
    )
}

export default FooterComponent