import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Layout from "./components/layout";
import Home from "./routes/home";
import Profile from "./routes/profile";
import Login from "./routes/login";
import CreateAccount from "./routes/create-account";
import styled, {createGlobalStyle} from "styled-components";
import reset from "styled-reset";
import {useEffect, useState} from "react";
import LoadingScreen from "./components/loading-screen";
import {auth} from "./firebase";
import ProtectedRoute from "./components/protected-route";

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute><Layout/></ProtectedRoute>,
    children:[
      {
        path: '',
        element: <Home/>
      },
      {
        path: 'profile',
        element: <Profile/>
      }
    ]
  },
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/create-account',
    element: <CreateAccount/>
  }
])

const GlobalStyles = createGlobalStyle`
  ${reset}
  * {
    box-sizing: border-box;
  }
  body {
    background-color: black;
    color: white;
    font-family: system-ui, -apple-system;
  }
`

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const init = async ()=>{
    // fire base가 로그인 여부나 유저가 누구인지 확인할 떄까지 기다리는 부분
    await auth.authStateReady()
    // fire base가 로딩이 완료되면
    setIsLoading(false)

  }

  useEffect(()=>{
    init()
  },[])
  return <Wrapper>
    <GlobalStyles/>
    {isLoading ? <LoadingScreen/> : <RouterProvider router={router}/>}
  </Wrapper>
}

export default App;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
`