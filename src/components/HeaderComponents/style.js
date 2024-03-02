import { Row } from "antd";
import styled from "styled-components";

export const WapperHeader = styled(Row)`
    padding: 10px 120px;
    background-color: rgb(26,148,255)   
`

export const WapperTextHeader = styled.span`
    font-size:18px;
    color:#fff;
    font-weight:bold;
    text-align:left;
    cursor:pointer
`

export const WapperHeaderAccuont = styled.div`
    display: flex;
    align-items:center; 
    color:#fff;
    gap:10px;
    margin-left:20px;
    font-size:12px
`

export const WapperContentPopup = styled.p`
    cursor: pointer;
    &:hover{
        color: red
    }
`
