import React, { useEffect, useState } from "react";
import TypeProduct from "../../components/Product/TypeProduct/TypeProduct";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import slider1 from '../../assets/images/slide1.jpg'
import slider2 from '../../assets/images/slide2.webp'
import slider3 from '../../assets/images/slide3.webp'
import slider4 from '../../assets/images/slide4.webp'
import slider5 from '../../assets/images/slide5.webp'
import slider6 from '../../assets/images/slide6.png'
import slider7 from '../../assets/images/slide7.png'
import slider8 from '../../assets/images/slide8.webp'

import CardComponent from "../../components/Product/CardComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from '../../services/ProductService'
import Loading from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import { keepPreviousData } from '@tanstack/react-query'
import { colors } from "../../contants";
import * as LikeProductService from '../../services/LikeProductService'
import * as CategoryService from '../../services/CategoryService'
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import Slider from "react-slick";
import LinkComponent from "../../components/LinkComponent/LinkComponent";

const HomePage = () => {
    //const searchProduct = useSelector((state) => state.product)
    const user = useSelector((state) => state.user)
    const [isLoadingSearch, setIsLoadingSearch] = useState('')
    //const searchDounce = useDebounce(searchProduct.search, 200) //sau 1 giây mới gọi API
    const [limit, setLimit] = useState(12)
    const [categoryParent, setCategoryParent] = useState([])
    const fetchProductAll = async (context) => { //context get value cua useQuery
        const limit = context?.queryKey && context?.queryKey[1]
        const res = await ProductService.getAllProduct(limit)
        // if(search.length > 0 || refSearch.current){
        //     setStateProduct(res?.data)
        // }else
        // {
        //     return res
        // }
        return res

    }
    const { isLoading, data: products, isPlaceholderData } = useQuery({
        queryKey: ['products', limit],
        queryFn: fetchProductAll,
        placeholderData: keepPreviousData, //giữ lại sản phẩm ban đầu thi reload
    });
    //
    // const fetchAllTypeProduct = async(  )=>{
    //     const res = await ProductService.getAllTypeProduct()
    //     setTypeProducts(res?.data)
    // }

    // useEffect(()=>{
    //     fetchAllTypeProduct()
    // },[])
    //
    const fetchAllCategoryParent = async () => {
        const res = await CategoryService.getAllCategoryParent()
        setCategoryParent(res?.data)
    }

    useEffect(() => {
        fetchAllCategoryParent()
    }, [])

    //
    const fetchProductAllLike = async (context) => { //context get value cua useQuery
        const res = await LikeProductService.countLikeProducts()
        return res?.data

    }
    const useQueryAllLikeProducts = useQuery({
        queryKey: ['allLikeProducts'],
        queryFn: fetchProductAllLike,
    });

    const { isLoading: isLoadingAllLikeProduct, data: allLikeProducts } = useQueryAllLikeProducts

    const fetchProductByParentCategory = async () => { //context get value cua useQuery
        const res = await ProductService.getAllProductGroupByChildCategory()
        return res?.data

    }
    const useQueryProductParentCategory = useQuery({
        queryKey: ['product-parentCategory'],
        queryFn: fetchProductByParentCategory,
    });

    const { isLoading: isLoadingProductParentCategory, data: productParentCategorys } = useQueryProductParentCategory

    const fetchCategoryParent = async () => { //context get value cua useQuery
        const res = await CategoryService.getAllCategoryParent()
        return res?.data

    }
    const useQueryCategoryParent = useQuery({
        queryKey: ['category-parent'],
        queryFn: fetchCategoryParent,
    });

    const { isLoading: isLoadingCategoryParent, data: categoryParents } = useQueryCategoryParent

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 6,
        variableWidth: true,
        autoplay: true,
        autoplaySpeed: 5000,

    }
    return (
        <Loading isLoading={isLoadingSearch}>
            <div style={{ width: '1270px', margin: '0 auto' }}>
                <div className="WrapperType123">
                    <div className="WrapperTypeProduct">
                        {categoryParent.map((item) => {
                            return (
                                <TypeProduct id={item._id} name={item.name} key={item.name} />
                            )
                        })}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src="https://salt.tikicdn.com/ts/upload/88/5c/9d/f5ee506836792eb7775e527ef8350a44.png" alt="location" style={{ width: '20px', height: '20px' }} />
                        <span style={{ color: 'rgb(128,128,137)' }}> Giao đến:</span> <span style={{ fontWeight: 'bold', textDecoration: 'underline', color: 'rgb(39, 39, 42)' }}>{user.address}</span>
                    </div>
                </div>
            </div>
            <div className='body' style={{ width: '100%', backgroundColor: '#efefef', minHeight: '100vh' }}>
                <div id="container" style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
                    <SliderComponent arrImages={[slider1,slider2,slider3,slider4,slider5]} />
                    <div style={{ background: 'white', padding: '16px', marginTop: '20px', borderRadius: '8px' }}>
                        <h2 style={{ margin: '0px', color: 'rgb(26, 148, 255)' }}>
                            Sản phẩm HOT
                        </h2>
                        <Loading isLoading={isLoading}>
                            <div className="WrapperProducts">
                                {/* .filter(item => item.name.includes(product.search)) */}
                                {products?.data?.map((product, index) => {
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
                                            totalLike={allLikeProducts?.filter((item) => item._id.product === product._id)[0]?.totalLikes}
                                        />
                                    )
                                })}


                            </div>
                        </Loading>



                        <div style={{ display: "flex", justifyContent: 'center', marginTop: '20px' }}>
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
                                    backgroundColor: colors.primary,
                                }}
                                disabled={products?.total <= products?.data.length}
                                onClick={() => { setLimit(prev => prev + 6) }}
                            />
                        </div>
                    </div>

                    <Loading isLoading={false}>

                        {productParentCategorys?.map((productParentCategory,index) => {
                            const totalProduct = productParentCategory?.products?.length
                            const nameParentCategory = categoryParent.filter((item) => item._id === productParentCategory?._id)[0]?.name
                            const modifiedSettings = { ...settings, slidesToShow: totalProduct > 6 ? 6 : totalProduct, slidesToScroll: totalProduct > 6 ? 6 : totalProduct, };
                            return (
                                <div className="slider-container" style={{ marginTop: '12px', padding: '16px', background: 'white', borderRadius: '4px' }} key={index}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h2 style={{ margin: '0 0 10px 0', color: 'rgb(26,148,255)' }}>{nameParentCategory}</h2>

                                        <LinkComponent to={`/${nameParentCategory}`}>
                                            <ButtonComponent
                                                size={20}
                                                styleButton={{
                                                    height: '30px',
                                                    width: '120px',
                                                    borderRadius: '4px',
                                                    padding: '2px 6px 6px',
                                                    backgroundColor: 'white',
                                                    margin: '0 8px',
                                                
                                    
                                                }}
                                                textButton={"Xem tất cả"}
                                                styleTextButton={
                                                    { color: 'black', fontSize: '14px' }

                                                } />
                                        </LinkComponent>
                                    </div>

                                    <Slider {...modifiedSettings} className="cssSlider">
                                        {productParentCategory?.products?.map((product, index) => {
                                            return (
                                                <div key={index}>
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
                                                        totalLike={allLikeProducts?.filter((item) => item._id.product === product._id)[0]?.totalLikes}
                                                        detailsPage={true}
                                                    />
                                                </div>
                                            )
                                        })}

                                    </Slider>

                                </div>
                            )
                        })}


                    </Loading>

                </div>

            </div>

        </Loading>
    )
}

export default HomePage