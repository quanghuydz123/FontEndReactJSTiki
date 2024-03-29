import React from "react";
import { Card, Image } from 'antd';
import logo from '../../assets/images/logo.png'
import {
    StarOutlined,
    StarFilled,
    HeartFilled,
    HeartOutlined
} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { convertPrice } from "../../utils";
const { Meta } = Card;
const CardComponent = (props)=>{
    const {countInStock,description,image,name,price,rating,type,selled,discount,id,totalLike} = props
    const navigate = useNavigate()  
    const handleDetailsProduct = (event)=>{
        //window.open(`/product-detail/${id}','_blank', 'rel=noopener noreferrer`)
        if (event.ctrlKey || event.metaKey) {
            window.open(`/product-detail/${id}`, '_blank');
        } else {
            navigate(`/product-detail/${id}`)
        }
        
    }
    return <Card
            className="WrapperCardStyle"
            hoverable
            style={{ width: 200 }}
            headStyle={{width:'200px',height:'200px'}}
            bodyStyle={{padding:10}}
            cover={<img alt="example" src={image} />}
            onClick={handleDetailsProduct}
            >
                <img src={logo} style={{}} className="WrapperImage" alt="logo"/>
                <div className="NameProduct">
                    {name}
                </div>
                <div className="WapperReporText">
                    <span>
                        <HeartOutlined style={{fontSize:10}}/> <span>{totalLike || 0}</span> 
                    </span>
                    <span style={{marginLeft:'10px'}}> | Đã bán {selled || 0}</span>
                    
                </div>
                <div className="WrapperPriceText">
                        {convertPrice(price)} {discount && <span className="WrapperDiscuontText">-{discount}%</span>}
                        {/* <>toLocaleString format gia tien</> */}
                </div>
        </Card>
}

export default CardComponent

