import { Button } from "antd";
import React from "react";
import {
    PlusCircleOutlined 
} from '@ant-design/icons';
import TableComponent from "../TableComponent/TableComponent";

const AdminUser = ()=>{
    return (
        <div>
            <div>
                <h1 className="WapperHeaderAdmin">Quản lý người dùng</h1>
                <div style={{ marginTop: '10px' }}>
                    <Button style={{ height: '150px', width: '150px', borderRadius: '6px' }}><PlusCircleOutlined style={{ fontSize: '60px' }} /></Button>
                </div>
                <div style={{
                    marginTop:'20px'
                }}>
                    <TableComponent />
                </div>
            </div>
        </div>
    )
}

export default AdminUser