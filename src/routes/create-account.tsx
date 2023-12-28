import styled from "styled-components";
import React, {useState} from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {auth} from "../firebase";
import {useNavigate} from "react-router-dom";

export default function CreateAccount(){
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
    const {target:{name, value}} = e
    if(name === 'name'){
      setName(value)
    } else if (name === 'email'){
      setEmail(value)
    } else if (name === 'password'){
      setPassword(value)
    }
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // 1. 계정 생성
    // 2. 유저 프로필 지정
    // 3. 홈으로 리다이렉트
    console.log(name, email, password)

    if (isLoading || name === '' || email === ''|| password === '') return

    try{
      setIsLoading(true)
      // createUserWithEmailAndPassword 함수
      // 이 함수가 성공하면 유저의 자격 증명(credentials)을 받게 됨
      // 또한 사용자는 바로 로그인 된다
      // 이미 존재하는 유저거나 비번이 유효하지 않으면 실패함
      const credentials = await createUserWithEmailAndPassword(auth,email,password)
      console.log(credentials.user) //유저의 정보를 얻을 수 있다
      await updateProfile(credentials.user, {
        displayName: name
      })
      navigate('/')
    } catch(e) {

    } finally {
      setIsLoading(false)
    }
  }

  return <Wrapper>
    <Title>Join 𝕏</Title>
    <Form onSubmit={onSubmit}>
      <Input onChange={onChange} name='name' value={name} placeholder='Name' type='text' required/>
      <Input onChange={onChange} name='email' value={email} placeholder='Email' type='email' required/>
      <Input onChange={onChange} name='password' value={password} placeholder='Password' type='password' required/>
      <Input type='submit' value={isLoading ? 'Loading...' : 'Create Account'}/>
    </Form>
    {error !== '' ? <Error>{error}</Error> : null}
  </Wrapper>
}

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0px;
`
const Title = styled.h1`
  font-size: 42px
`
const Form = styled.form`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`
const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;
  &[type='submit']{
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`
const Error = styled.span`
  font-weight: 600;
  color: tomato;
  `