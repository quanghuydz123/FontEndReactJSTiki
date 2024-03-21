import React, {useEffect, useState } from "react";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import CardComponent from "../../components/Product/CardComponent";
import { Button, Col, Pagination, Result, Row } from "antd";
import { useLocation, useParams } from "react-router-dom";
import * as ProductService from '../../services/ProductService'
import Loading from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import SearchNotFound from "../../components/SearchNotFound/SearchNotFound";

const TypeProductPage = ()=>{
    const location = useLocation() //lấy ra pamrams state
    const params = useParams()
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDounce = useDebounce(searchProduct,200) //sau 1 giây mới gọi API
    const [products,setProducts] = useState([])
    const [loading,setLoading]= useState('')
    const [panigate,setPanigate] = useState({
        page:1,
        limit:10,
        total:1
    })
    const fetchProductType= async (type,page,limit)=>{
        setLoading(true)
        const res = await ProductService.getProductType(type,page,limit)
        if(res?.status === "OK"){
            setLoading(false)   
            setProducts(res?.data)
            setPanigate({
                ...panigate,
                total:res?.totalPage
            })
        }else{
            setLoading(false)
        }
    }
   
    
    useEffect(()=>{
        if(location.state)
        {
            fetchProductType(location.state,panigate.page,panigate.limit)
        }
        
    },[location.state,panigate.page,panigate.limit])
    const onChange = (current,pageSize)=>{
        setPanigate({
            ...panigate,
            page:current,
            limit:pageSize
        })
    }
    return (
        <>
           <Loading isLoading={loading}>
            <div  style={{ width:'100%',backgroundColor: "#efefef" ,minHeight: 'calc(100vh)'}}>
            <div style={{width:'1270px',margin:'0 auto',minHeight:'calc(100vh)',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
                <Row style={{ flexWrap: 'nowrap', paddingTop: '10px' }}>

                    <Col span={4} style={{}} className="WrapperNavbar">
                        <NavbarComponent />
                    </Col>

                    <Col span={20} style={{ marginLeft: '10px' }}>
                        <div className="WrapperLabelTypeProduct">
                            <span>{location.state}</span>
                        </div>
                        <div className="WrapperProductsType">
                        {products?.filter(item => item.name.toLowerCase().includes(searchDounce.toLowerCase())).length!==0 ? products?.filter(item => item.name.toLowerCase().includes(searchDounce.toLowerCase())).map((product,index)=> {
                            return   <CardComponent key={index} 
                            countInStock={product.countInStock}
                            description={product.description}
                            image={product.image}
                            name={product.name}
                            price={product.price}
                            rating={product.rating}
                            type={product.type}
                            selled={product.selled}
                            discount={product.discount}
                            id={product._id}
                            />
                        }) : <SearchNotFound />}
                        </div>
                       
                       
                    </Col>


                </Row>
                <Pagination
                    showSizeChanger
                    //onShowSizeChange={onShowSizeChange}
                    defaultCurrent={panigate.page}
                    onChange={onChange}
                    total={panigate.total*10}
                    style={{
                        textAlign:'center',
                        marginBottom:'20px'
                    }}
                />
                </div>
            </div>
            </Loading>
        </>
    )
}

export default TypeProductPage