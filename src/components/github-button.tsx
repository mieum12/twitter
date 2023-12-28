import styled from "styled-components";
import { GithubAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";
import {auth} from "../firebase";
import {useNavigate} from "react-router-dom";

export default function GithubButton() {
  const navigate = useNavigate();
  const onClick = async () => {
    try{
      const provider = new GithubAuthProvider()
      // 2가지 옵션으로 깃헙 로그인 연동 가능
      await signInWithPopup(auth, provider)
      // await signInWithRedirect(auth, provider)
      navigate('/')
    } catch (e) {
      console.log(e)
    }


  }

  return <Button onClick={onClick}>
    <Logo src='/github-logo.svg'/>
    Github로 계속하기
  </Button>
}
const Button = styled.button`
  margin-top: 50px;
  background-color: white;
  color: black;
  font-weight: 500;
  width: 100%;
  padding: 10px 20px;
  border-radius: 50px;
  border: 0;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
`
const Logo = styled.img`
  height: 25px;`