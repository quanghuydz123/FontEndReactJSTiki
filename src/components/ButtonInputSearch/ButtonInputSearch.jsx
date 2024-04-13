import React from "react";
import { Button, Input } from "antd";
import {
    SearchOutlined
} from '@ant-design/icons';
import InputComponent from "../InputComponent/InputComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
const ButtonInputSearch = (props)=>{
    const {size,placeholder,textButton,backgroundColorInput='#fff',
    backgroundColorSearch='rgb(13,92,182)',colorButton='#fff',onClick,...rests} = props
    return (
        <div style={{
            display:"flex"
        }}>
            <InputComponent 
                size={size} 
                placeholder={placeholder}  
                style={{backgroundColor:backgroundColorInput,borderRadius:'5px 0px 0px 5px'}}
                {...rests}
            />
            <ButtonComponent size={size} icon={<SearchOutlined />} 
            styleButton={{borderRadius:'0px 5px 5px 0px',backgroundColor:backgroundColorSearch,color:colorButton}} textButton="Tìm kiếm"
            onClick={onClick}
            styleTextButton={{}}
            />
        </div>
    )
}

export default ButtonInputSearch