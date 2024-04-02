import React from "react";
import { Link } from "react-router-dom";

const LinkComponent = (props)=>{
    const {children,to,style,state,colorOnMouseEnter,colorOnMouseLeave} = props
    return (
        <Link to={to} style={style}
        onMouseEnter={(e) => e.target.style.color = colorOnMouseEnter}
        onMouseLeave={(e) => e.target.style.color = colorOnMouseLeave}
        >
           {children}
        </Link>
      );
}

export default LinkComponent