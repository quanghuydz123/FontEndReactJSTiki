import { Button } from "antd";
import React from "react";
import { colors } from "../../contants/index";

const ButtonComponent = ({size,styleButton,icon,styleTextButton,textButton,...rest})=>{
    return <Button 
    size={size} icon={icon} 
    style={
            {
                ...styleButton,
                backgroundColor: rest.disabled ? '#ccc' : styleButton.backgroundColor
            }
    }
    {...rest}
    ><span style={styleTextButton}>{textButton}</span></Button>
}

export default ButtonComponent