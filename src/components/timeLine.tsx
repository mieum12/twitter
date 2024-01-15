import {collection, getDocs, orderBy, query} from "firebase/firestore";
import {useEffect, useState} from "react";
import styled from "styled-components";
import {db} from "../firebase";
import Tweet from "./tweet";

export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number
}

export default function TimeLine() {
  const [tweets, setTweets] = useState<ITweet[]>([])
  const fetchTweets = async () => {
    // 1. 쿼리 작성
    const tweetsQuery = query(
      // 어떤 컬렉션을 쿼리하고싶은지 설정
      collection(db, 'tweets'),
      // 최신 순으로 정렬하기
      orderBy('createdAt', 'desc')
    )
    // 2. 문서를 가져와 쿼리를 넘겨주면 된다 -> getDocs함수가 스냅샷을 찍어서 알려준다
    const snapshot = await getDocs(tweetsQuery)
    // 즉, 쿼리의 스냅샷을 받아서 쿼리에 반환된 각 문서 내부의 데이터를 보여준다
    // 모든 문서마다 아래와같은 객체를 만들어준다
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, username, photo } = doc.data()
      return {
        tweet, createdAt, userId, username, photo,
        id: doc.id // id 정보는 한단계 위에 존재라 따로
      }
    })
    // 트윗 배열 안에 저장한 모든 문서를 -> 상태에 저장
    setTweets(tweets)
  }
  // 개발모드에서는 react.js가 useEffect를 2번 호출
  useEffect(()=> {
    fetchTweets()
  },[])
  return <Wrapper>
    {tweets.map((tweet) => (
      <Tweet key={tweet.id} {...tweet} />
    ))}
  </Wrapper>
}

const Wrapper = styled.div``