import { Result } from "antd";
import React from "react";

const SearchNotFound = ()=>{
    return (
        <Result style={{display:'flex',flex:1,flexDirection:'column'}}
                        status="403"
                        title="Not Found"
                        subTitle="Không tìm thấy sản phẩm   , hãy thử tìm tiếm sản phẩm khác."
                      />
    )
}

export default SearchNotFound