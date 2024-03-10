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

export const routes = [
    {   
        path:'/',
        page:HomePage,
        isShowHeader:true
    },
    {
        path:'/order',
        page:OrderPage,
        isShowHeader:true
    },
    {
        path:'/product',
        page:ProductPage,
        isShowHeader:true
    },
    {
        path:'/product/:type',
        page:TypeProductPage,
        isShowHeader:true
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
        path:'/system/admin',
        page:AdminPage,
        isShowHeader:false,
        isPrivate: true
    },
    {
        path:'*',
        page:NotFoundPage,
        isShowHeader:false
    }
]