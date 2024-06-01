import React, { useEffect, useState } from "react";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { colors } from "../../contants";
import CardComponent from "../../components/Product/CardComponent";
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import Loading from "../../components/LoadingComponent/Loading";
import * as LikeProductService from '../../services/LikeProductService'
import { useSelector } from "react-redux";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import ContainerComponent from "../../components/ContainerComponent/ContainerComponent";

const ProductfFavoritePage = ()=>{
    const user = useSelector((state) => state.user)
    const navigate = useNavigate()
    const [limit, setLimit] = useState(12)
    // const fetchProductAll = async (context) => { //context get value cua useQuery
    //     const limit = context?.queryKey && context?.queryKey[1]
    //     const res = await ProductService.getAllProduct(limit)
    //     return res

    // }
    // const { isLoading, data: products, isPlaceholderData } = useQuery({
    //     queryKey: ['products', limit],
    //     queryFn: fetchProductAll,
    //     placeholderData: keepPreviousData, //giữ lại sản phẩm ban đầu thi reload
    // });

    const fetchProductAll = async (context) => { //context get value cua useQuery
        const limit = context?.queryKey && context?.queryKey[1]
        const res = await LikeProductService.getAllProductLikeByIdUser(user?.id,limit)
        return res

    }
    const { isLoading, data: products, isPlaceholderData } = useQuery({
        queryKey: ['products', limit],
        queryFn: fetchProductAll,
        placeholderData: keepPreviousData, //giữ lại sản phẩm ban đầu thi reload
        enabled:(limit && (user?.id)) ? true : false
    });
    console.log("products",products?.data?.filter(item=>item.product!=null))
    const fetchProductAllLike = async (context) => { //context get value cua useQuery
        const res = await LikeProductService.countLikeProducts()
        return res?.data

    }
    const useQueryAllLikeProducts = useQuery({
        queryKey: ['allLikeProducts'],
        queryFn: fetchProductAllLike,
    });

    const { isLoading: isLoadingAllLikeProduct, data: allLikeProducts } = useQueryAllLikeProducts

    return (
        <ContainerComponent style={{ backgroundColor: '#efefef'}}>
            <div style={{ width: '100%', minHeight: '100vh' }}>
                <div style={{ height: '100%', width: '100%', margin: '0 auto' }}>
                    <div style={{ background: 'white', padding: '16px', borderRadius: '8px' }}>
                        <h2 style={{ margin: '0px', color: 'rgb(26, 148, 255)' }}>
                            Sản phẩm yêu thích
                        </h2>
                        <Loading isLoading={isLoading}>
                            <div className="WrapperProducts">
                                {products?.data?.length !== 0 ? products?.data?.filter(item=>item.product!=null).map((product, index) => {
                                    return (
                                        <CardComponent key={index}
                                            countInStock={product?.product.countInStock}
                                            description={product?.product.description}
                                            image={product?.product.image}
                                            name={product?.product.name}
                                            price={product?.product.price}
                                            rating={product?.product.rating}
                                            type={product?.product.type}
                                            selled={product?.product.selled}
                                            discount={product?.product.discount}
                                            id={product?.product._id}
                                            totalLike={allLikeProducts?.filter((item) => item._id.product === product?.product._id)[0]?.totalLikes}
                                        />
                                    )
                                }):<Result
                                style={{width:'100%'}}
                                status="404"
                                title="Chưa có sản phẩm yêu thích"
                                subTitle="Hãy quay về trang chủ và tìm sản phẩm"
                                extra={<Button onClick={() => { navigate('/') }} type="primary">Trang chủ</Button>}
                              />}


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

                   

                </div>

            </div>
            </ContainerComponent>
    )
}

export default ProductfFavoritePage