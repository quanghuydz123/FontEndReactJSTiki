import React from "react";
import { useNavigate } from "react-router-dom";

const TypeProduct = (props)=>{

    const navigate = useNavigate()
    const {name,mr,p} = props
    const handleNavigateType = (type)=>{
        navigate(`/product/${type.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g,'_')}`,{state:type}) //bỏ dấu tiếng việt    
    }
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
        <div style={{marginRight:mr,padding:p,cursor:'pointer',color:'rgb(128,128,137)'}} onClick={()=>handleNavigateType(name)}>
            {name}
        </div>
    )
}

export default TypeProduct