import axios from "axios"
//dung để call api
export const axiosJWT = axios.create()

export const loginUser  = async(data)=>{
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/sign-in`,data)
    return res.data
}

export const signupUser  = async(data)=>{
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/sign-up`,data)
    return res.data
}

export const getDetailsUser  = async(id,access_token)=>{
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/get-details/${id}`,{
        headers:{
            token: `Bearer ${access_token}`
        }
    })
    return res.data
}

export const refreshToken  = async()=>{
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/refresh-token`,{
        withCredentials: true//tự dộng lấy cookie
    })
    return res.data
}

export const loguotUser  = async()=>{
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/log-out`)
    return res.data
}

export const updateUser  = async (id, data, access_token)=>{
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/user/update-user/${id}`,data,{
        headers:{
            token: `Bearer ${access_token}`
        }
    })
    return res.data
}







