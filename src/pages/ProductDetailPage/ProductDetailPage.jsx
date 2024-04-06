import React, { useEffect, useState } from "react";
import ProductDetailComponent from "../../components/Product/ProductDetailComponent";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";
import { Image } from "antd";
import CardComponent from "../../components/Product/CardComponent";
import * as ProductService from '../../services/ProductService'
import { useQuery } from "@tanstack/react-query";
import * as LikeProductService from '../../services/LikeProductService'
import Loading from "../../components/LoadingComponent/Loading";
import LinkComponent from "../../components/LinkComponent/LinkComponent";
import * as CategoryService from '../../services/CategoryService'

const ProductDetailPage = () => {
    const { id } = useParams() //lấy value params  truyền vào
    const navigate = useNavigate()
    const [categoryChildProduct, setCategoryChildProduct] = useState('')
    const [totalProduct, setTotalProduct] = useState()
    const [nameCategoryChild,setNameCategoryChild]= useState('')
    const [CategoryProduct,setCategoryProduct]= useState('')
    const [descriptionProduct,setDescriptionProduct] = useState('')
    const handleNavigateHome = () => {
        navigate('/')
    }

    const fetchAllProductChildCategory = async (context) => {
        const filter = context.queryKey[1]
        const res = await ProductService.getProductByIdParent(null, null, null, filter)
        return res?.data
    }
    const queryAllProductByChildCategory = useQuery({
        queryKey: ['products-details', categoryChildProduct],
        queryFn: fetchAllProductChildCategory,
        enabled:categoryChildProduct ? true : false
    })
    const { isLoading: isLoadingProduct, data: productDetails } = queryAllProductByChildCategory

    const fetchGetCategoryByIdCategoryChild = async (context) => {
        const childIdCategory = context.queryKey[1]
        const res = await CategoryService.getCategoryByIdCategoryChild(childIdCategory)
        return res?.data
    }
    const queryGetCategoryByIdCategoryChild = useQuery({
        queryKey: ['category-parent', CategoryProduct?.parentId],
        queryFn: fetchGetCategoryByIdCategoryChild,
        enabled:CategoryProduct ? true : false
    })
    const { isLoading: isLoadingCategoryParent, data: categoryParent } = queryGetCategoryByIdCategoryChild
    console.log("categoryParent",categoryParent)
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: totalProduct > 6 ? 6 : totalProduct,
        slidesToScroll: totalProduct > 6 ? 6 : totalProduct,
        variableWidth: true,
        autoplay: true,
        autoplaySpeed: 5000,

    }
    useEffect(() => {
        setTotalProduct(productDetails?.length)
    }, [productDetails])
    const fetchProductAllLike = async (context) => { //context get value cua useQuery
        const res = await LikeProductService.countLikeProducts()
        return res?.data

    }
    const useQueryAllLikeProducts = useQuery({
        queryKey: ['allLikeProducts'],
        queryFn: fetchProductAllLike,
    });

    const { isLoading: isLoadingAllLikeProduct, data: allLikeProducts } = useQueryAllLikeProducts
    console.log("categoryParent",categoryParent)
    return (
        <div style={{ minHeight: '100vh', width: '100%', background: '#efefef' }}>
            <div style={{ width: '1270px', minHeight: '100%', margin: '0 auto' }} className="container">
                <div style={{ margin: 0,paddingTop:'10px',paddingBottom:'10px',fontSize:'16px'}}>
                    <LinkComponent to={'/'} style={{color:'black'}}><span style={{ cursor: 'pointer' }}>Trang chủ</span></LinkComponent>
                    {categoryParent && <><span> /</span><LinkComponent to={`/${categoryParent[0]?.name}`} style={{color:'black'}}><span> {categoryParent[0]?.name}</span></LinkComponent></>}
                    {CategoryProduct && categoryParent && <><span> /</span><LinkComponent to={`/${categoryParent[0]?.name}/${CategoryProduct?.name}`} style={{color:'black'}}><span> {CategoryProduct?.name}</span></LinkComponent></>}
                </div>

                <ProductDetailComponent setDescriptionProduct={setDescriptionProduct} setCategoryProduct={setCategoryProduct} idProduct={id} setCategoryChildProduct={setCategoryChildProduct} />
                <div className="slider-container" style={{ marginTop: '12px', padding: '16px', background: 'white', borderRadius: '4px' }}>
                    <div>
                        <h2 style={{ margin: '0 0 10px 0', color: 'rgb(26,148,255)' }}>Sản phẩm tương tự</h2>
                    </div>
                    <Loading isLoading={isLoadingProduct}>

                    <Slider {...settings}>
                            {productDetails?.map((product, index) => {
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
                    </Loading>

                </div>
                <div style={{marginTop:'10px',background:'white',padding:'16px',borderRadius:'4px'}}>
                    <div dangerouslySetInnerHTML={{ __html: descriptionProduct }} />
                </div>


            </div>
        </div>
    )
}

export default ProductDetailPage