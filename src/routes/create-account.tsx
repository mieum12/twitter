
import React, {useState} from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {auth} from "../firebase";
import {Link, useNavigate} from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {Input, Switcher, Title, Wrapper, Error, Form} from "../components/auth-components";
import GithubButton from "../components/github-button";


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
    setError('') // 새로고침하면 초기화
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

      if(e instanceof FirebaseError){
        console.log(e.code, e.message)
        setError(e.message)
      }
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
    <Switcher>
      이미 회원이신가요? <Link to='/login'>로그인 &rarr;</Link>
    </Switcher>
    <GithubButton />
  </Wrapper>
}
