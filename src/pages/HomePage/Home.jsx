import React, { useEffect, useRef, useState } from "react";
import TypeProduct from "../../components/Product/TypeProduct/TypeProduct";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import slider1 from '../../assets/images/slide1.jpg'
import slider2 from '../../assets/images/slide2.webp'
import slider3 from '../../assets/images/slide3.webp'
import slider4 from '../../assets/images/slide4.webp'
import slider5 from '../../assets/images/slide5.webp'
import CardComponent from "../../components/Product/CardComponent";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from '../../services/ProductService'
import Loading from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import { keepPreviousData } from '@tanstack/react-query'
import { colors } from "../../contants";

const HomePage = ()=>{
    const searchProduct = useSelector((state) => state.product)
    const [isLoadingSearch,setIsLoadingSearch] = useState('')
    const searchDounce = useDebounce(searchProduct.search,200) //sau 1 giây mới gọi API
    const [limit,setLimit] = useState(6)
    const [typeProducts,setTypeProducts]= useState([])
    const fetchProductAll = async (context)=>{ //context get value cua useQuery
        const search = context?.queryKey && context?.queryKey[2]
        const limit = context?.queryKey && context?.queryKey[1]
        const res = await ProductService.getAllProduct(search,limit)
        // if(search.length > 0 || refSearch.current){
        //     setStateProduct(res?.data)
        // }else
        // {
        //     return res
        // }
        return res
   
    }
   
    const { isLoading, data:products,isPlaceholderData } = useQuery({
        queryKey: ['products',limit,searchDounce],
        queryFn: fetchProductAll,
        placeholderData: keepPreviousData, //giữ lại sản phẩm ban đầu thi reload
        retry: 3,
        retryDelay: 1000,
    });
    const fetchAllTypeProduct = async(  )=>{
        const res = await ProductService.getAllTypeProduct()
        setTypeProducts(res?.data)
    }

    useEffect(()=>{
        fetchAllTypeProduct()
    },[])
    return (
        <Loading isLoading={isLoadingSearch}>
           
            <div style={{ width: '1270px', margin: '0 auto' }}>
                <div className="WrapperTypeProduct">
                    {typeProducts.map((item) => {
                        return (
                            <TypeProduct name={item} key={item} />
                        )
                    })}
                </div>
            </div>
            <div className='body' style={{ width: '100%', backgroundColor: '#efefef', }}>
                <div id="container" style={{ height: '1000px', width: '1270px', margin: '0 auto' }}>
                    <SliderComponent arrImages={[slider1, slider2, slider3, slider4, slider5]} />
                    <Loading isLoading={isLoading}>
                        <div className="WrapperProducts">
                            {/* .filter(item => item.name.includes(product.search)) */}
                            {products?.data.map((product, index) => {
                                return (
                                    <CardComponent key={index}
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
                                )
                            })}


                        </div>
                    </Loading>



                    <div style={{ display: "flex", justifyContent: 'center', marginTop: '10px' }}>
                        <ButtonComponent className='WrapperButtonMore' textButton={isPlaceholderData ? "Load more..." : "Xem thêm"}
                            styleTextButton={{
                                fontWeight: 500
                            }}
                            type="uotline"
                            styleButton={{
                                border: '1px solid rgb(11,116,229)',
                                color: `${products?.total <= products?.data.length ? 'white' : 'white'}`,
                                cursor: `${products?.total <= products?.data.length ? 'not-allowed' : 'pointers'}`,
                                width: '240px',
                                height: '38px',
                                borderRadius: '4px',
                                backgroundColor: colors.primary
                            }}
                            disabled={products?.total <= products?.data.length}
                            onClick={() => { setLimit(prev => prev + 6) }}
                        />
                    </div>
                </div>
            </div>
        </Loading>
    )
}

export default HomePage