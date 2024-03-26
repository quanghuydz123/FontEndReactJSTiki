import axios from "axios"
//dung để call api
export const axiosJWT = axios.create()

export const createLikeProduct  = async(data)=>{
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/like-product/create`,data)
    return res.data
}

export const getDetailsLikeProduct  = async(product,user)=>{
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/like-product/get-details-like-product?product=${product}&user=${user}`);
    return res.data
}

export const countLikeProducts  = async()=>{
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/like-product/count-like-products`);
    return res.data
}



