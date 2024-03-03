import { Drawer } from "antd";
import React from "react";
const DrawerComponent = ({children,title='Drawer',placement='right',isOpen='false', ...rest})=>{

   
    return (
        <>
              
            <Drawer title={title} open={isOpen} placement={placement} {...rest}>
                {children}
            </Drawer>
        </>
    )
}

export default DrawerComponent