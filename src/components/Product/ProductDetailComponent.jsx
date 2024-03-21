import { Col, Image, InputNumber, Rate, Row, message } from "antd";
import React, { useState } from "react";
import {
    StarFilled,
    PlusOutlined,
    MinusOutlined
} from '@ant-design/icons';
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import * as ProductService from '../../services/ProductService'
import { useQuery } from "@tanstack/react-query";
import Loading from "../LoadingComponent/Loading";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addOrderProduct } from "../../redux/slides/orderSlide";
import { convertPrice } from "../../utils";
import logo from '../../assets/images/logo.png'

const ProductDetailComponent = ({idProduct})=>{
    const user = useSelector((state) => state.user)
    const order = useSelector((state) => state.order)
    const navigate = useNavigate()
    const location = useLocation()
    const [numProduct,setNumProduct] = useState(1)
    const dispatch = useDispatch()
    const fetchProductDetails = async ()=>{
        const res = await ProductService.getDetailsProduct(idProduct)
        return res?.data
    }
    const onChange = (e)=>{
        setNumProduct(Number(e.target.value))
    }
    const queryProduct = useQuery({
        queryKey: ['products-details'],
        queryFn: fetchProductDetails,
        retry: 3,
        retryDelay: 1000,
    });
    const { isLoading:isLoadingProduct, data:productDetails } = queryProduct
    // const renderStar = (num)=>{
    //     const stars = []
    //     for(let i=0;i<num;i++){
    //         stars.push(<StarFilled style={{fontSize:12,color:"rgb(253,216,54)"}}/>)
    //     return stars
    // }
    const handleChangeCount = (type)=>{
        if(type === 'increase'){
            setNumProduct(prev => prev + 1)
        }
        else{
            setNumProduct(prev => prev > 1   ? prev - 1 : prev)
        } 
    }
    const handleAddOrderProduct = ()=>{
        if(!user?.id){
            navigate('/sign-in',{state:location.pathname}) //giữ lại trang khi người dùng đăng nhập lại
        }else{
            // {
            //     name: { type: String, required: true },
            //     amount: { type: Number, required: true },
            //     image: { type: String, required: true },
            //     price: { type: Number, required: true },
            //     discount: { type: Number },
            //     product: {
            //         type: mongoose.Schema.Types.ObjectId,
            //         ref: 'Product',
            //         required: true,
            //     },
            // },
            dispatch(addOrderProduct({
                orderItem:{
                    name: productDetails?.name,
                    amount:numProduct,
                    image:productDetails?.image,
                    price:productDetails?.price,
                    product:productDetails?._id,
                    discount:productDetails?.discount,
                    countInStock:productDetails?.countInStock
                }
            }))
            message.success("Đặt hàng thành công")
        }
    }
    return (
        <div>
            <Loading isLoading={isLoadingProduct}>
            <Row style={{padding:'16px',backgroundColor:'#fff',borderRadius:'4px'}}>
                <Col span={10} style={{borderRight:'1px solid #e5e5e5',paddingRight:'8px'}}>
                    <div style={{position:'relative'}}>
                        <img src={logo} style={{zIndex:'1'}} className="WrapperImage" alt="logo"/>
                        <Image src={productDetails?.image}
                        preview={false}
                        style={{
                            width:'507px',
                            height:'507px'
                        }}
                        alt="image-product"
                    />
                    </div>
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
                    <h1 className="WapperStyleNameProduct">{productDetails?.name}</h1>
                    <div>
                        {/* {renderStar(productDetails?.rating)} */}
                        <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} />
                        
                        <span className="WapperStyleTextSell"> | Đã bán {productDetails?.selled || 0}</span>
                    </div>
                    <div className="WrapperPriceProduct">
                        <h1 className="WrapperPriceTextProduct">
                            {convertPrice(productDetails?.price)}
                        </h1>
                    </div>
                    <div className="WrapperAddresstProduct">
                        <span> Giao đến </span> 
                        <span className="address">{user?.address}</span>
                        <span className="change-address"> Đổi địa chỉ</span>
                    </div>  
                    <div style={{margin:'10px 0 20px',borderTop:'1px solid #e5e5e5',borderBottom:'1px solid #e5e5e5',padding:'10px 0'}}>
                        <div style={{marginBottom:'6px'}}>Số lượng</div>
                        <div className="WrapperQualityProduct">
                            <button style={{border:'none',backgroundColor:'transparent',cursor:'pointer'}} onClick={()=>handleChangeCount('decrease')}>
                                <MinusOutlined style={{fontSize:'20px'}}/>
                            </button>
                            
                            <InputNumber min={1} max={10} onChange={onChange} value={numProduct} size="" className=""/>
                            <button style={{border:'none',backgroundColor:'transparent',cursor:'pointer'}} onClick={()=>handleChangeCount('increase')}>
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
                            onClick={handleAddOrderProduct}
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
            </Loading>
        </div>
    )
}

export default ProductDetailComponent