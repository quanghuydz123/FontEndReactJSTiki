import { Col, Image, InputNumber, Row } from "antd";
import React from "react";
import {
    StarFilled,
    PlusOutlined,
    MinusOutlined
} from '@ant-design/icons';
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

const ProductDetailComponent = ()=>{
    return (
        <div>
            <Row style={{padding:'16px',backgroundColor:'#fff',borderRadius:'4px'}}>
                <Col span={10} style={{borderRight:'1px solid #e5e5e5',paddingRight:'8px'}}>
                    <Image src="https://salt.tikicdn.com/cache/750x750/ts/product/a2/38/6c/ce008c63f4ac771550439da44f5f8ee8.png.webp"
                    preview={false}
                    alt="image-product"
                    />
                    <Row style={{display:'flex',paddingTop:'10px',justifyContent:'space-between'}}>
                        <Col span={4}>
                            <Image src="https://salt.tikicdn.com/cache/280x280/media/catalog/producttmp/e7/37/0e/bf3b0407b0b0180fae83c6ff215b8519.png.webp"
                            preview={false}
                            alt="image-product"
                            className="WrapperStyleImageSmall"
                            />
                        </Col>
                        <Col span={4}>
                            <Image src="https://salt.tikicdn.com/cache/280x280/media/catalog/producttmp/e7/37/0e/bf3b0407b0b0180fae83c6ff215b8519.png.webp"
                            preview={false}
                            alt="image-product"
                            className="WrapperStyleImageSmall"
                            />
                        </Col>
                        <Col span={4}>
                            <Image 
                            className="WrapperStyleImageSmall"
                            src="https://salt.tikicdn.com/cache/280x280/media/catalog/producttmp/e7/37/0e/bf3b0407b0b0180fae83c6ff215b8519.png.webp"
                            preview={false}
                            alt="image-product"
                            
                            />
                        </Col>

                        <Col span={4}>
                            <Image 
                            className="WrapperStyleImageSmall"
                            src="https://salt.tikicdn.com/cache/280x280/media/catalog/producttmp/e7/37/0e/bf3b0407b0b0180fae83c6ff215b8519.png.webp"
                            preview={false}
                            alt="image-product"
                            
                            />
                        </Col>
                        <Col span={4}>
                            <Image 
                            className="WrapperStyleImageSmall"
                            src="https://salt.tikicdn.com/cache/280x280/media/catalog/producttmp/e7/37/0e/bf3b0407b0b0180fae83c6ff215b8519.png.webp"
                            preview={false}
                            alt="image-product"
                            
                            />
                        </Col>
                        <Col span={4}>
                            <Image 
                            className="WrapperStyleImageSmall"
                            src="https://salt.tikicdn.com/cache/280x280/media/catalog/producttmp/e7/37/0e/bf3b0407b0b0180fae83c6ff215b8519.png.webp"
                            preview={false}
                            alt="image-product"
                            
                            />
                        </Col>

                        
                        
                    </Row>
                </Col>
                <Col span={14} style={{paddingLeft:'10px'}} >
                    <h1 className="WapperStyleNameProduct">Điện Thoại Nokia C30 (2GB/32GB) - Hàng Chính Hãng</h1>
                    <div>
                        <StarFilled style={{fontSize:12,color:"rgb(253,216,54)"}}/>
                        <StarFilled style={{fontSize:12,color:"rgb(253,216,54)"}}/>
                        <StarFilled style={{fontSize:12,color:"rgb(253,216,54)"}}/>
                        <span className="WapperStyleTextSell"> | Đã bán 1000+</span>
                    </div>
                    <div className="WrapperPriceProduct">
                        <h1 className="WrapperPriceTextProduct">
                            15.490.000₫
                        </h1>
                    </div>
                    <div className="WrapperAddresstProduct">
                        <span> Giao đến </span> 
                        <span className="address">Q. 1, P. Bến Nghé, Hồ Chí Minh </span>
                        <span className="change-address"> Đổi địa chỉ</span>
                    </div>  
                    <div style={{margin:'10px 0 20px',borderTop:'1px solid #e5e5e5',borderBottom:'1px solid #e5e5e5',padding:'10px 0'}}>
                        <div style={{marginBottom:'6px'}}>Số lượng</div>
                        <div className="WrapperQualityProduct">
                            <button style={{border:'none',backgroundColor:'transparent'}}>
                                <MinusOutlined style={{fontSize:'20px'}}/>
                            </button>
                            
                            <InputNumber min={1} max={10} defaultValue={3} size="" className=""/>
                            <button style={{border:'none',backgroundColor:'transparent'}}>
                                <PlusOutlined style={{fontSize:'20px'}}/>
                            </button>
                        </div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                        <ButtonComponent 
                            size={20}
                            styleButton={{
                                backgroundColor:'rgb(255,57,69)',
                                height:'48px',
                                width:'220px',
                                border:'none',
                                borderRadius:'4px'
                            }}
                            textButton={"Chọn mua"}
                            styleTextButton={{color:'white'}}
                        />

                        <ButtonComponent 
                            size={20}
                            styleButton={{
                                backgroundColor:'#fff',
                                height:'48px',
                                width:'220px',
                                border:'1px solid rgb(13,92,182)',
                                borderRadius:'4px'
                            }}
                            textButton={"Mua trả sau"}
                            styleTextButton={{color:'rgb(13,92,182)',fontSize:'15px',fontWeight:500}}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default ProductDetailComponent