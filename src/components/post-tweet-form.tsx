import styled from "styled-components";
import React, {useState} from "react";
import { addDoc, collection } from "firebase/firestore";
import {auth, db} from "../firebase";

export default function PostTweetForm(){
  const [isLoding, setLoding] = useState(false)
  const [tweet, setTweet] = useState('')
  const [file, setFile] = useState < File | null > (null)

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value)
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {files} = e.target
    if(files && files.length ===1) {
      setFile(files[0])
    }
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const user = auth.currentUser;

    if( !user || isLoding || tweet === '' || tweet.length > 180 ) return;
    
    try {
      setLoding(true)
      // 어떤 컬렉션, 어떤 경로에 새로운 document를 생성해줄지 정한다
      // 자바스크립트로 원하는 데이터를 만들면 알아서 넣어주게끔!
      await addDoc(collection(db, 'tweets'), {
        tweet,
        createdAt: Date.now(),
        username: user.displayName || 'Anonymous',
        userId: user.uid
      })
    } catch (e) {
      console.log(e)
    } finally {
      setLoding(false)
    }
  }

  return <Form onSubmit={onSubmit}>
    <TextArea rows={5} maxLength={180} onChange={onChange} value={tweet} placeholder='무슨 일이 일어나고 있나요?'/>
    <AttachFileButton htmlFor='file'>{file ? '첨부완료 ✅' : '사진첨부'}</AttachFileButton>
    <AttachFileInput onChange={onFileChange} type='file' id='file' accept='image/*'/>
    <SubmitBtn type='submit' value={isLoding ? '게시 중...':'게시하기'}/>
  </Form>
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`
const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui,-apple-system;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`
const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`
const AttachFileInput = styled.input`
  display: none;
`
const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover, &:active {
    opacity: 0.9;
  }
`