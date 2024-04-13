import AdminPage from "../pages/AdminPage/AdminPage";
import HomePage from "../pages/HomePage/Home";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage";
import ProductPage from "../pages/ProductsPage/ProductPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import OrderSuccess from "../pages/OrderSuccess/OrderSuccess";
import MyOrderPage from "../pages/MyOrderPage/MyOrderPage";
import DetailsOrderPage from "../pages/DetailsOrderPage/DetailsOrderPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage/ForgotPasswordPage";

export const routes = [
    {   
        path:'/',
        page:HomePage,
        isShowHeader:true
    },
    {
        path:'/system/admin/manager',
        page:AdminPage,
        isShowHeader:false,
        isPrivate: true,

    },
    {
        path:'/order',
        page:OrderPage,
        isShowHeader:true
    },
    {
        path:'/my-order',
        page:MyOrderPage,
        isShowHeader:true
    },
    {
        path:'/details-order/:id',
        page:DetailsOrderPage,
        isShowHeader:true
    },
    {
        path:'/orderSuccess',
        page:OrderSuccess,
        isShowHeader:true
    },
    {
        path:'/payment',
        page:PaymentPage,
        isShowHeader:true
    },
    
    // {
    //     path:'/product',
    //     page:ProductPage,
    //     isShowHeader:true
    // },
    {
        path:'/:type',
        page:TypeProductPage,
        isShowHeader:true
    },
    {
        path:'/search',
        page:TypeProductPage,
        isShowHeader:true
    },
    {
        path:'/:type/:childType',
        page:TypeProductPage,
        isShowHeader:true,
    },
    {
        path:'/sign-in',
        page:SignInPage,
        isShowHeader:false
    },
    {
        path:'/sign-up',
        page:SignUpPage,
        isShowHeader:false
    },
    {
        path:'/forgot-password',
        page:ForgotPasswordPage,
        isShowHeader:false
    },
    {
        path:'/product-detail/:id',
        page:ProductDetailPage,
        isShowHeader:true
    },
    {
        path:'/profile-user',
        page:ProfilePage,
        isShowHeader:true
    },

    {
        path:'*',
        page:NotFoundPage,
        isShowHeader:false
    }
]