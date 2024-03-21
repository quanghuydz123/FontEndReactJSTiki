import React from "react";
import { PhoneFilled } from '@ant-design/icons'


const FooterComponent = ()=>{
    return (
        <div style={{backgroundColor:'#183544'}}>
                    <div style={{padding:'10px 120px',display:'flex',justifyContent:'space-around'}}>
                            <div style={{width:'610px'}}>
                                <h1 style={{fontSize:'22px',color:'white'}}><span style={{textDecoration:'underline'}}>SHOP</span> CỦA TÔI</h1>
                                <div style={{display:'flex',flexDirection:'column'}}>
                                    <div style={{display:'flex',alignItems:'center'}}>
                                        <img src="https://khothietbicamtay.com/view/dia-chi.png" alt="phone" style={{width:'30px',  height:'30px', marginRight:'10px'}}/>
                                        <span style={{padding:'10px 0px',fontSize:'15px',color:'white'}}>19/25 ĐS 8, P.Linh Trung, Thủ Đức, TPHCM</span>
                                    </div>
                                    <div style={{display:'flex',alignItems:'center'}}>
                                        <img src="https://khothietbicamtay.com/view/dien-thoai.png" alt="phone" style={{width:'30px',  height:'30px', marginRight:'10px'}}/>
                                        <span style={{padding:'10px 0px',fontSize:'15px',color:'white'}}>0367.386.108</span>
                                    </div>
                                    <div style={{display:'flex',alignItems:'center'}}>
                                        <img src="https://khothietbicamtay.com/view/mail.png" alt="phone" style={{width:'30px',  height:'30px', marginRight:'10px'}}/>
                                        <span style={{padding:'10px 0px',fontSize:'15px',color:'white'}}>dinhphongtamquoc453@gmail.com</span>
                                    </div>
                                    <div style={{display:'flex',alignItems:'center'}}>
                                        <img src="https://khothietbicamtay.com/view/web.png" alt="phone" style={{width:'30px',  height:'30px', marginRight:'10px'}}/>
                                        <span style={{padding:'10px 0px',fontSize:'15px',color:'white'}}>https://shopcuatoi.com</span>
                                    </div>
                                </div>
                                
                            </div>
                            <div style={{width:'610px'}}>
                                <h1 style={{fontSize:'22px',color:'white'}}><span style={{textDecoration:'underline'}}>VỀ</span> CHÚNG TÔI</h1>
                                <div style={{display:'flex',flexDirection:'column'}}>
                                    <span style={{padding:'10px 0px',fontSize:'15px',color:'white'}}>Hướng dẫn mua hàng</span>
                                    <span style={{padding:'10px 0px',fontSize:'15px',color:'white'}}>Liên hệ</span>
                                    <span style={{padding:'10px 0px',fontSize:'17px', fontWeight:'700',color:'white'}}>Chấp nhập thanh toán</span>
                                    <img src="https://khothietbicamtay.com/view/thanh-toan.png" alt="Thanh toán" style={{width:'336px', height:'65px'}}></img>
                                </div>
                            </div>
                    </div>
                    <div style={{backgroundColor:'#0e2530',height:'37px',display:'flex',justifyContent:'center',alignItems:'center'}}>
                        <span style={{color:'white',fontSize:'13px'}}>Copyright © SHOP CỦA TÔI 2024. All rights reserved. </span>
                    </div>
               </div>
    )
}

export default FooterComponent