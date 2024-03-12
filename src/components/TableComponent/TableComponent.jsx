import { Table } from "antd";
import React, { useState } from "react";
import Loading from "../LoadingComponent/Loading";

const TableComponent = (props)=>{
    const [selectionType, setSelectionType] = useState('checkbox');
    const {columns,data,isLoading,onRow,handleDeleteMany} = props  
    const [rowSelectedKey,setRowSelectedKey] = useState([])
      const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          setRowSelectedKey(selectedRowKeys)
        },
        // getCheckboxProps: (record) => ({
        //   disabled: record.name === 'Disabled User',
        //   // Column configuration not to be checked
        //   name: record.name,
        // }),
      };
      const items = [
        {
          key: '1',
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
              1st menu item
            </a>
          ),
        },
       
      ];
      const handleDeleteAll = ()=>{
        handleDeleteMany(rowSelectedKey)
      }
    return (

        <div>
          <Loading isLoading={isLoading}>
         {rowSelectedKey.length > 0 &&  <div>
            <span style={
              {
                fontWeight: 'bold',
                padding: '10px',
                cursor: 'pointer',
                background:'blue',
                color:'white',
                borderRadius:'40px'
              }
            }
              onClick={handleDeleteAll}
            >Xóa tất cả</span>
          </div> }
            <Table
                rowSelection={{
                    type: selectionType,
                    ...rowSelection,
                }}
                columns={columns}
                dataSource={data}
                onRow={onRow}
            />
            </Loading>
        </div>
    )
}

export default TableComponent