import axios from "axios"
import { axiosJWT } from "./UserService"


export const getAllProduct  = async(limit)=>{
        let res = {}
        if(limit){
            res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAllProduct?limit=${limit}`)
        }
        else{
            res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAllProduct`)
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

export const getProductByIdParent  = async(id,page,limit,filter,sortField,sortValue,query)=>{
    let res = {}
    if(query){
        if(limit){
            if(sortField){
                res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAllProductByParentCategory?query=${query}&limit=${limit}&page=${page}&sortField=${sortField}&sortValue=${sortValue}`)
            }else{
                res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAllProductByParentCategory?query=${query}&limit=${limit}&page=${page}`)
            }
        }
        else{
            if(sortField){
                res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAllProductByParentCategory?query=${query}&sortField=${sortField}&sortValue=${sortValue}`)
            }else{
                res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAllProductByParentCategory?query=${query}`)
            }
        }
    }
    else if(filter){
        if(limit){
            if(sortField){
                res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAllProductByParentCategory?filter=${filter}&limit=${limit}&page=${page}&sortField=${sortField}&sortValue=${sortValue}`)
            }else{
                res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAllProductByParentCategory?filter=${filter}&limit=${limit}&page=${page}`)
            }
        }
        else{
            if(sortField){
                res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAllProductByParentCategory?filter=${filter}&sortField=${sortField}&sortValue=${sortValue}`)
            }else{
                res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAllProductByParentCategory?filter=${filter}`)
            }
        }
    }
    else if(id){
       if(sortField){
        res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAllProductByParentCategory?id=${id}&limit=${limit}&page=${page}&sortField=${sortField}&sortValue=${sortValue}`)
       }else{
        res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAllProductByParentCategory?id=${id}&limit=${limit}&page=${page}`)
       }
    }
    return res.data
}


export const getAllProductGroupByChildCategory  = async()=>{
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAllProductGroupByChildCategory`)
    return res.data
}