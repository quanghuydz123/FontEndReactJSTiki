import axios from "axios"
//dung để call api
export const axiosJWT = axios.create()

export const getAllCategoryParent  = async()=>{
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/category/get-all-category-parent`)
    return res.data
}   

export const getAllCategoryChild  = async()=>{
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/category/get-all-category-child`)
    return res.data
}   

export const getAllCategoryAndParent  = async()=>{
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/category/get-all-category-childAndParent`)
    return res.data
}   
export const getCategoryByIdCategoryChild  = async(childIdCategory)=>{
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/category/get-category-parentByIdCategoryChild?childIdCategory=${childIdCategory}`)
    return res.data
}   

export const createCategory  = async(data)=>{
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/category/create`,data)
    return res.data
}   








