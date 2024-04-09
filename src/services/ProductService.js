import axios from "axios"
import { axiosJWT } from "./UserService"


export const getAllProduct  = async(search,limit)=>{
        let res = {}
        if(search?.length > 0){
            res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAllProduct?filter=name&filter=${search}&limit=${limit}`)
        }
        else{
            if(limit){
                res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAllProduct?limit=${limit}`)
            }
            else{
                res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAllProduct`)
            }
        }
        return res.data
}

export const getProductType  = async(type,page,limit)=>{
    let res = {}
    if(type){
        res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAllProduct?filter=type&filter=${type}&limit=${limit}&page=${page}`)
    }
    return res.data
}

export const createProduct  = async(data)=>{
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/create`,data)
    return res.data
}

export const getDetailsProduct  = async(id)=>{
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/details/${id}`)
    return res.data
}

export const getAllTypeProduct  = async()=>{
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all-type`)
    return res.data
}

export const updateProduct  = async(id,access_token,data)=>{
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/product/update/${id}`,data.stateProductDetals,{
        headers:{
            token: `Bearer ${access_token}`
        }
    })
    return res.data
}

export const deleteProduct  = async(id,access_token)=>{
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/product/delete-product/${id}`,{
        headers:{
            token: `Bearer ${access_token}`
        }
    })
    return res.data
}

export const deleteManyProduct  = async(ids,access_token)=>{
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/product/delete-many`,{
        headers:{
            token: `Bearer ${access_token}`
        },
        data: ids // Truyền dữ liệu ids vào tham số data
    })
    return res.data
}

export const getProductByIdParent  = async(id,page,limit,filter,sortField,sortValue)=>{
    let res = {}
    if(filter){
        if(limit){
            res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAllProductByParentCategory?filter=${filter}&limit=${limit}&page=${page}&sortField=${sortField}&sortValue=${sortValue}`)
        }
        else{
            res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAllProductByParentCategory?filter=${filter}&sortField=${sortField}&sortValue=${sortValue}`)
        }
    }
    else if(id){
        res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAllProductByParentCategory?id=${id}&limit=${limit}&page=${page}&sortField=${sortField}&sortValue=${sortValue}`)
    }
    return res.data
}
