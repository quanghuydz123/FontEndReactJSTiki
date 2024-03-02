import { Input } from "antd";
import React, { useState } from "react";

const InputFormComponent = (props)=>{
    const {placeholder,style,type,handleOnChange,value,...rest} = props
    const newStyle={
        ...style,
        height:'32px'
    }
    return (
        <>
           <Input className="WrapperInputStyle" 
           placeholder={placeholder} 
           value={value} 
           style={newStyle} 
           type={type} 
           {...rest}
           onChange={handleOnChange}
           />
        </>
    )
}

export default InputFormComponent