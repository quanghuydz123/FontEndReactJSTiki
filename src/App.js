import React, { Fragment, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage/Home'
import OrderPage from './pages/OrderPage/OrderPage'
import { routes } from './routes'
import Header from './components/HeaderComponents/Header'
import DefaultComponents from './components/DefaultComponents/DefaultComponents'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { isJsonString } from './utils'
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector} from 'react-redux'
import { updateUser } from "./redux/slides/userSlide";
import * as UserService from './services/UserService'
import { useLayoutEffect } from 'react'
import Loading from './components/LoadingComponent/Loading'
import Cookies from 'js-cookie';

function App() {
  // const fetchApi = async () => {
  //   const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAllProduct`) //lấy data api
  //   return res.data
  // }
  // const query = useQuery({ queryKey: ['todos'], queryFn: fetchApi })
  const dispatch = useDispatch()
  const [loading,setLoading] = useState(false)
  const user = useSelector((state) => state.user)
  useEffect(() => {//lưu data token thi load lại web
    setLoading(true)
    let storageData = localStorage.getItem('access_token')
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData)
      const decoded = jwtDecode(storageData);
      if (decoded?.id) {
        handleGetDetailsUser(decoded?.id, storageData)
      }
    }
    setLoading(false)
  }, [])

  UserService.axiosJWT.interceptors.request.use(async function (config) {//xử lý token hết hạn
    // Do something before request is sent
    const  currentTime = new Date
    const {decoded} = handleDecoded()
    const allCoki = Cookies.get()
    if(decoded?.exp < currentTime.getTime() / 1000){
        const data = await UserService.refreshToken()
        config.headers['token'] = `Bearer ${data?.access_token}`
      
    }
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  const handleDecoded = ()=>{
    let storageData = localStorage.getItem('access_token')
    let decoded = {}
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData)
      decoded = jwtDecode(storageData);
    }
    return {decoded,storageData}
  }
  const handleGetDetailsUser = async (id,token)=>{
    const res = await UserService.getDetailsUser(id,token)
    dispatch(updateUser({...res?.data,access_token:token}))
}
  return (
    <div>
      <Loading isLoading={loading}>
        <Router>
          <Routes>
            {
              routes.map((item, index) => {
                const Page = item.page
                const checkAuth = !item.isPrivate || user.isAdmin
                const Layout = item.isShowHeader ? DefaultComponents : Fragment
                const path = checkAuth ? item.path : null //phân loại admin
                return (
                  <Route key={index} path={path} element=
                  {
                    <Layout>
                      <Page />
                    </Layout>
                  } />
                )
              })
            }

          </Routes>
        </Router>
      </Loading>
    </div>
  )
}

export default App