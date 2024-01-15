import {collection, getDocs, limit, onSnapshot, orderBy, query} from "firebase/firestore";
import {useEffect, useState} from "react";
import styled from "styled-components";
import {db} from "../firebase";
import Tweet from "./tweet";
import {Unsubscribe} from 'firebase/auth'

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

  // 개발모드에서는 react.js가 useEffect를 2번 호출
  useEffect(()=> {

    let unsubscribe : Unsubscribe | null = null;
    const fetchTweets = async () => {
      // 1. 쿼리 작성
      const tweetsQuery = query(
        // 어떤 컬렉션을 쿼리하고싶은지 설정
        collection(db, 'tweets'),
        // 최신 순으로 정렬하기
        orderBy('createdAt', 'desc'),
        // 25개씩만 보이게 제한을 둠(페이지네이션)
        limit(25)
      )
      /*
      // 2-1. 문서를 가져와 쿼리를 넘겨주면 된다 -> getDocs함수가 스냅샷을 찍어서 알려준다
      const snapshot = await getDocs(tweetsQuery)
      // 즉, 쿼리의 스냅샷을 받아서 쿼리에 반환된 각 문서 내부의 데이터를 보여준다
      // 모든 문서마다 아래와같은 객체를 만들어준다
      const tweets = snapshot.docs.map((doc) => {
        const { tweet, createdAt, userId, username, photo } = doc.data()
        return {
          tweet, createdAt, userId, username, photo,
          id: doc.id // id 정보는 한단계 위에 존재라 따로
        }
      }) */

      // 2-2. 데이터베이스 및 쿼리와 실시간 연결하기
      // 문서를 한번만 가져오는 대신 쿼리에 리스너 추가
      // 이벤트 리스너를 연결 해 해당 쿼리가 업데이트 될 떄 알려줌
      // 업데이트된 것을 가져와 필요한 데이터 추출 -> map으로 배열로 보여줌
      // 유저가 이 페이지에 들어와서 타임라인 컴포넌트가 마운트 되면 이벤트리스너가 구독됨, 언마운트하면 구독취소
      // unsubscribe라는 변수에 리턴된 unsubscribe 함수를 저장할 것
      // TODO - 아래 onSnapshot앞에 await 붙여야된다는데 오류뜸
      unsubscribe =  onSnapshot(tweetsQuery, (snapshot) => {
        // 트윗 객체 생성
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, photo } = doc.data()

          return {
            tweet, createdAt, userId, username, photo,
            id: doc.id // id 정보는 한단계 위에 존재라 따로
          };
        });
        // 트윗 객체 배열들을 변수에 넣은 다음 이를 상태에 저장
        setTweets(tweets)
      });
    };
    fetchTweets();
    // useEffect의 tear down, clean up 기능 사용
    // 클린업 함수 : 사용자가 화면을 보지 않을 때(=언마운트) 값을 반환하며 클린업 함수를 실행
    // 타임라인 이벤트리스너를 계속 들을 필요, 구독할 필요가 없음
    return () => {
      // unsubscribe가 true라면(null이 아니라면) unsubscribe함수 호출
      unsubscribe && unsubscribe()
    };
  },[]);

  return (<Wrapper>
    {tweets.map((tweet) => (
      <Tweet key={tweet.id} {...tweet} />
    ))}
  </Wrapper>)
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
`