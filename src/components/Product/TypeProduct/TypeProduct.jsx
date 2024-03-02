import React from "react";

const TypeProduct = (props)=>{
    const {name,mr,p} = props
    return (
        <div style={{marginRight:mr,padding:p}}>
            {name}
        </div>
    )
}

export default TypeProduct