import React from "react";
import { Checkbox ,Rate} from 'antd';
const NavbarComponent = ()=>{
    const renderContent = (type,options)=>{
        switch(type){
            case "text":
                return options.map((item,index)=>{
                    return <span key={index} className="WrapperTextValue">{item}</span>
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
    return (
        <div>
            <h4 className="WrapperLableText">Lable</h4>
            <div className="WrapperContent">
                {renderContent('text', ['Tu lanh', 'TV', 'May giat'])}
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