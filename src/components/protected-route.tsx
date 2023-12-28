// 로그인 한 사용자가 볼 수 있는 라우트
// 로그인하지 않은 경우 로그임 또는 계정 생성 페이지로 리다이렉트

import React from "react";
import {auth} from "../firebase";
import {Navigate} from "react-router-dom";

export default function ProtectedRoute({children}: { children: JSX.Element }){
  // firebase에 유저 정보 요청
  const user = auth.currentUser
  console.log('유저',user)
  if (user === null) {
    return <Navigate to='/login'/>
  }
  return children;
}