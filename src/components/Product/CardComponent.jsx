import React from "react";
import { Card, Image } from 'antd';
import logo from '../../assets/images/logo.png'
import {
    StarOutlined,
    StarFilled
} from '@ant-design/icons';
const { Meta } = Card;
const CardComponent = (props)=>{
    const {countInStock,description,image,name,price,rating,type,selled,discount} = props
    return <Card
            className="WrapperCardStyle"
            hoverable
            style={{ width: 200 }}
            headStyle={{width:'200px',height:'200px'}}
            bodyStyle={{padding:10}}
            cover={<img alt="example" src="https://salt.tikicdn.com/cache/750x750/ts/product/a2/38/6c/ce008c63f4ac771550439da44f5f8ee8.png.webp" />}
            >
                <img src={logo} style={{}} className="WrapperImage" alt="logo"/>
                <div className="NameProduct">
                    {name}
                </div>
                <div className="WapperReporText">
                    <span>
                        <span>{rating}</span> <StarFilled style={{fontSize:10,color:"rgb(253,216,54)"}}/>
                    </span>
                    <span> | Đã bán {selled || 10}+</span>
                    
                </div>
                <div className="WrapperPriceText">
                        {price} đ <span className="WrapperDiscuontText">-{discount || 5}%</span>
                </div>
        </Card>
}

export default CardComponent

