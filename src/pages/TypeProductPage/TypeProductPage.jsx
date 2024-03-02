import React, { Fragment } from "react";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import CardComponent from "../../components/Product/CardComponent";
import { Col, Pagination, Row } from "antd";
import TypeProduct from "../../components/Product/TypeProduct/TypeProduct";

const TypeProductPage = ()=>{
    const arr = ['TV','Tu lanh','Lap top']
    return (
        <>
           
            <div className="container" style={{ backgroundColor: "#efefef" }}>

                <Row style={{ flexWrap: 'nowrap', paddingTop: '10px' }}>

                    <Col span={4} style={{}} className="WrapperNavbar">
                        <NavbarComponent />
                    </Col>

                    <Col span={20} style={{ marginLeft: '10px' }} className="WrapperProducts">
                        <CardComponent />
                        <CardComponent />
                        <CardComponent />
                        <CardComponent />
                        <CardComponent />
                        <CardComponent />
                        <CardComponent />
                        <CardComponent />
                    </Col>


                </Row>
                <Pagination
                    showSizeChanger
                    //onShowSizeChange={onShowSizeChange}
                    defaultCurrent={3}
                    total={500}
                    style={{
                        textAlign:'center',
                        marginTop:'10px'
                    }}
                />
            </div>
        </>
    )
}

export default TypeProductPage