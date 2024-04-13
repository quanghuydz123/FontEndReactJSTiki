import React, { useEffect, useState } from "react";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import CardComponent from "../../components/Product/CardComponent";
import { Col, Pagination, Row } from "antd";
import { useLocation, useParams } from "react-router-dom";
import * as ProductService from '../../services/ProductService'
import Loading from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import SearchNotFound from "../../components/SearchNotFound/SearchNotFound";
import { useQuery } from "@tanstack/react-query";
import * as LikeProductService from '../../services/LikeProductService'
import colors from "../../contants/colors";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import {
    StarFilled,
    RiseOutlined,
    FallOutlined
} from '@ant-design/icons';
const TypeProductPage = () => {
    const params = useParams()
    const location = useLocation();
    const searchProduct = useSelector((state) => state?.product?.search)
    const [categoryNameParent, setCategoryNameParent] = useState([])
    const [categoryNameChild, setCategoryNameChild] = useState([])
    const [nameCategorySelected, setNameCategorySelected] = useState(params?.type)
    const [idSelectedCategoryParent, setIdSelectedCategoryParent] = useState('')
    const [idSelectedCategoryChild, setIdSelectedCategoryChild] = useState('')
    const [nameCategoryChildSelected, setNameCategoryChildSelected] = useState(params?.childType)
    //const searchDounce = useDebounce(searchProduct, 200) //sau 1 giây mới gọi API
    const [current, setCurrent] = useState('');
    const [stateButton1,setStateButton1] = useState(false)
    const [stateButton2,setStateButton2] = useState(false)
    const [stateButton3,setStateButton3] = useState(false)
    const [stateButton4,setStateButton4] = useState(false)
    const [sortField,setSortField] = useState('')
    const [sortValue,setSortByValue] = useState(0)
    const [query, setQuery] = useState('');

    const [panigate, setPanigate] = useState({
        page: 1,
        limit: 10,
        total: 1
    })
    useEffect(() => {//dùng để get qua giá trị q khi search
        const searchParams = new URLSearchParams(location?.search);
        const queryParam = searchParams.get('q');
        setQuery(queryParam);
      }, [location]);
    useEffect(() => {
        setIdSelectedCategoryParent(categoryNameParent.filter((item) => item?.name === params?.type)[0]?.id)
        setIdSelectedCategoryChild(categoryNameChild.filter((item) => item?.name === params?.childType && item?.parentId === categoryNameParent.filter((item) => item?.name === params?.type)[0]?.id)[0]?.id)
    }, [params, categoryNameParent, categoryNameChild])

    useEffect(() => {
        setCurrent(idSelectedCategoryChild)
    }, [idSelectedCategoryChild])

    // const fetchProductType = async (id, page, limit, filter) => {
    //     setLoading(true)
    //     const res = await ProductService.getProductByIdParent(id, page, limit, filter)
    //     if (res?.status === "OK") {
    //         setLoading(false)
    //         setProducts(res?.data)
    //         setPanigate({
    //             ...panigate,
    //             total: res?.totalPage
    //         })
    //     } else {
    //         setLoading(false)
    //     }
    // }
    // useEffect(() => {
    //     fetchProductType(idSelectedCategoryParent, panigate.page, panigate.limit, idSelectedCategoryChild)
    // }, [panigate.page, panigate.limit, idSelectedCategoryParent, idSelectedCategoryChild])

    
    const handleClickButtonSort = (button)=>{
        switch(button){
            case 'button1':
                setStateButton1(!stateButton1)
                setStateButton2(false)
                setStateButton3(false)
                setStateButton4(false)
                break;
            case 'button2':
                setStateButton2(!stateButton2)
                setStateButton1(false)
                setStateButton3(false)
                setStateButton4(false)
                break;
            case 'button3':
                setStateButton3(!stateButton3)
                setStateButton1(false)
                setStateButton2(false)
                setStateButton4(false)
                break;
            case 'button4':
                setStateButton4(!stateButton4)
                setStateButton2(false)
                setStateButton3(false)
                setStateButton1(false)
                break;
        }
    }
    useEffect(()=>{
        if(stateButton1){
            setSortField('selled')
            setSortByValue(-1)
        }else if(stateButton2){
            setSortField('discount')
            setSortByValue(-1)
        }else if(stateButton3){
            setSortField('price')
            setSortByValue(-1)
        }else if(stateButton4){
            setSortField('price')
            setSortByValue(1)
        }else{
            setSortField('')
            setSortByValue('')
        }
    },[stateButton1,stateButton2,stateButton3,stateButton4])
    const getAllProductType = async (context) => {
        const id = context?.queryKey && context?.queryKey[1]
        const page = context?.queryKey && context?.queryKey[2]
        const limit = context?.queryKey && context?.queryKey[3]
        const filter = context?.queryKey && context?.queryKey[4]
        const sortField = context?.queryKey && context?.queryKey[5]
        const sortValue = context?.queryKey && context?.queryKey[6]
        const query = context?.queryKey && context?.queryKey[7]
        const res = await ProductService.getProductByIdParent(id, page, limit, filter,sortField,sortValue,query)
        setPanigate({
            ...panigate,
            total: res?.totalPage
        })
        return res
    }

    const queryProductType = useQuery({
        queryKey: ['product-type', idSelectedCategoryParent, panigate.page, panigate.limit, idSelectedCategoryChild,sortField,sortValue,query],
        queryFn: getAllProductType,
        enabled: (idSelectedCategoryParent || query) && panigate.page && panigate.limit ? true : false
    })
    const { isLoading: isLoadingProductType, data: productsTypes } = queryProductType
    const onChange = (current, pageSize) => {
        setPanigate({
            ...panigate,
            page: current,
            limit: pageSize
        })
    }
    const fetchProductAllLike = async (context) => { //context get value cua useQuery
        const res = await LikeProductService.countLikeProducts()
        return res?.data

    }
    const useQueryAllLikeProducts = useQuery({
        queryKey: ['allLikeProducts'],
        queryFn: fetchProductAllLike,
    });
    const { isLoading: isLoadingAllLikeProduct, data: allLikeProducts } = useQueryAllLikeProducts
    return (
        <>
            <Loading isLoading={isLoadingProductType}>
                <div style={{ width: '100%', backgroundColor: "#efefef", minHeight: 'calc(100vh)' }}>
                    <div style={{ width: '1270px', margin: '0 auto', minHeight: 'calc(100vh)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Row style={{ flexWrap: 'nowrap', paddingTop: '10px' }}>

                            <Col span={4} style={{}} className="WrapperNavbar">
                                <NavbarComponent current={current} setPanigate={setPanigate} categoryNameChild={categoryNameChild} categoryNameParent={categoryNameParent} setNameCategorySelected={setNameCategorySelected} setNameCategoryChildSelected={setNameCategoryChildSelected} setCategoryNameParent={setCategoryNameParent} setCategoryNameChild={setCategoryNameChild} />
                            </Col>

                            <Col span={20} style={{ marginLeft: '10px' }}>
                                <div className="WrapperLabelTypeProduct">
                                    {query ? <span style={{ color: colors.colorPrimaryHeader, fontSize: '26px' }}>Tìm kiếm</span> :
                                    <span style={{ color: colors.colorPrimaryHeader, fontSize: '26px' }}>
                                    {nameCategorySelected && nameCategorySelected}
                                    {nameCategoryChildSelected && ' / '}
                                    {nameCategoryChildSelected && nameCategoryChildSelected}
                                </span>}
                                    <div>
                                        <span style={{ margin: '0px 0px 0px ',fontWeight:'500' }}>Sắp xếp theo</span>
                                        <ButtonComponent
                                            size={20}
                                            icon={<StarFilled style={stateButton1 ? {color:'white'} :{color:'rgb(128, 138, 148)'}}/>}
                                            onClick={()=>handleClickButtonSort('button1')}
                                            styleButton={stateButton1 ? {
                                                height: '30px',
                                                width: '120px',
                                                borderRadius: '4px',
                                                padding: '2px 6px 6px',
                                                backgroundColor: colors.colorPrimaryHeader,
                                                margin: '0 8px'
                                            }:{
                                                height: '30px',
                                                width: '120px',
                                                borderRadius: '4px',
                                                padding: '2px 6px 6px',
                                                backgroundColor: 'white',
                                                margin: '0 8px'
                                            }}
                                            textButton={"Nổi bật"}
                                            styleTextButton={
                                                stateButton1 ? { color: 'white', fontSize: '14px' } :
                                                { color: 'rgb(128, 138, 148)', fontSize: '14px' }
                                                } />

                                        <ButtonComponent
                                            size={20}
                                            icon={<StarFilled style={stateButton2 ? {color:'white'} :{color:'rgb(128, 138, 148)'}}/>}
                                            onClick={()=>handleClickButtonSort('button2')}
                                            styleButton={stateButton2 ? {
                                                height: '30px',
                                                width: '120px',
                                                borderRadius: '4px',
                                                padding: '2px 6px 6px',
                                                backgroundColor: colors.colorPrimaryHeader,
                                                margin: '0 8px'
                                            }:{
                                                height: '30px',
                                                width: '120px',
                                                borderRadius: '4px',
                                                padding: '2px 6px 6px',
                                                backgroundColor: 'white',
                                                margin: '0 8px'
                                            }}
                                            textButton={"Giảm nhiều"}
                                            styleTextButton={
                                                stateButton2 ? { color: 'white', fontSize: '14px' } :
                                                { color: 'rgb(128, 138, 148)', fontSize: '14px' }
                                                } />

                                        <ButtonComponent
                                            size={20}
                                            icon={<FallOutlined style={stateButton3 ? {color:'white'} :{color:'rgb(128, 138, 148)'}}/>}
                                            onClick={()=>handleClickButtonSort('button3')}
                                            styleButton={stateButton3 ? {
                                                height: '30px',
                                                width: '120px',
                                                borderRadius: '4px',
                                                padding: '2px 6px 6px',
                                                backgroundColor: colors.colorPrimaryHeader,
                                                margin: '0 8px'
                                            }:{
                                                height: '30px',
                                                width: '120px',
                                                borderRadius: '4px',
                                                padding: '2px 6px 6px',
                                                backgroundColor: 'white',
                                                margin: '0 8px'
                                            }}
                                            textButton={"Giá cao - thấp"}
                                            styleTextButton={
                                                stateButton3 ? { color: 'white', fontSize: '14px' } :
                                                { color: 'rgb(128, 138, 148)', fontSize: '14px' }
                                                } />

                                            <ButtonComponent
                                            size={20}
                                            icon={<RiseOutlined style={stateButton4 ? {color:'white'} :{color:'rgb(128, 138, 148)'}}/>}
                                            onClick={()=>handleClickButtonSort('button4')}
                                            styleButton={stateButton4 ? {
                                                height: '30px',
                                                width: '120px',
                                                borderRadius: '4px',
                                                padding: '2px 6px 6px',
                                                backgroundColor: colors.colorPrimaryHeader,
                                                margin: '0 8px'
                                            }:{
                                                height: '30px',
                                                width: '120px',
                                                borderRadius: '4px',
                                                padding: '2px 6px 6px',
                                                backgroundColor: 'white',
                                                margin: '0 8px'
                                            }}
                                            textButton={"Giá thấp - cao"}
                                            styleTextButton={
                                                stateButton4 ? { color: 'white', fontSize: '14px' } :
                                                { color: 'rgb(128, 138, 148)', fontSize: '14px' }
                                                } />
                                    </div>
                                </div>
                                <div className="WrapperProductsType">
                                {/* ?.filter(item => item.name.toLowerCase().includes(searchDounce.toLowerCase())) seach thủ công */}
                                    {productsTypes?.data?.length !== 0 ? productsTypes?.data?.map((product, index) => {
                                        return <CardComponent 
                                            key={index}
                                            countInStock={product.countInStock}
                                            description={product.description}
                                            image={product.image}
                                            name={product.name}
                                            price={product.price}
                                            rating={product.rating}
                                            type={product.type}
                                            selled={product.selled}
                                            discount={product.discount}
                                            id={product._id}
                                            totalLike={allLikeProducts?.filter((item) => item._id.product === product._id)[0]?.totalLikes}
                                            typePage={true}
                                        />
                                    }) : <SearchNotFound />}
                                </div>


                            </Col>


                        </Row>
                        <Pagination
                            showSizeChanger
                            //onShowSizeChange={onShowSizeChange}
                            defaultCurrent={panigate.page}
                            onChange={onChange}
                            total={panigate.total * 10}
                            style={{
                                textAlign: 'center',
                                marginBottom: '20px'
                            }}
                        />
                    </div>
                </div>
            </Loading>
        </>
    )
}

export default TypeProductPage