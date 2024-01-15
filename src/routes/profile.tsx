import {auth, storage} from "../firebase";
import styled from "styled-components";
import React, {useState} from "react";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {updateProfile} from "firebase/auth";

export default function Profile(){
  const user = auth.currentUser
  const [avatar, setAvatar] = useState(user?.photoURL)
  const onAvatarChange = async (e:React.ChangeEvent<HTMLInputElement>) => {
    const {files} = e.target
    if (!user) return;

    if(files && files.length===1) {
      const file = files[0]
      // 1. user 이미지를 저장할 수 있는 ref를 만들어야한다
      // 기존의 이미지를 덮어쓰기할 것이기때문에 유저아이디로 프로필 파일 이름을 저장한다
      const locationRef = ref(storage, `avatars/${user?.uid}`)
      // 2. 파일 저장
      const result = await uploadBytes(locationRef, file)
      // 3. 저장된 파일의 url을 가져옴, 상태도 함께 업데이트
      const avatarUrl = await getDownloadURL(result.ref)
      setAvatar(avatarUrl)
      // 4. 유저 프로필 업데이트
      await updateProfile(user, {
        photoURL: avatarUrl
      })
    }
  }
  return (
    <Wrapper>
      <AvatarUpload htmlFor='avatar'>
        { avatar ? (
          <AvatarImg src={avatar}/>
        ) : (
          <svg
            data-slot="icon"
            fill="currentColor"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id='avatar'
        type='file'
        accept='image/*'
      />
      <Name>
        {/*
        아래처럼 짧게 줄일 수 있다!
        {user?.displayName ? user.displayName : 'Anonymous' }
        */}
        {user?.displayName ?? 'Anonymous' }
      </Name>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
`;