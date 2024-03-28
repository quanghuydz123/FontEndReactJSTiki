import React, { useEffect, useState } from "react";
import { Checkbox ,Rate} from 'antd';
import * as ProductService from '../../services/ProductService'
import { useNavigate } from "react-router-dom";

const NavbarComponent = ()=>{
    const navigate = useNavigate()
    const handleNavigateType = (type)=>{
        navigate(`/product/${type.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g,'_')}`,{state:type}) //bỏ dấu tiếng việt    
    }
    const renderContent = (type,options)=>{
        switch(type){
            case "text":
                return options.map((item,index)=>{ 
                    return(
                        <div  onClick={()=>handleNavigateType(item)} className="WrapperType">
                            <img src="https://salt.tikicdn.com/cache/100x100/ts/category/54/c0/ff/fe98a4afa2d3e5142dc8096addc4e40b.png.webp" alt="icon type" className="WrapperIconType"/>
                            <span  key={index} className="WrapperTextValue">{item}</span>
                        </div>
                    )
                })
                
            case 'checkbox':
                return  <Checkbox.Group style={{ width: '100%',display:'flex',flexDirection:'column',gap:12 }} >
                    {
                        options.map((item,index)=>{
                            return <Checkbox key={index} value={item.value}>{item.lable}</Checkbox>
                        })
                    }   
            
              </Checkbox.Group>
            case 'star':
                return options.map((item,index)=>{
                    return  (
                        <>
                           <div style={{display:'flex',gap:4}}>
                                <Rate key={index} disabled defaultValue={item} />
                                <span className="">từ {item} sao</span>
                           </div>
                        </>
                    
                    )
                })
            case 'price':
                return options.map((item)=>{
                    return <div className="WrapperPrice">{item}</div>
                })
          

            default:
                return {}
        }
    }
    const [typeProducts,setTypeProducts]= useState([])
    const fetchAllTypeProduct = async(  )=>{
        const res = await ProductService.getAllTypeProduct()
        setTypeProducts(res?.data)
    }

    useEffect(()=>{
        fetchAllTypeProduct()
    },[])
    return (
        <div>
            <h4 className="WrapperLableText">Danh mục sản phẩm</h4>
            <div className="WrapperContent">
                {renderContent('text', typeProducts)}
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