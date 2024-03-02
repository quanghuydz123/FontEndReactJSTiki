import { Input } from "antd";
import React from "react";

const InputComponent = (props)=>{
    const {size,placeholder,style,value,...rests} = props
    return <>
        <Input size={size} placeholder={placeholder} value={value}  style={style} {...rests}/>
    </>
}

export default InputComponent