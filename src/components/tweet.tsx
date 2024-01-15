import {ITweet} from "./timeLine";
import styled from "styled-components";
import {auth, db, storage} from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import {deleteObject, ref } from "firebase/storage";

// Tweet은 이전에 생성한 ITweet 인터페이스를 받게 됨
// 그 인터페이스 중 원하는 것만 추출해서 가져오기 (username, photo,tweet)
export default function Tweet( {username, photo, tweet, userId, id} : ITweet ) {
  const user = auth.currentUser
  const onDelete = async () => {
    const ok = window.confirm('이 트윗을 정말로 삭제하시겠습니까?')

    if (!ok || user?.uid !== userId) return;
    try {
      // 삭제할 문서에 대한 참조를 넣어주면 삭제
      // doc 함수를 통해 문서를 찾아온다: 만든 db안에 tweet 컬렉션 안에 존재, 문서 id는 timeline 컨포넌트에서 가져옴
      await deleteDoc(doc(db,'tweets',id ))
      if (photo) {
        // 우리가 만든 경로를 이용해 사진을 참조하고 있음
        // 위에서 트윗을 생성할 때 쓰는 경로와 같다
        // 이전에 우리는 사진 명과 트윗 아이디가 같게 지어줬다
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`)
        await deleteObject(photoRef)
      }
    } catch (e) {
      console.log(e)
    } finally {
      //
    }
  }
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
        { user?.uid === userId ? <DeleteButton onClick={onDelete}>Delete</DeleteButton> : null }
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

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`