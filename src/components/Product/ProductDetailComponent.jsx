import { Badge, Col, Image, InputNumber, Rate, Row, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
    StarFilled,
    PlusOutlined,
    MinusOutlined,
    HeartFilled,
    HeartOutlined

} from '@ant-design/icons';
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import * as ProductService from '../../services/ProductService'
import * as LikeProductService from '../../services/LikeProductService'

import { useQuery } from "@tanstack/react-query";
import Loading from "../LoadingComponent/Loading";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addOrderProduct,resetOrder,buyNowProduct } from "../../redux/slides/orderSlide";
import { convertPrice } from "../../utils";
import logo from '../../assets/images/logo.png'
import { useMutationHooks } from "../../hooks/useMutationHook";

const ProductDetailComponent = ({setDescriptionProduct,setCategoryProduct,idProduct,setCategoryChildProduct})=>{
    const user = useSelector((state) => state.user)
    const order = useSelector((state) => state.order)
    const order123 = useRef(order?.orderItems.filter((order)=>order.product===idProduct))
    const navigate = useNavigate()
    const location = useLocation()
    const [numProduct,setNumProduct] = useState(1)
    const [likeProduct,setLikeProduct] = useState(false)
    const [check,setCheck] = useState(false)
    const dispatch = useDispatch()
    const fetchProductDetails = async (context)=>{
        const res = await ProductService.getDetailsProduct(context.queryKey[1])
        return res?.data
    }
    const onChange = (e)=>{
        setNumProduct(Number(e.target.value))
    }
    useEffect(()=>{
        order123.current=order?.orderItems.filter((order)=>order.product===idProduct)
    },[order,idProduct])
    const queryProduct = useQuery({
        queryKey: ['products-details',idProduct],
        queryFn: fetchProductDetails,
        enabled:idProduct ? true : false
    });
    const { isLoading:isLoadingProduct, data:productDetails } = queryProduct
    // const renderStar = (num)=>{
    //     const stars = []
    //     for(let i=0;i<num;i++){
    //         stars.push(<StarFilled style={{fontSize:12,color:"rgb(253,216,54)"}}/>)
    //     return stars
    // }
    useEffect(()=>{
        if(productDetails?.category?.name){
            setCategoryChildProduct(productDetails?.category?._id)
            setCategoryProduct(productDetails?.category)
            setDescriptionProduct(productDetails?.description)
        }
    },[productDetails])
    const fetchProductLikeDetails = async (context)=>{
        const res = await LikeProductService.getDetailsLikeProduct(context.queryKey[1],user?.id)
        return res?.data
    }
    const queryLikeProduct = useQuery({
        queryKey: ['products',idProduct],
        queryFn: fetchProductLikeDetails,
        enabled:user?.id ? true : false,
    });
    const { isLoading:isLoadingLikeProduct, data:productLikeDetails } = queryLikeProduct
    useEffect(()=>{ 
        if(productLikeDetails=== null || productLikeDetails === undefined){
            setLikeProduct(false)
        }else{
            setLikeProduct(productLikeDetails?.like)
        }
    },[productLikeDetails])

    const mutation = useMutationHooks(//call api
        (data) => LikeProductService.createLikeProduct(data)
    )
    const {data, isPending , isSuccess ,isError,error} = mutation
    useEffect(()=>{
        if(check){
            mutation.mutate({
                like:likeProduct,
                product:idProduct,
                user:user?.id
            },{
                onSuccess:()=>{
                    useQueryAllLikeProducts.refetch()
                }
            })
        }
        setCheck(true)
    },[likeProduct])
    const handleChangeCount = (type)=>{
        if(type === 'increase'){
            setNumProduct(prev => Number(productDetails?.countInStock) - (order123.current.length!==0 ? Number(order123?.current[0]?.amount) : 0) > prev ? prev + 1 : prev)
        }
        else{
            setNumProduct(prev => prev > 1   ? prev - 1 : prev)
        } 
    }
    useEffect(()=>{
        return ()=>{
            dispatch(resetOrder())
        }
    },[])
    const handleAddOrderProduct = ()=>{
        if(!user?.id){
            navigate('/sign-in',{state:{path:location.pathname,message:'Vui lòng đăng nhập trước khi thêm sản phẩm'}}) //giữ lại trang khi người dùng đăng nhập lại
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
            // check.current ++
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
            if(order?.isSuccessOrder && (Number((order123.current.length!==0 ? Number(order123?.current[0]?.amount) : 0))+Number(numProduct))<=Number(order123.current.length!==0 ? order123?.current[0]?.countInStock : productDetails?.countInStock)){
                message.success("Đã thêm sản phẩm vào giỏ hàng") 
                setNumProduct(1)
            }
        }
    }
    const handleBuyNowProduct = ()=>{
        dispatch(buyNowProduct({
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
        navigate('/payment',{ state: [productDetails?._id] })
    }
    console.log(productDetails)
    const fetchProductAllLike = async (context)=>{ //context get value cua useQuery
        const res = await LikeProductService.countLikeProducts()
        return res?.data
   
    }
    const useQueryAllLikeProducts = useQuery({
        queryKey: ['allLikeProducts',idProduct],
        queryFn: fetchProductAllLike,
        enabled:idProduct?true:false
    });
    const { isLoading:isLoadingAllLikeProduct, data:allLikeProducts } = useQueryAllLikeProducts
    return (
        <div>
            <Loading isLoading={isLoadingProduct}>
            <Row style={{padding:'16px',backgroundColor:'#fff',borderRadius:'4px'}}>
                <Col span={10} style={{borderRight:'1px solid #e5e5e5',paddingRight:'8px'}}>
                    <div style={{position:'relative'}}>
                        <img src={logo} style={{zIndex:'1'}} className="WrapperImage" alt="logo"/>
                        <Image src={productDetails?.image}
                        preview={true}
                        style={{
                            width:'507px',
                            height:'507px',
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
                    <div style={{display:'flex', alignItems:'center'}}>
                        {/* {renderStar(productDetails?.rating)} */}
                        {/* <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} /> */}
                        <div style={{display:'flex',alignItems:'center'}}>
                            {likeProduct ? <HeartFilled onClick={()=>setLikeProduct(!likeProduct)} style={{fontSize:'20px',marginRight:'5px',color:'red'}}/> : <HeartOutlined onClick={()=>setLikeProduct(!likeProduct)} style={{fontSize:'20px',marginRight:'5px'}}/>}
                            <span>{allLikeProducts?.filter((item) => item._id.product===idProduct)[0]?.totalLikes || 0}</span>
                        </div>
                        
                        <span className="WapperStyleTextSell" style={{marginLeft:'10px'}}> | Đã bán {productDetails?.selled || 0}</span>
                    </div>
                    <div className="WrapperPriceProduct">
                        <h1 className="WrapperPriceTextProduct">
                            {productDetails?.discount ? <span style={{color:'red'}}>{convertPrice(productDetails?.price*(100-productDetails?.discount)/100)}</span>: <span style={{color:'red'}}>{convertPrice(productDetails?.price)}</span>}
                            {productDetails?.discount ? <><span style={{fontSize:'16px',textDecoration:'line-through', color:'rgb(102 102 102)',marginLeft:'8px'}}> {convertPrice(productDetails?.price)}</span><span style={{fontSize:'16px',color:'red'}}> -{productDetails?.discount}%</span> </>: <span></span>}
                        </h1>
                    </div>
                    {/* <div className="WrapperAddresstProduct">
                        <span> Giao đến </span> 
                        <span className="address">{user?.address}</span>
                        <span className="change-address"> Đổi địa chỉ</span>
                    </div>   */}
                    <div style={{margin:'10px 0 20px',borderTop:'1px solid #e5e5e5',borderBottom:'1px solid #e5e5e5',padding:'10px 0'}}>
                        <div style={{marginBottom:'6px'}}>Số lượng</div>
                        <div className="WrapperQualityProduct">
                            <button style={{border:'none',backgroundColor:'transparent',cursor:'pointer'}} onClick={()=>handleChangeCount('decrease')}>
                                <MinusOutlined style={{fontSize:'20px'}}/>
                            </button>
                            
                            <InputNumber min={1} max={productDetails?.countInStock-(order123.current.length!==0 ? order123?.current[0]?.amount : 0)} onChange={onChange} value={numProduct} size="" className=""/>
                            <button style={{border:'none',backgroundColor:'transparent',cursor:'pointer'}} onClick={()=>handleChangeCount('increase')}>
                                <PlusOutlined style={{fontSize:'20px'}}/>
                            </button>
                        </div>
                    </div>
                    <div style={{display:'flex',alignItems:'start',gap:'12px'}}>
                    <div>
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
                            textButton={"Thêm vào giỏ hàng"}
                            styleTextButton={{color:'white'}}
                        />  
                            <div>
                                {order?.isSuccessOrder===false && <span style={{color:'red'}}>Sản phẩm đã hết hàng</span>}
                            </div>
                        </div>

                        <ButtonComponent 
                            size={20}
                            styleButton={{
                                backgroundColor:'#fff',
                                height:'48px',
                                width:'220px',
                                border:'1px solid rgb(13,92,182)',
                                borderRadius:'4px'
                            }}
                            onClick={handleBuyNowProduct}
                            textButton={"Mua ngay"}
                            styleTextButton={{color:'rgb(13,92,182)',fontSize:'15px',fontWeight:500}}
                        />
                    </div>
                    <div style={{marginTop:'10px'   }} >
                        <div dangerouslySetInnerHTML={{ __html: productDetails?.description }} />
                    </div>
                </Col>
            </Row>
            </Loading>
        </div>
    )
}

export default ProductDetailComponent