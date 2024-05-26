import React from "react";

const ContainerComponent = ({children,style})=>{
    return (
        <div className="container" style={style}>
            {children}
        </div>
    )
}

export default ContainerComponent