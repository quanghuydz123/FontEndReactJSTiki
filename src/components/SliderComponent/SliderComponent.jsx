import { Image } from "antd";
import React from "react";
import { WrapperSliderStyle } from "./style";


const SliderComponent = ({arrImages})=>{
        const settings = {
          dots: true,
          infinite: true,
          speed: 500,
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay:true,
          autoplaySpeed:5000,
        }
        
          
    return (
        <WrapperSliderStyle {...settings}>
            {arrImages.map((item,index)=>{
                return (
                    <Image key={index} src={item} alt="slides" preview={false} width='100%' height={500}/>
                )
            })}
        </WrapperSliderStyle>
    )
}

export default SliderComponent