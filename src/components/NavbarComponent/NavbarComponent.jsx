import React, { useEffect, useRef, useState } from "react";
import { Menu } from 'antd';
import * as ProductService from '../../services/ProductService'
import { useNavigate } from "react-router-dom";
import * as CategoryService from '../../services/CategoryService'

const NavbarComponent = (props) => {
    const navigate = useNavigate()
    const { categoryNameChild, categoryNameParent, setCategoryNameChild, setCategoryNameParent, setNameCategorySelected, setNameCategoryChildSelected } = props
    const [categoryParent, setCategoryParent] = useState([])
    const cuont = useRef(0)
    const [items, setItems] = useState([])
    const [itemsChildAndParent, setItemsChildAndParent] = useState([])

    const handleNavigateTypeChild = (type, child) => {
        navigate(`/${type}/${child}`) //bỏ dấu tiếng việt    
    }

    const [typeProducts, setTypeProducts] = useState([])
    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        setTypeProducts(res?.data)
    }

    useEffect(() => {
        fetchAllTypeProduct()
    }, [])
    //
    const fetchAllCategoryParent = async () => {
        const res = await CategoryService.getAllCategoryParent()
        setCategoryParent(res?.data)
    }
    const fetchAllCategoryChildAndParent = async () => {
        const res = await CategoryService.getAllCategoryAndParent()
        setItemsChildAndParent(res?.data)
    }
    console.log("itemsChildAndParent", itemsChildAndParent)
    useEffect(() => {
        fetchAllCategoryParent()
    }, [])
    useEffect(()=>{
        fetchAllCategoryChildAndParent()
    },[])
    const renderCategoryChild = (id) => {
        return itemsChildAndParent.flatMap((item, index) => {
            if (item?._id?.parentId === id) {
                return item?.names?.map((name, index) => {
                    setCategoryNameChild(prev => [...prev, { id: item?.idChild[index], name: name }])
                    return getItem(name, item?.idChild[index])
                })
            }
            return [];
        }
        )
    }
    function getItem(label, key, icon, children, type) {
        return {
            key,
            icon,
            children,
            label,
            type,
        };
    }
    console.log("items",items)
    useEffect(() => {
        setItems([])
        categoryParent?.forEach((item, index) => {
            setCategoryNameParent(prev => [...prev, { id: item?._id, name: item?.name }])
            const newItems = getItem(item?.name, item?._id, <img alt="category" style={{ width: '24px', height: '24px' }} src={item?.image} />,
                renderCategoryChild(item?._id)
            )
            setItems(prev => [...prev, newItems]);
        })
    }, [categoryParent,itemsChildAndParent])
    const onClick = (e) => {
        console.log('click', e);
        setNameCategorySelected(categoryNameParent.filter((item) => item.id == e.keyPath[1])[0]?.name)
        setNameCategoryChildSelected(categoryNameChild.filter((item) => item.id == e.key)[0]?.name)
        //setIdSelectedCategoryChild(e.key)
        handleNavigateTypeChild(categoryNameParent.filter((item) => item.id == e.keyPath[1])[0]?.name,
            categoryNameChild.filter((item) => item.id == e.key)[0]?.name)
        //handleNavigateType(categoryNameParent.filter((item)=>item.id==e.keyPath[1])[0]?.name,categoryNameParent.filter((item)=>item.id==e.keyPath[1])[0]?.id)
    };



    return (
        <div style={{ minHeight: 'calc(50vh)' }}>
            <h4 className="WrapperLableText">Danh mục sản phẩm</h4>
            <div className="WrapperContent">
                <Menu
                    onClick={onClick}
                    style={{
                        width: '100%',
                    }}
                    mode="vertical"
                    items={items}
                />
            </div>
            {/* <div className="WrapperContent">
                {renderContent('checkbox', [
                    { value: 'a', lable: 'A' },
                    { valie: 'b', lable: 'B' }
                ])}
            </div>
            <div className="WrapperContent">
                {renderContent('star', [
                    3, 4, 5
                ])}
            </div>

            <div className="WrapperContent">
                {renderContent('price', [
                    'duoi 40000','tren 40000'
                ])}
            </div> */}

        </div>
    )
}

export default NavbarComponent