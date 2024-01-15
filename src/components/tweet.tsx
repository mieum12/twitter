import {ITweet} from "./timeLine";
import styled from "styled-components";

// Tweet은 이전에 생성한 ITweet 인터페이스를 받게 됨
// 그 인터페이스 중 원하는 것만 추출해서 가져오기 (username, photo,tweet)
export default function Tweet( {username, photo, tweet} : ITweet ) {
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
      </Column>
      <Column>
        {photo ? (<Photo src={photo}/>) : null }
      </Column>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255,255,255,0.5);
  border-radius: 15px;
`
const Column = styled.div`
  &:last-child {
    place-self: end;
  }
`
const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`
const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`
const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`