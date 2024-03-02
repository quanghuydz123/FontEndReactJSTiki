import React from "react";
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
const HomePage = ()=>{
    const fetchProductAll = async ()=>{
        const res = await ProductService.getAllProduct()
        return res
    }
    const { isLoading, data:products } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProductAll,
        retry: 3,
        retryDelay: 1000
    });
    console.log(products)
    return (
        <>
           
            <div className="body" style={{
                width:'100%',
                backgroundColor:'#efefef'
            }}>
                <div style={{
                    height: '1000px',
                    width:'1270px',
                    margin:'0 auto'

                }}>
                    <SliderComponent arrImages={[slider1, slider2, slider3, slider4, slider5]} />
                    <div className="WrapperProducts">
                        {products?.data.map((product,index)=>{
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
                                />
                            )
                        })}
                        
                       
                    </div>
                    
                    <div style={{ display: "flex", justifyContent: 'center', marginTop: '10px' }}>
                        <ButtonComponent className='WrapperButtonMore' textButton={"Xem thêm"}
                            styleTextButton={{
                                fontWeight: 500
                            }}
                            type="uotline"
                            styleButton={{
                                border: '1px solid rgb(11,116,229)',
                                color: 'rgb(11,116,229)',
                                width: '240px',
                                height: '38px',
                                borderRadius: '4px'
                            }

                            } />
                    </div>
                </div>
            </div>
            
        </>
    )
}

export default HomePage