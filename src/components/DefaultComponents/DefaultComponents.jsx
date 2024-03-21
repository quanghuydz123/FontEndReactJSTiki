import React from "react";
import Header from "../HeaderComponents/Header";
import FooterCompoent from "../FooterComponent/FooterCompoent";

const DefaultComponents = ({children})=>{
    return (
        <div>
               <Header />
               <div className="" >
                    {children}
               </div>
               <FooterCompoent />
        </div>
    )
}

export default DefaultComponents