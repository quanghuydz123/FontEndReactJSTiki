import React from "react";
import Header from "../HeaderComponents/Header";

const DefaultComponents = ({children})=>{
    return (
        <div>
               <Header />
               <div className="">
                    {children}
               </div>
               
        </div>
    )
}

export default DefaultComponents