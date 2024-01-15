import {auth, db, storage} from "../firebase";
import styled from "styled-components";
import React, {useEffect, useState} from "react";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {updateProfile} from "firebase/auth";
import {collection, getDocs, limit, orderBy, query, where} from "firebase/firestore";
import {ITweet} from "../components/timeLine";
import Tweet from "../components/tweet";

export default function Profile(){
  const user = auth.currentUser
  const [avatar, setAvatar] = useState(user?.photoURL)
  const [tweets,setTweets] = useState<ITweet[]>([])
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

  const fetchTweets = async () => {
    // 여기서는 내가 작성한 트윗만 보여주는 쿼리를 만들 것
    const tweetQuery = query(
      collection(db,'tweets'),
      // 트윗의 유저 아이디가 현재 로그인한 유저 아이디와 같은지 필터해주는 함수
      // 주의: 이런 필터를 사용할 것이라고 firestore에 알려야한다 -> 에러 링크로 가서 색인 생성
      // 아니면 The query requires an index. 라는 에러가 뜰 것이다
      where('userId', '==', user?.uid),
      orderBy('createdAt','desc'),
      limit(25)
    );
    // getDocs에 쿼리를 전달해주면 스냅샷 반환
    const snapshot = await getDocs(tweetQuery)
    const tweets = snapshot.docs.map((doc)=>{
      const {tweet, createdAt, userId, username, photo} = doc.data()
      return {
        tweet, createdAt, userId, username, photo,
        id: doc.id
      };
    });
    setTweets(tweets)
  }
  useEffect(()=>{
    fetchTweets()
  },[])
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
      <Tweets>
        {tweets.map(tweet => <
          Tweet key={tweet.id} {...tweet}/>
        )}
      </Tweets>
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

const Tweets = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`
