import React from "react";
import ProductDetailComponent from "../../components/Product/ProductDetailComponent";

const ProductDetailPage = ()=>{
    return (
        <div style={{backgroundColor:'#efefef',height:'1000px'}} className="container">
            <h4 style={{margin:0}}>Trang chủ</h4>
           
                <ProductDetailComponent />
           
            
        </div>
    )
}

export default ProductDetailPage