import { Menu } from "antd";
import React, { useState } from "react";
import { getItem } from "../../utils";
import { AppstoreOutlined, UserOutlined,BarChartOutlined } from '@ant-design/icons';
import Header from "../../components/HeaderComponents/Header";
import AdminUser from "../../components/AdminComponent/AdminUser"
import AdminProduct from "../../components/AdminComponent/AdminProduct";
import AdminStatistic from "../../components/AdminComponent/AdminStatistic";
const AdminPage = ()=>{
    const items = [
        getItem('Thống kê', 'statistical', <BarChartOutlined />),
        getItem('Người dùng', 'user', <UserOutlined />),
        getItem('Sản phẩm', 'product', <AppstoreOutlined />),
      ];
    // const rootSubmenuKeys = ['user', 'product'];
    // const [openKeys, setOpenKeys] = useState(['user']);
    const renderPage = (key) =>{
        switch(key){
            case 'user':
                return <AdminUser />
            case 'product':
                return <AdminProduct />
            case 'statistical':
                return <AdminStatistic />
            default:
                return <></>
        }
    }
    const [keySelected,setKeySelected] = useState('user')
    // const onOpenChange = (keys) => {
    //   const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    //   if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
    //     setOpenKeys(keys);
    //   } else {
    //     setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    //   }
    // };
    const hanleOnClick =({ item, key, keyPath, domEvent })=>{
        setKeySelected(key)
    }
    return (
        
       <>
       <Header isHiddenSearch isHiddenCart isAdmin/>
        <div style={{display:'flex'}}>
            <Menu
                mode="inline"
                // openKeys={openKeys}
                // onOpenChange={onOpenChange}
                style={{
                    width: 256,
                    boxShadow:'1px 1px 2px #ccc',
                    height:'100vh',
                }}
                items={items}
                selectedKeys={[keySelected]}
                onClick={hanleOnClick}
            />
            <div style={{flex:1,padding:'15px'}}>
                {renderPage(keySelected)}
            </div>
        </div>
       </>
  );
}

export default AdminPage