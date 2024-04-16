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
import LinkComponent from "../LinkComponent/LinkComponent";
const { Meta } = Card;
const CardComponent = (props)=>{
    const {countInStock,description,image,name,price,rating,type,selled,discount,id,totalLike,detailsPage,typePage} = props
    const navigate = useNavigate()  
  
    return <LinkComponent to={`/product-detail/${id}`}>
            <Card
                    className="WrapperCardStyle"
                    hoverable
                    style={detailsPage ? { width: 190,margin:'8px',minHeight:'330px',border:'1px solid rgb(240, 240, 240)',padding:'4px'} : 
                    typePage ? { width: 202,minHeight:'330px',border:'1px solid rgb(240, 240, 240)',padding:'4px'} : { width: 196,minHeight:'330px',border:'1px solid rgb(240, 240, 240)',padding:'4px'}
                }
                    headStyle={{width:'200px',height:'200px'}}
                    bodyStyle={{padding:10}}
                    cover={<img alt="example" src={image} style={detailsPage ? {width:'180px'} : {width:'190px'}} />}
                    >
                        <img src={logo} style={{objectFit:'contain'}} className="WrapperImage" alt="logo"/>
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
                            {discount ? <><span>{convertPrice(price*(100-discount)/100)}</span> <span className="WrapperDiscuontText">-{discount}%</span></>   : <span></span>}
                        </div>
                        {discount ? <div style={{fontSize:'12px',textDecoration:'line-through', color:'rgb(102 102 102)'}}>
                                {convertPrice(price)}
                        </div> : <div className="WrapperPriceText">
                                {convertPrice(price)}
                        </div>}
                </Card>
    </LinkComponent>
}

export default CardComponent

