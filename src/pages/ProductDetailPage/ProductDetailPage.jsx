import React from "react";
import ProductDetailComponent from "../../components/Product/ProductDetailComponent";
import { useParams } from "react-router-dom";

const ProductDetailPage = ()=>{
    const {id} = useParams() //lấy value params  truyền vào
    return (
        <div style={{height:'100vh',width:'100%',background:'#efefef'}}>
        <div style={{width:'1270px',height:'100%',margin:'0 auto'}} className="container">
            <h4 style={{margin:0}}>Trang chủ - Chi tiết sản phẩm</h4>
           
                <ProductDetailComponent idProduct={id}/>
                
           
            
        </div>
        </div>
    )
}

export default ProductDetailPage