import styled from "styled-components";
import React, {useState} from "react";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import {auth, db, storage} from "../firebase";
import {getDownloadURL, ref, uploadBytes } from 'firebase/storage'

export default function PostTweetForm(){
  const [isLoding, setLoding] = useState(false)
  const [tweet, setTweet] = useState('')
  const [file, setFile] = useState < File | null > (null)

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value)
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {files} = e.target
    if(files && files.length ===1 && files[0].size < 1000000) {
      setFile(files[0])
    } else if (files && files.length === 1 && files[0].size >= 1000000) {
      alert('1MB 미만으로 추가해주세요');
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
      // addDoc는 생성된 document의 참조를 프로미스로 반환하기 때문에 변수로 저장해줄 수 있다
      // 결국 doc은 하나의 트윗 인 것이다!
      const doc = await addDoc(collection(db, 'tweets'), {
        tweet,
        createdAt: Date.now(),
        username: user.displayName || 'Anonymous',
        userId: user.uid
      })
      // 파일 첨부 : 파일이 있다면 위치에 대한 참조(레퍼런스)를 받아야함
      if (file) {
        // 업로드 된 파일이 저장되는 폴더명, 파일명을 정할 수 있음
        const locationRef = ref(storage, `tweets/${user.uid}-${user.displayName}/${doc.id}`)
        // uploadBytes에 파일의 저장 위치를 알려주고 파일을 넣어준다
        // 이 함수는 프로미스를 반환하는데 그 결과값에 업로드 결과에 대한 참조가 있음
        const result = await uploadBytes(locationRef, file)
        // 이미지의 url을 받아서 doc에 그 url정보를 저장하고싶음
        // getDownloadURL은 result의 퍼블릭 url을 알려준다
        // 이 함수는 스트링을 반환하는 프로미스 = 올린 사진파일의 url이다
        const url = await getDownloadURL(result.ref)
        // updateDoc는 업데이트 할 doc에 대한 참조와 업데이트 할 데이터를 필요
        // 결론: 파일을 업로드하고 그 url을 받아서, 전에 만든 트윗 doc에 저장하기
        await updateDoc(doc, {
          photo: url
        })
        setTweet('')
        setFile(null)
      }
    } catch (e) {
      console.log(e)
    } finally {
      setLoding(false)
    }
  }

  return <Form onSubmit={onSubmit}>
    <TextArea
      required
      rows={5}
      maxLength={180}
      onChange={onChange}
      value={tweet}
      placeholder='무슨 일이 일어나고 있나요?'/>
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