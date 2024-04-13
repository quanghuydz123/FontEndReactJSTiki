import React from "react";
import { useNavigate } from "react-router-dom";
import LinkComponent from "../../LinkComponent/LinkComponent";

const TypeProduct = (props)=>{

    const navigate = useNavigate()
    const {name,mr,p,id} = props
    // const handleNavigateType = (type,id)=>{
    //     navigate(`/product/${type}`) //bỏ dấu tiếng việt    
    // }
    // function removeVietnameseAccent(str) {
    //     str = str.toLowerCase();
    //     // Dùng bảng mã Unicode để chuyển đổi ký tự có dấu thành không dấu
    //     str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    //     // Chuyển các ký tự đặc biệt thành các ký tự không dấu tương ứng
    //     str = str.replace(/đ/g, 'd');
    //     // Loại bỏ các ký tự không phải chữ cái hoặc số
    //     str = str.replace(/[^a-z0-9]/g, '');
    //     return str;
    // }
    return (
        <div style={{marginRight:mr,padding:p,cursor:'pointer',color:'rgb(128,128,137)'}} >
            <LinkComponent to={`/${name}`} style={{color:'black'}} colorOnMouseEnter='rgb(26, 148, 255)' colorOnMouseLeave='black'>{name}</LinkComponent>
        </div>
    )
}

export default TypeProduct